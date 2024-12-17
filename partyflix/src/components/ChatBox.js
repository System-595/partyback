import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://partyflix-backend.onrender.com');

const ChatBox = ({ room, username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');

  useEffect(() => {
    socket.on('receiveMessage', (msg) => setMessages((prev) => [...prev, msg]));
    socket.on('userTyping', (user) => setTyping(`${user} is typing...`));

    return () => socket.disconnect();
  }, [room]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = { user: username, text: message };
      socket.emit('sendMessage', { room, message: msgData });
      setMessages((prev) => [...prev, msgData]);
      setMessage('');
    }
  };

  const handleTyping = () => socket.emit('typing', { room, username });

  return (
    <div>
      <div>{typing}</div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.user}:</b> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleTyping}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
