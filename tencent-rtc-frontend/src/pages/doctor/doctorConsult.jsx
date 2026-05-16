import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTRTC } from '../../hooks/useTRTC';
import VideoRoom from '../../components/VideoRoom';
import ChatBox from '../../components/ChatBox';
import api from '../../api';

// location.state
// { roomId, consultationId }
export default function DoctorConsult() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { roomId, consultationId } = state || {};

  const { localStream, remoteStream, messages, sendMessage, hangUp, joined } =
    useTRTC(roomId, String(user.id), 'doctor');

  async function handleHangUp() {
    await hangUp();
  
    await api.endCall(consultationId, messages);

    navigate('/doctor/notes', { state: { consultationId, chatLog: messages } });
  }

  if (!roomId) return <p>recall</p>;

  return (
    <div>
      <VideoRoom localStream={localStream} remoteStream={remoteStream} />
      <ChatBox messages={messages} onSend={sendMessage} role="doctor" />
      <button onClick={handleHangUp} disabled={!joined}>
        hangup
      </button>
    </div>
  );
}
