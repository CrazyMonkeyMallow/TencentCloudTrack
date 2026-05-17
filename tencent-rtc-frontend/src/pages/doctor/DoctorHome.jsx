import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function DoctorHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState('');

  const loadPending = useCallback(async () => {
    try {
      const list = await api.getPendingCalls();
      setCalls(list);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPending();
    const timer = setInterval(loadPending, 3000);
    return () => clearInterval(timer);
  }, [loadPending]);

  async function handleAccept(consultationId) {
    setAcceptingId(consultationId);
    try {
      const { roomId } = await api.acceptCall(consultationId);
      navigate('/doctor/consult', {
        state: { roomId, consultationId },
      });
    } catch (err) {
      setError(err.message || 'Could not accept call');
    } finally {
      setAcceptingId(null);
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Doctor Dashboard</h1>
          <p style={styles.sub}>Dr. {user?.name}</p>
        </div>
        <div style={styles.headerActions}>
          <Link to="/doctor/history" style={styles.historyLink}>
            History
          </Link>
          <button type="button" style={styles.linkBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.card}>
        <h2 style={styles.sectionTitle}>Pending consultations</h2>
        <p style={styles.pollHint}>Refreshes every 3 seconds</p>

        {error && <p style={styles.error}>{error}</p>}
        {loading && calls.length === 0 && <p>Loading…</p>}
        {!loading && calls.length === 0 && (
          <p style={styles.empty}>No patients waiting right now.</p>
        )}

        {calls.map((call) => (
          <div key={call.id} style={styles.callCard}>
            <div>
              <h3 style={styles.patientName}>{call.patientName}</h3>
              <p style={styles.symptoms}>{call.symptoms}</p>
              <p style={styles.time}>
                Waiting since {new Date(call.startedAt).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              style={styles.acceptBtn}
              disabled={acceptingId === call.id}
              onClick={() => handleAccept(call.id)}
            >
              {acceptingId === call.id ? 'Joining…' : 'Accept & join'}
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f7fb',
    padding: 24,
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    maxWidth: 720,
    margin: '0 auto 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: { display: 'flex', gap: 12, alignItems: 'center' },
  title: { margin: 0 },
  sub: { margin: '4px 0 0', color: '#64748b' },
  historyLink: { color: '#2563eb', textDecoration: 'none', fontWeight: 600 },
  linkBtn: {
    background: 'none',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    padding: '8px 12px',
    cursor: 'pointer',
  },
  card: {
    maxWidth: 720,
    margin: '0 auto',
    background: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  sectionTitle: { marginTop: 0 },
  pollHint: { color: '#94a3b8', fontSize: 13, marginTop: -8 },
  empty: { color: '#64748b' },
  callCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
  },
  patientName: { margin: '0 0 8px' },
  symptoms: { margin: '0 0 4px', color: '#334155' },
  time: { margin: 0, fontSize: 13, color: '#94a3b8' },
  acceptBtn: {
    padding: '10px 18px',
    border: 'none',
    borderRadius: 8,
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  error: { color: '#dc2626' },
};
