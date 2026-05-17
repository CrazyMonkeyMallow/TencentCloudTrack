import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTRTC } from '../../hooks/useTRTC';
import VideoRoom from '../../components/VideoRoom';
import ChatBox from '../../components/ChatBox';
import api from '../../api';

// location.state: { roomId, consultationId }
export default function PatientConsult() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialRoomId = state?.roomId;
  const consultationId = state?.consultationId;

  const [phase, setPhase] = useState('waiting');
  const [roomId, setRoomId] = useState(initialRoomId);
  const [doctorName, setDoctorName] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const activeRoomId = phase === 'active' ? roomId : null;
  const { localStream, remoteStream, messages, sendMessage, hangUp, joined, error: trtcError } =
    useTRTC(activeRoomId, String(user?.id), 'patient', consultationId);

  useEffect(() => {
    if (!consultationId || phase === 'notes' || phase === 'report') return undefined;

    async function pollStatus() {
      try {
        const call = await api.getPatientCallStatus();
        if (!call || call.consultationId !== consultationId) return;

        setError('');
        setRoomId(call.roomId);
        setDoctorName(call.doctorName || '');

        if (call.status === 'active') {
          setPhase('active');
        } else if (call.status === 'ended') {
          await hangUp();
          setPhase('notes');
        } else if (call.status === 'completed') {
          const notes = await api.checkNotes(consultationId);
          if (notes.ready) {
            setReport(notes);
            setPhase('report');
          }
        }
      } catch (err) {
        setError(err.message || 'Could not refresh consultation status');
      }
    }

    pollStatus();
    const timer = setInterval(pollStatus, 3000);
    return () => clearInterval(timer);
  }, [consultationId, phase, hangUp]);

  useEffect(() => {
    if (phase !== 'notes' || !consultationId) return undefined;

    async function pollNotes() {
      try {
        const data = await api.checkNotes(consultationId);
        if (data.ready) {
          setReport(data);
          setPhase('report');
        }
      } catch (err) {
        setError(err.message || 'Could not check doctor notes');
      }
    }

    pollNotes();
    const timer = setInterval(pollNotes, 3000);
    return () => clearInterval(timer);
  }, [phase, consultationId]);

  async function handleHangUp() {
    await hangUp();

    try {
      await api.endCall(consultationId, messages);
    } catch (err) {
      console.error('endCall failed', err);
    }

    setPhase('notes');
  }

  if (!roomId || !consultationId) {
    return (
      <p style={{ padding: '24px' }}>
        Missing consultation data. Please start from Patient Home.
      </p>
    );
  }

  return (
    <div style={styles.page}>
      {phase === 'waiting' && (
        <section style={styles.panel}>
          <h1 style={styles.title}>Waiting for a doctor</h1>
          <p style={styles.sub}>
            Your consultation request is in the queue. This screen checks every 3 seconds.
          </p>
          <div style={styles.pulse}>Pending</div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="button" style={styles.secondary} onClick={() => navigate('/patient/home')}>
            Cancel and go back
          </button>
        </section>
      )}

      {phase === 'active' && (
        <>
          <header style={styles.callHeader}>
            <div>
              <h1 style={styles.title}>Video consultation</h1>
              <p style={styles.sub}>{doctorName ? `Connected with Dr. ${doctorName}` : 'Doctor connected'}</p>
            </div>
            <button onClick={handleHangUp} disabled={!joined} style={styles.button}>
              Hang Up
            </button>
          </header>
          {trtcError && (
            <div style={styles.errorBox}>
              {trtcError.includes('Permission denied') || trtcError.includes('NotAllowedError')
                ? 'Camera or microphone permission was blocked. Allow camera and microphone for localhost:3000, then refresh this page.'
                : trtcError}
            </div>
          )}
          <VideoRoom localStream={localStream} remoteStream={remoteStream} />
          <ChatBox messages={messages} onSend={sendMessage} role="patient" disabled={!joined} />
        </>
      )}

      {phase === 'notes' && (
        <section style={styles.panel}>
          <h1 style={styles.title}>Waiting for doctor notes</h1>
          <p style={styles.sub}>
            The video call has ended. Your report will appear as soon as the doctor submits it.
          </p>
          <div style={styles.pulse}>Checking notes</div>
          {error && <p style={styles.error}>{error}</p>}
        </section>
      )}

      {phase === 'report' && report && (
        <ReportModal report={report} onClose={() => navigate('/patient/history')} />
      )}
    </div>
  );
}

function ReportModal({ report, onClose }) {
  const notes = report.doctorNotes || {};
  const structured = typeof notes === 'object';

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h1 style={styles.title}>Consultation report</h1>

        <h2 style={styles.sectionTitle}>Doctor notes</h2>
        {structured ? (
          <>
            <ReportField label="Diagnosis" value={notes.diagnosis} />
            <ReportField label="Medication advice" value={notes.medicationAdvice} />
            <ReportField label="Precautions" value={notes.precautions} />
          </>
        ) : (
          <p style={styles.reportText}>{notes}</p>
        )}

        <h2 style={styles.sectionTitle}>Chat log</h2>
        <div style={styles.chatLog}>
          {report.chatLog.length === 0 && <p style={styles.empty}>No chat messages.</p>}
          {report.chatLog.map((message, index) => (
            <p key={`${message.time}-${index}`} style={styles.chatLine}>
              <strong>{message.sender === 'doctor' ? 'Doctor' : 'Patient'}:</strong> {message.text}
            </p>
          ))}
        </div>

        <button type="button" style={styles.primary} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}

function ReportField({ label, value }) {
  return (
    <div style={styles.reportField}>
      <strong>{label}</strong>
      <p style={styles.reportText}>{value || 'Not provided'}</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: 24,
    background: '#f4f7fb',
    fontFamily: 'system-ui, sans-serif',
  },
  panel: {
    maxWidth: 560,
    margin: '48px auto',
    background: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  callHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    maxWidth: 680,
    marginBottom: 16,
  },
  title: { margin: 0 },
  sub: { color: '#64748b', margin: '8px 0 18px' },
  pulse: {
    display: 'inline-block',
    padding: '8px 12px',
    borderRadius: 8,
    background: '#dbeafe',
    color: '#1d4ed8',
    fontWeight: 700,
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '1rem',
  },
  primary: {
    width: '100%',
    padding: 12,
    border: 'none',
    borderRadius: 8,
    background: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
  },
  secondary: {
    marginTop: 18,
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    background: '#fff',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(15, 23, 42, 0.45)',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '88vh',
    overflowY: 'auto',
    background: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
  },
  sectionTitle: { margin: '24px 0 10px', fontSize: '1.05rem' },
  reportField: {
    padding: '10px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  reportText: { margin: '6px 0 0', color: '#334155', whiteSpace: 'pre-wrap' },
  chatLog: {
    background: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
  },
  chatLine: { margin: '0 0 8px' },
  empty: { color: '#94a3b8', margin: 0 },
  error: { color: '#dc2626' },
  errorBox: {
    maxWidth: 680,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    background: '#fee2e2',
    color: '#991b1b',
  },
};
