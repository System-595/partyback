import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';

const socket = io('https://partyflix-backend.onrender.com');

const VideoPlayerFix = ({ room, playlist }) => {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [localVideo, setLocalVideo] = useState(null);

  useEffect(() => {
    socket.emit('joinRoom', room);

    if (playlist.length > 0) setCurrentVideo(playlist[0]);

    // Sync events
    socket.on('videoPlay', () => setPlaying(true));
    socket.on('videoPause', () => setPlaying(false));
    socket.on('videoSeek', (time) => playerRef.current.seekTo(time));
  }, [room, playlist]);

  const handlePlay = () => {
    setPlaying(true);
    socket.emit('videoPlay', room);
  };

  const handlePause = () => {
    setPlaying(false);
    socket.emit('videoPause', room);
  };

  const handleSeek = (time) => socket.emit('videoSeek', { room, time });

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setLocalVideo(fileUrl);
      setCurrentVideo(fileUrl); // Replace current video with the uploaded file
    }
  };

  return (
    <div className="video-player">
      <div className="file-upload">
        <label>
          Upload Video File:
          <input type="file" accept="video/*" onChange={handleFileChange} />
        </label>
      </div>
      <ReactPlayer
        url={localVideo || currentVideo}
        playing={playing}
        controls
        ref={playerRef}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={(e) => handleSeek(e)}
        width="100%"
        height="100%"
      />
      {!localVideo && !currentVideo && (
        <div className="no-video">Please upload a file or paste a URL.</div>
      )}
    </div>
  );
};

export default VideoPlayerFix;
