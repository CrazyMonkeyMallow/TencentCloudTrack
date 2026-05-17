import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const password = 'demo123456';

export default function DemoBootstrap() {
  const { role, demoId } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [message, setMessage] = useState('Preparing demo session...');
  const startedRef = useRef(false);

  useEffect(() => {
    async function start() {
      if (startedRef.current) return;
      startedRef.current = true;

      const safeRole = role === 'doctor' ? 'doctor' : 'patient';
      const email = `${safeRole}-${demoId}@demo.local`;
      const name = safeRole === 'doctor' ? 'Demo Doctor' : 'Demo Patient';

      setMessage(`Signing in as ${name}...`);

      let data;
      try {
        data = await api.register({ name, email, password, role: safeRole });
      } catch (err) {
        data = await api.login({ email, password });
      }

      login(data.user, data.token);

      if (safeRole === 'patient') {
        setMessage('Starting a demo consultation...');
        const call = await api.initiateCall('Demo symptoms: cough, sore throat, and mild fever.');
        navigate('/patient/consult', { replace: true, state: call });
      } else {
        navigate('/doctor/home', { replace: true });
      }
    }

    start().catch((err) => {
      setMessage(err.message || 'Could not start demo session');
    });
  }, [demoId, login, navigate, role]);

  return (
    <div style={styles.page}>
      <div style={styles.panel}>
        <h1 style={styles.title}>Demo setup</h1>
        <p style={styles.message}>{message}</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f4f7fb',
    fontFamily: 'system-ui, sans-serif',
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    background: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  title: { margin: 0 },
  message: { color: '#475569' },
};
