import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Room from './components/Room';
import './styles/App.css';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  </BrowserRouter>
);

const Home = () => {
  const [roomName, setRoomName] = useState('');
  const [roomList, setRoomList] = useState([]);
  const navigate = useNavigate();

  const createRoom = () => {
    if (roomName.trim()) {
      const roomId = encodeURIComponent(roomName.trim().replace(/ /g, '-'));
      setRoomList((prev) => [...prev, roomId]);
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="home">
      <h1>🎉 PartyFlix 🎉</h1>
      <p>Create a Room or Join an Existing One!</p>
      <input
        type="text"
        placeholder="Enter Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={createRoom}>Create Room</button>
      <h2>Available Rooms</h2>
      <ul>
        {roomList.map((room, index) => (
          <li key={index}>
            <button onClick={() => navigate(`/room/${room}`)}>{room}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
