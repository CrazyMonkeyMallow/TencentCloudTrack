import { useNavigate } from "react-router-dom";

const fakeHistory = [
  {
    id: 1,
    date: "2026-05-14",
    patient: "Patient A",
    symptoms: "Chest pain, shortness of breath",
    notes: "Advised rest and medication. Follow up in 3 days.",
  },
  {
    id: 2,
    date: "2026-05-10",
    patient: "Patient B",
    symptoms: "High fever, headache",
    notes: "Prescribed paracetamol. Recommended blood test if fever persists.",
  },
  {
    id: 3,
    date: "2026-05-02",
    patient: "Patient C",
    symptoms: "Sprained ankle",
    notes: "RICE method recommended. X-ray if no improvement in 48h.",
  },
];

export default function DoctorHistory() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate("/doctor")}>
        ← Back
      </button>
      <h2 style={styles.title}>📁 My Consultation Records</h2>

      {fakeHistory.map((item) => (
        <div key={item.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.date}>{item.date}</span>
            <span style={styles.patient}>{item.patient}</span>
          </div>
          <p style={styles.label}>Reported Symptoms</p>
          <p style={styles.value}>{item.symptoms}</p>
          <p style={styles.label}>Your Notes</p>
          <p style={styles.value}>{item.notes}</p>
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
    color: "#1565c0",
    fontSize: "1rem",
    cursor: "pointer",
    marginBottom: "1rem",
  },
  title: {
    color: "#1565c0",
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
  patient: { color: "#00796b", fontWeight: "bold", fontSize: "0.9rem" },
  label: { color: "#aaa", fontSize: "0.8rem", margin: "0.5rem 0 0.2rem" },
  value: { color: "#333", fontSize: "0.95rem", margin: 0 },
};