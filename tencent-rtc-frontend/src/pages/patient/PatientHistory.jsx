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
      <h2 style={styles.title}>📋 My Consultation History</h2>
      {history.map((item) => (
        <HistoryCard
          key={item.id}
          date={item.date}
          person={item.doctor}
          symptoms={item.symptoms}
          note={item.advice}
          noteLabel="Doctor's Advice"
        />
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