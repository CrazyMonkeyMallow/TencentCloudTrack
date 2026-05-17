import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function PatientHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startConsultation() {
    if (!symptoms.trim()) {
      setError('Please describe your symptoms before starting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { consultationId, roomId } = await api.initiateCall(symptoms.trim());
      navigate('/patient/consult', {
        state: { roomId, consultationId },
      });
    } catch (err) {
      setError(err.message || 'Could not start consultation');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Patient Home</h1>
          <p style={styles.sub}>Hello, {user?.name}</p>
        </div>
        <button type="button" style={styles.linkBtn} onClick={logout}>
          Logout
        </button>
      </header>

      <main style={styles.card}>
        <label style={styles.label}>Symptoms</label>
        <textarea
          style={styles.textarea}
          rows={5}
          placeholder="Describe your symptoms…"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          type="button"
          style={styles.primary}
          onClick={startConsultation}
          disabled={loading}
        >
          {loading ? 'Starting call…' : 'Start video consultation'}
        </button>

        <p style={styles.hint}>
          A doctor can accept your call from their dashboard.{' '}
          <Link to="/patient/history">View history →</Link>
        </p>
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
    maxWidth: 640,
    margin: '0 auto 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { margin: 0 },
  sub: { margin: '4px 0 0', color: '#64748b' },
  linkBtn: {
    background: 'none',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    padding: '8px 12px',
    cursor: 'pointer',
  },
  card: {
    maxWidth: 640,
    margin: '0 auto',
    background: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  label: { fontWeight: 600, display: 'block', marginBottom: 8 },
  textarea: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    resize: 'vertical',
    boxSizing: 'border-box',
    marginBottom: 16,
  },
  primary: {
    width: '100%',
    padding: 14,
    border: 'none',
    borderRadius: 10,
    background: '#16a34a',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
  },
  error: { color: '#dc2626' },
  hint: { marginTop: 16, color: '#64748b', fontSize: 14 },
};
