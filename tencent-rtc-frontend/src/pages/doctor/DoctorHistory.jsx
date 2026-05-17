import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryCard from '../../components/HistoryCard';
import api from '../../api';

export default function DoctorHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const records = await api.getHistory();
        setHistory(records);
      } catch (err) {
        setError(err.message || 'Unable to load history');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={styles.container}>
      <button type="button" style={styles.backBtn} onClick={() => navigate('/doctor/home')}>
        ← Back
      </button>
      <h2 style={styles.title}>My consultation records</h2>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading…</p>}
      {!loading && history.length === 0 && <p>No records yet.</p>}

      {history.map((item) => (
        <HistoryCard
          key={item.id}
          date={new Date(item.startedAt).toLocaleString()}
          person={item.patientName || 'Patient'}
          symptoms={item.symptoms}
          note={item.status}
          noteLabel="Status"
        />
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 640,
    margin: '2rem auto',
    fontFamily: 'system-ui, sans-serif',
    padding: '1rem',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#00796b',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  title: { marginBottom: '1.5rem' },
  error: { color: '#dc2626' },
};
