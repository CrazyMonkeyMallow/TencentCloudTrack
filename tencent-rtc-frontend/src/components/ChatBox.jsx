import { useState } from 'react';

export default function ChatBox({ messages, onSend, role, disabled }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setError('');

    try {
      await onSend(text, role);
      setText('');
    } catch (err) {
      setError(err.message || 'Could not send message');
    }
  }

  return (
    <div style={styles.wrap}>
      <h3 style={styles.title}>Chat</h3>
      <div style={styles.list}>
        {messages.length === 0 && (
          <p style={styles.empty}>No messages yet.</p>
        )}
        {messages.map((m, i) => (
          <div key={`${m.time}-${i}`} style={styles.msg}>
            <strong>{m.sender === 'doctor' ? 'Doctor' : 'Patient'}:</strong> {m.text}
          </div>
        ))}
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          disabled={disabled}
        />
        <button type="submit" style={styles.btn} disabled={disabled || !text.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrap: { marginTop: 16, maxWidth: 680 },
  title: { margin: '0 0 8px', fontSize: '1rem' },
  list: {
    height: 140,
    overflowY: 'auto',
    background: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  empty: { color: '#94a3b8', margin: 0 },
  msg: { marginBottom: 8, fontSize: '0.9rem' },
  error: { color: '#dc2626', fontSize: 13, margin: '0 0 8px' },
  form: { display: 'flex', gap: 8 },
  input: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
  },
  btn: {
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
  },
};
