import { useEffect, useRef } from 'react';

// localStream, remoteStream: TRTC Stream 
export default function VideoRoom({ localStream, remoteStream }) {
  const localRef = useRef(null);
  const remoteRef = useRef(null);

  useEffect(() => {
    if (localStream && localRef.current) {
      localStream.play(localRef.current);
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteRef.current) {
      remoteStream.play(remoteRef.current);
    }
  }, [remoteStream]);

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div>
        <p>me</p>
        <div ref={localRef} style={{ width: 320, height: 240, background: '#000' }} />
      </div>
      <div>
        <p>they</p>
        <div
          ref={remoteRef}
          style={{ width: 320, height: 240, background: '#111' }}
        />
      </div>
    </div>
  );
}
