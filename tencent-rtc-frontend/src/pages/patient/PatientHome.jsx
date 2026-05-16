// PatientHome.jsx

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

function PatientHomePage() {
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState("");
  const [submittedSymptoms, setSubmittedSymptoms] = useState("");

  useEffect(() => {
    console.log("Patient Home Loaded");
  }, []);

  // Function for entering symptoms
  function enterSymptoms() {
    setSubmittedSymptoms(symptoms);

    alert("Symptoms submitted successfully.");
  }

  // Function for beginning consultation
  function beginConsultation() {
    navigate("/patientconsult");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>Patient Home</h1>

        <p style={{ color: "#555", marginBottom: "30px" }}>
          Enter your symptoms before beginning your consultation.
        </p>

        {/* Symptoms Input UI */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            Symptoms
          </label>

          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms here..."
            rows={6}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              resize: "none",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={enterSymptoms}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#4f46e5",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Submit Symptoms
          </button>

          <button
            onClick={beginConsultation}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#16a34a",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Begin Consultation
          </button>
        </div>

        {/* Submitted Symptoms Preview */}
        {submittedSymptoms && (
          <div
            style={{
              marginTop: "30px",
              backgroundColor: "#eef2ff",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h3>Submitted Symptoms</h3>

            <p>{submittedSymptoms}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PatientConsult() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Patient Consultation</h1>

      <p>
        This page represents the separate PatientConsult.jsx consultation
        component.
      </p>
    </div>
  );
}

export default function PatientHome() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientHomePage />} />
        <Route path="/patientconsult" element={<PatientConsult />} />
      </Routes>
    </BrowserRouter>
  );
}