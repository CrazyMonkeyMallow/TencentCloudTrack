import { useEffect, useRef, useState } from 'react';
import TRTC from 'trtc-js-sdk';
 
const API_BASE = 'http://localhost:3001';
 
// roomId: string, userId: string, role: 'patient' | 'doctor'
export function useTRTC(roomId, userId, role) {
  const clientRef = useRef(null);
  const localStreamRef = useRef(null);
 
  const [remoteStream, setRemoteStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
 
  useEffect(() => {
    if (!roomId || !userId) return;
    let cancelled = false;
 
    async function init() {
      // 1. take userSig
      const res = await fetch(`${API_BASE}/usersig?userId=${userId}`);
      const { userSig, sdkAppId } = await res.json();
 
      if (cancelled) return;
 
      // TRTC client
      const client = TRTC.createClient({
        mode: 'rtc',
        sdkAppId,
        userId,
        userSig,
      });
      clientRef.current = client;
 
      // listen for remote stream
      client.on('stream-added', (e) => {
        client.subscribe(e.stream);
      });
      client.on('stream-subscribed', (e) => {
        setRemoteStream(e.stream);
      });
      client.on('stream-removed', () => {
        setRemoteStream(null);
      });
 
      // listen for custom messages (text chat)
      client.on('custom-message-received', (e) => {
        try {
          const msg = JSON.parse(e.data);
          setMessages((prev) => [...prev, msg]);
        } catch (_) {}
      });
 
      // join
      await client.join({ roomId: Number(roomId) });
 
      // local stream
      const localStream = TRTC.createStream({
        userId,
        audio: true,
        video: true,
      });
      localStreamRef.current = localStream;
      await localStream.initialize();
      await client.publish(localStream);
 
      if (!cancelled) setJoined(true);
    }
 
    init().catch(console.error);
 
    return () => {
      cancelled = true;
      hangUp();
    };
  }, [roomId, userId]);
 
  // textmessage
  function sendMessage(text) {
    if (!clientRef.current || !text.trim()) return;
    const msg = { sender: role, text, time: Date.now() };
    clientRef.current.sendCustomMessage({
      data: JSON.stringify(msg),
    });
    setMessages((prev) => [...prev, msg]);
  }
 
  // hangup
  async function hangUp() {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.stop();
        localStreamRef.current.close();
        localStreamRef.current = null;
      }
      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current.destroy();
        clientRef.current = null;
      }
    } catch (_) {}
    setJoined(false);
  }
 
  return { remoteStream, localStream: localStreamRef.current, messages, sendMessage, hangUp, joined };
}