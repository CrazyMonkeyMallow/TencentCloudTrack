import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Call() {
  const navigate = useNavigate();

  const startCall = async () => {
    const res = await axios.post("http://localhost:3001/create-room", {
      userId: "user123",
    });

    navigate("/video", { state: { roomId: res.data.roomId } });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Connecting to doctor...</h2>

      <button onClick={startCall}>
        Start Call
      </button>
    </div>
  );
}