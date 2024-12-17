import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayerFix from './VideoPlayerFix';
import ChatBox from './ChatBox';
import io from 'socket.io-client';
import '../styles/Room.css';

const socket = io('http://localhost:3001');

const Room = () => {
  const { roomId } = useParams();
  const [username, setUsername] = useState('');
  const [entered, setEntered] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [playlist, setPlaylist] = useState([]);

  const addToPlaylist = () => {
    if (videoUrl.trim()) {
      socket.emit('addToPlaylist', { room: roomId, videoUrl });
      setVideoUrl('');
    }
  };

  useEffect(() => {
    socket.emit('joinRoom', roomId);
    socket.on('updatePlaylist', (newPlaylist) => setPlaylist(newPlaylist));
  }, [roomId]);

  if (!entered) {
    return (
      <div className="enter-room">
        <h2>Welcome to Room: {roomId}</h2>
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={() => setEntered(true)}>Join</button>
      </div>
    );
  }

  return (
    <div className="room-container">
      <div className="top-controls">
        <input
          type="text"
          placeholder="Enter video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button onClick={addToPlaylist}>Add to Playlist</button>
      </div>
      <div className="room-content">
        <div className="video-section">
          <VideoPlayerFix room={roomId} playlist={playlist} />
        </div>
        <div className="chat-section">
          <ChatBox room={roomId} username={username} />
        </div>
      </div>
      <div className="playlist">
        <h3>Playlist</h3>
        <ul>
          {playlist.map((url, i) => (
            <li key={i}>{url}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Room;
