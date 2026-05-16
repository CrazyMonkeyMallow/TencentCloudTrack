import { useEffect, useRef } from "react";

export default function VideoCall() {
  const videoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      });
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Video Call</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "300px", background: "black" }}
      />
    </div>
  );
}