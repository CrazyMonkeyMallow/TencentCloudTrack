import { useNavigate } from "react-router-dom";

const fakeHistory = [
  {
    id: 1,
    date: "2026-05-14",
    doctor: "Dr. Chen",
    symptoms: "Chest pain, shortness of breath",
    advice: "Rest, avoid strenuous activity. Take prescribed medication.",
  },
  {
    id: 2,
    date: "2026-05-10",
    doctor: "Dr. Wang",
    symptoms: "High fever, headache",
    advice: "Stay hydrated, take paracetamol every 6 hours.",
  },
  {
    id: 3,
    date: "2026-05-02",
    doctor: "Dr. Li",
    symptoms: "Sprained ankle",
    advice: "Ice and elevate for 48 hours. Avoid walking.",
  },
];

export default function PatientHistory() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate("/patient")}>
        ← Back
      </button>
      <h2 style={styles.title}> My Consultation History</h2>

      {fakeHistory.map((item) => (
        <div key={item.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.date}>{item.date}</span>
            <span style={styles.doctor}>{item.doctor}</span>
          </div>
          <p style={styles.label}>Symptoms</p>
          <p style={styles.value}>{item.symptoms}</p>
          <p style={styles.label}>Doctor's Advice</p>
          <p style={styles.value}>{item.advice}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 640,
    margin: "2rem auto",
    fontFamily: "sans-serif",
    padding: "1rem",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#00796b",
    fontSize: "1rem",
    cursor: "pointer",
    marginBottom: "1rem",
  },
  title: {
    color: "#00796b",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
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
  doctor: { color: "#1565c0", fontWeight: "bold", fontSize: "0.9rem" },
  label: { color: "#aaa", fontSize: "0.8rem", margin: "0.5rem 0 0.2rem" },
  value: { color: "#333", fontSize: "0.95rem", margin: 0 },
};