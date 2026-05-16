import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Emergency Support System</h1>
      <button onClick={() => navigate("/call")}>Call</button>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/patient/history")}>
          Patient History
        </button>
        <button onClick={() => navigate("/doctor/history")}>
          Doctor History
        </button>
      </div>
    </div>
  );
}