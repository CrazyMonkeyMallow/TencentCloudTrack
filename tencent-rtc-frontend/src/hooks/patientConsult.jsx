import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTRTC } from '../../hooks/useTRTC';
import VideoRoom from '../../components/VideoRoom';
import ChatBox from '../../components/ChatBox';
import api from '../../api';

// location.state ：
// { roomId, consultationId }
export default function PatientConsult() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { roomId, consultationId } = state || {};

  const { localStream, remoteStream, messages, sendMessage, hangUp, joined } =
    useTRTC(roomId, String(user.id), 'patient');

  async function handleHangUp() {
    await hangUp();

    await api.endCall(consultationId, messages);

    navigate('/patient/waiting-notes', { state: { consultationId } });
  }

  if (!roomId) return <p>fail</p>;

  return (
    <div>
      <VideoRoom localStream={localStream} remoteStream={remoteStream} />
      <ChatBox messages={messages} onSend={sendMessage} role="patient" />
      <button onClick={handleHangUp} disabled={!joined}>
        hangup
      </button>
    </div>
  );
}
