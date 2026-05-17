import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTRTC } from '../../hooks/useTRTC';
import VideoRoom from '../../components/VideoRoom';
import ChatBox from '../../components/ChatBox';
import api from '../../api';

// location.state: { roomId, consultationId }
export default function DoctorConsult() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { roomId, consultationId } = state || {};

  const { localStream, remoteStream, messages, sendMessage, hangUp, joined, error } =
    useTRTC(roomId, String(user?.id), 'doctor', consultationId);

  async function handleHangUp() {
    await hangUp();

    try {
      await api.endCall(consultationId, messages);
    } catch (err) {
      console.error('endCall failed', err);
    }

    navigate('/doctor/notes', {
      state: {
        consultationId,
        chatLog: messages,
      },
    });
  }

  if (!roomId || !consultationId) {
    return <p style={{ padding: '24px' }}>Missing consultation data. Please accept a call from Doctor Home.</p>;
  }

  return (
    <div style={{ padding: '24px' }}>
      {error && (
        <div style={styles.errorBox}>
          {error.includes('Permission denied') || error.includes('NotAllowedError')
            ? 'Camera or microphone permission was blocked. Allow camera and microphone for localhost:3000, then refresh this page.'
            : error}
        </div>
      )}
      <VideoRoom localStream={localStream} remoteStream={remoteStream} />
      <ChatBox messages={messages} onSend={sendMessage} role="doctor" />
      <button onClick={handleHangUp} disabled={!joined} style={styles.button}>
        Hang Up
      </button>
    </div>
  );
}

const styles = {
  button: {
    marginTop: '20px',
    padding: '12px 20px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  errorBox: {
    maxWidth: 680,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    background: '#fee2e2',
    color: '#991b1b',
  },
};
