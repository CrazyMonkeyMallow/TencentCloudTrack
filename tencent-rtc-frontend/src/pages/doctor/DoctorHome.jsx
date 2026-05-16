// DoctorHome.jsx

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [consultationQueue, setConsultationQueue] = useState([]);
  const [callNotifications, setCallNotifications] = useState([]);

  useEffect(() => {
    // Sample incoming consultation queue
    setConsultationQueue([
      {
        id: 1,
        patientName: "Emily Carter",
        concern: "Chest pain and dizziness",
        waitTime: "5 mins",
      },
      {
        id: 2,
        patientName: "Michael Lee",
        concern: "Persistent fever",
        waitTime: "12 mins",
      },
      {
        id: 3,
        patientName: "Sophia Nguyen",
        concern: "Severe headache",
        waitTime: "18 mins",
      },
    ]);

    // Sample call notifications
    setCallNotifications([
      {
        id: 1,
        patientName: "Daniel Kim",
        status: "Consultation completed",
        time: "10:15 AM",
      },
      {
        id: 2,
        patientName: "Olivia Brown",
        status: "Missed consultation",
        time: "11:02 AM",
      },
    ]);
  }, []);

  // Navigate to DoctorConsult.jsx
  function clickButton(patient) {
    navigate("/doctor-consult", {
      state: {
        patient,
      },
    });
  }

  // Navigate to DoctorHistory.jsx
  function clickCallLog(notification) {
    navigate("/doctor-history", {
      state: {
        notification,
      },
    });
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Doctor Dashboard</h1>

      {/* Incoming Consultation Queue */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Incoming Consultation Queue
        </h2>

        {consultationQueue.map((patient) => (
          <div key={patient.id} style={styles.card}>
            <div>
              <h3 style={styles.patientName}>
                {patient.patientName}
              </h3>

              <p style={styles.text}>
                <strong>Health Concern:</strong>{" "}
                {patient.concern}
              </p>

              <p style={styles.text}>
                <strong>Waiting Time:</strong>{" "}
                {patient.waitTime}
              </p>
            </div>

            <button
              style={styles.primaryButton}
              onClick={() => clickButton(patient)}
            >
              Check Patient
            </button>
          </div>
        ))}
      </div>

      {/* Call Notifications */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Call Notifications
        </h2>

        {callNotifications.map((notification) => (
          <div key={notification.id} style={styles.card}>
            <div>
              <h3 style={styles.patientName}>
                {notification.patientName}
              </h3>

              <p style={styles.text}>
                <strong>Status:</strong>{" "}
                {notification.status}
              </p>

              <p style={styles.text}>
                <strong>Time:</strong>{" "}
                {notification.time}
              </p>
            </div>

            <button
              style={styles.secondaryButton}
              onClick={() =>
                clickCallLog(notification)
              }
            >
              Review Consultation History
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DoctorHome() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DoctorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f7fb",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },

  title: {
    textAlign: "center",
    marginBottom: "40px",
    color: "#1e293b",
  },

  section: {
    marginBottom: "40px",
  },

  sectionTitle: {
    marginBottom: "20px",
    color: "#334155",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  patientName: {
    margin: 0,
    marginBottom: "8px",
    color: "#0f172a",
  },

  text: {
    margin: "4px 0",
    color: "#475569",
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  secondaryButton: {
    backgroundColor: "#0f766e",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};