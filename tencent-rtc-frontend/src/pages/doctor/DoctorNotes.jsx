import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';

export default function DoctorNotes() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const consultationId = state?.consultationId;
  const [diagnosis, setDiagnosis] = useState('');
  const [medicationAdvice, setMedicationAdvice] = useState('');
  const [precautions, setPrecautions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!diagnosis.trim() && !medicationAdvice.trim() && !precautions.trim()) {
      setError('Please enter your clinical notes.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.submitNotes(consultationId, {
        diagnosis,
        medicationAdvice,
        precautions,
      });
      navigate('/doctor/history');
    } catch (err) {
      setError(err.message || 'Failed to submit notes');
    } finally {
      setLoading(false);
    }
  }

  if (!consultationId) {
    return (
      <div style={{ padding: 24 }}>
        <p>No consultation selected.</p>
        <button type="button" onClick={() => navigate('/doctor/home')}>
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Submit doctor notes</h1>
        <p style={styles.sub}>Consultation #{consultationId}</p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Diagnosis</label>
          <textarea
            style={styles.textarea}
            rows={4}
            placeholder="Working diagnosis and clinical impression"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
          <label style={styles.label}>Medication advice</label>
          <textarea
            style={styles.textarea}
            rows={4}
            placeholder="Medication recommendations, dosage, or non-drug care"
            value={medicationAdvice}
            onChange={(e) => setMedicationAdvice(e.target.value)}
          />
          <label style={styles.label}>Precautions and follow-up</label>
          <textarea
            style={styles.textarea}
            rows={4}
            placeholder="Warning signs, precautions, and follow-up instructions"
            value={precautions}
            onChange={(e) => setPrecautions(e.target.value)}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.submit} disabled={loading}>
            {loading ? 'Saving…' : 'Submit notes'}
          </button>
        </form>
      </div>
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
  card: {
    maxWidth: 560,
    margin: '0 auto',
    background: '#fff',
    padding: 24,
    borderRadius: 16,
  },
  sub: { color: '#64748b' },
  label: { display: 'block', fontWeight: 600, marginBottom: 8 },
  textarea: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    boxSizing: 'border-box',
    marginBottom: 12,
  },
  submit: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: 8,
    background: '#0f766e',
    color: '#fff',
    cursor: 'pointer',
  },
  error: { color: '#dc2626' },
};
