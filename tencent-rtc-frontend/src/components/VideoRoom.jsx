import { useCallback, useEffect, useRef, useState } from 'react';

// localStream, remoteStream: TRTC Stream 
export default function VideoRoom({ localStream, remoteStream }) {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const [localPlaybackError, setLocalPlaybackError] = useState('');
  const [remotePlaybackError, setRemotePlaybackError] = useState('');

  const playStream = useCallback(async (stream, element, setPlaybackError) => {
    if (!stream || !element) return;

    try {
      await stream.play(element);
      setPlaybackError('');
    } catch (err) {
      console.warn('TRTC playback blocked:', err);
      setPlaybackError(
        err?.name === 'NotAllowedError' || String(err?.message || '').includes('NotAllowedError')
          ? 'Browser blocked audio playback. Click to enable it.'
          : err?.message || 'Could not start video playback.'
      );
    }
  }, []);

  useEffect(() => {
    playStream(localStream, localRef.current, setLocalPlaybackError);
  }, [localStream, playStream]);

  useEffect(() => {
    playStream(remoteStream, remoteRef.current, setRemotePlaybackError);
  }, [remoteStream, playStream]);

  return (
    <div style={styles.wrap}>
      <div style={styles.videoPanel}>
        <p style={styles.label}>me</p>
        <div ref={localRef} style={styles.video} />
        {localPlaybackError && (
          <button
            type="button"
            style={styles.playButton}
            onClick={() => playStream(localStream, localRef.current, setLocalPlaybackError)}
          >
            Enable my video
          </button>
        )}
      </div>
      <div style={styles.videoPanel}>
        <p style={styles.label}>them</p>
        <div ref={remoteRef} style={styles.video} />
        {remotePlaybackError && (
          <button
            type="button"
            style={styles.playButton}
            onClick={() => playStream(remoteStream, remoteRef.current, setRemotePlaybackError)}
          >
            Enable their audio/video
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  videoPanel: {
    position: 'relative',
  },
  label: {
    margin: '0 0 6px',
  },
  video: {
    width: 320,
    height: 240,
    background: '#000',
  },
  playButton: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    padding: '8px 10px',
    border: 'none',
    borderRadius: 8,
    background: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
  },
};
