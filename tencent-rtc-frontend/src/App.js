import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Call from "./pages/Call";
import VideoCall from "./pages/VideoCall";
import PatientHistory from "./pages/patient/PatientHistory";
import DoctorHistory from "./pages/doctor/DoctorHistory";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/call" element={<Call />} />
      <Route path="/video" element={<VideoCall />} />
      <Route path="/patient/history" element={<PatientHistory />} />
      <Route path="/doctor/history" element={<DoctorHistory />} />
    </Routes>
  );
}