import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryCard from "../../components/HistoryCard";
import { getDoctorHistory } from "../../api/index";

export default function DoctorHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getDoctorHistory().then((data) => setHistory(data));
  }, []);

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate("/doctor")}>
        ← Back
      </button>
      <h2 style={styles.title}>📁 My Consultation Records</h2>
      {history.map((item) => (
        <HistoryCard
          key={item.id}
          date={item.date}
          person={item.patient}
          symptoms={item.symptoms}
          note={item.notes}
          noteLabel="Your Notes"
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
    color: "#3b90f0",
    fontSize: "1rem",
    cursor: "pointer",
    marginBottom: "1rem",
  },
  title: {
    color: "#3b90f0",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
};