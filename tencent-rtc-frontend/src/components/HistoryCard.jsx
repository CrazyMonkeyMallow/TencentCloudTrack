export default function HistoryCard({ date, person, personLabel, symptoms, note, noteLabel }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.date}>{date}</span>
        <span style={styles.person}>{person}</span>
      </div>
      <p style={styles.label}>Symptoms</p>
      <p style={styles.value}>{symptoms}</p>
      <p style={styles.label}>{noteLabel}</p>
      <p style={styles.value}>{note}</p>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: 12,
    padding: "1.2rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.8rem",
  },
  date: { color: "#888", fontSize: "0.9rem" },
  person: { color: "#1565c0", fontWeight: "bold", fontSize: "0.9rem" },
  label: { color: "#aaa", fontSize: "0.8rem", margin: "0.5rem 0 0.2rem" },
  value: { color: "#333", fontSize: "0.95rem", margin: 0 },
};