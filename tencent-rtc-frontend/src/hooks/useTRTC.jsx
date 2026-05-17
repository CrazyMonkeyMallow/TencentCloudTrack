import { useEffect, useRef, useState, useCallback } from 'react';
import TRTC from 'trtc-js-sdk';
import api from '../api';

// roomId: numeric string from backend, userId: logged-in user id
export function useTRTC(roomId, userId, role, consultationId) {
  const clientRef = useRef(null);
  const localStreamRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState(null);

  const hangUp = useCallback(async () => {
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
    setLocalStream(null);
    setRemoteStream(null);
    setJoined(false);
  }, []);

  useEffect(() => {
    if (!roomId || !userId) return;
    let cancelled = false;

    async function init() {
      try {
        const { userSig, sdkAppId } = await api.getUserSig(String(userId));
        if (cancelled) return;

        const client = TRTC.createClient({
          mode: 'rtc',
          sdkAppId: Number(sdkAppId),
          userId: String(userId),
          userSig,
        });
        clientRef.current = client;

        client.on('stream-added', (e) => {
          client.subscribe(e.stream);
        });
        client.on('stream-subscribed', (e) => {
          setRemoteStream(e.stream);
        });
        client.on('stream-removed', () => {
          setRemoteStream(null);
        });
        const numericRoom = parseInt(String(roomId), 10);
        await client.join({ roomId: numericRoom });

        const stream = TRTC.createStream({
          userId: String(userId),
          audio: true,
          video: true,
        });
        await stream.initialize();
        localStreamRef.current = stream;
        setLocalStream(stream);
        await client.publish(stream);

        if (!cancelled) setJoined(true);
      } catch (err) {
        console.error('TRTC init error:', err);
        if (!cancelled) setError(err.message || 'Failed to join room');
      }
    }

    init();

    return () => {
      cancelled = true;
      hangUp();
    };
  }, [roomId, userId, hangUp]);

  useEffect(() => {
    if (!consultationId) return undefined;

    let cancelled = false;

    async function loadMessages() {
      try {
        const nextMessages = await api.getMessages(consultationId);
        if (!cancelled) setMessages(nextMessages);
      } catch (err) {
        console.error('getMessages failed', err);
      }
    }

    loadMessages();
    const timer = setInterval(loadMessages, 1000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [consultationId]);

  const sendMessage = useCallback(
    async (text, senderRole = role) => {
      if (!consultationId || !text.trim()) return;

      const { message } = await api.postMessage(
        consultationId,
        text.trim(),
        senderRole
      );
      setMessages((prev) => [...prev, message]);
    },
    [consultationId, role]
  );

  return {
    localStream,
    remoteStream,
    messages,
    sendMessage,
    hangUp,
    joined,
    error,
  };
}
