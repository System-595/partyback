const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://your-frontend.netlify.app'], // Add production frontend URL
    methods: ['GET', 'POST'],
  },
});

let rooms = {}; // Store video progress and playlists for rooms

// Default Route
app.get('/', (req, res) => {
  res.send('PartyFlix Backend is Running!');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Join Room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);

    // Send room data to newly joined user
    if (rooms[room]) {
      socket.emit('updatePlaylist', rooms[room].playlist || []);
      socket.emit('updateVideoProgress', rooms[room].currentTime || 0);
    }
  });

  // Video Events
  socket.on('videoPlay', (room) => socket.to(room).emit('videoPlay'));
  socket.on('videoPause', (room) => socket.to(room).emit('videoPause'));
  socket.on('videoSeek', ({ room, time }) => {
    rooms[room] = { ...rooms[room], currentTime: time };
    socket.to(room).emit('videoSeek', time);
  });

  // Playlist Events
  socket.on('addToPlaylist', ({ room, videoUrl }) => {
    if (!rooms[room]) rooms[room] = { playlist: [], currentTime: 0 };
    rooms[room].playlist.push(videoUrl);
    io.to(room).emit('updatePlaylist', rooms[room].playlist);
  });

  // Typing Indicator
  socket.on('typing', ({ room, username }) => {
    socket.to(room).emit('userTyping', username);
  });

  // Chat Messages
  socket.on('sendMessage', ({ room, message }) => {
    io.to(room).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => console.log('User disconnected'));
});

// Use environment variable for production
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
