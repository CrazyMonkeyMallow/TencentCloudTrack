import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryCard from "../../components/HistoryCard";
import { getPatientHistory } from "../../api/index";

export default function PatientHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getPatientHistory().then((data) => setHistory(data));
  }, []);

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
    color: "#f7c933",
    fontSize: "1rem",
    cursor: "pointer",
    marginBottom: "1rem",
  },
  title: {
    color: "#f7c933",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
};