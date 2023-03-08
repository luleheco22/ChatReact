/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const socket = io(import.meta.env.VITE_URL_BACKEND);

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    socket.on('messageReceived', (message) => {
      setMessages((prevMessages) => {
        if (prevMessages.find((m) => m.id === message.id)) {
          return prevMessages;
        }
        return [...prevMessages, message];
      });
    });
  }, []);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleMessageSend = (event) => {
    event.preventDefault();
    if (message.trim().length > 0) {
      const id = uuidv4();
      const newMessage = { id, text: message, nickname };
      socket.emit('sendMessage', newMessage);
      setMessage('');
    }
  };

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  };

  const handleNicknameSubmit = (event) => {
    event.preventDefault();
    setShowChat(true);
  };

  return (
    <div className="App">
      <h1 className="title">React Chat By Leonel Hernandez</h1>
      {!showChat && (
        <form className="input-form" onSubmit={handleNicknameSubmit}>
          <label htmlFor="name">Enter your nickname: </label>
          <input
            type="text"
            id="name"
            value={nickname}
            onChange={handleNicknameChange}
          />
          <button type="submit">Enter Chat</button>
        </form>
      )}
      {showChat && (
        <div className="chat-container">
          <ul className="message-list">
            {messages.map(({ id, text, nickname: messageNickname }) => (
              <li
                className={`message ${
                  messageNickname === nickname ? 'sent' : 'received'
                }`}
                key={id}
              >
                <span className="message-text">
                  {messageNickname}
                  :
                </span>
                {text}
              </li>
            ))}
          </ul>
          <form className="input-form" onSubmit={handleMessageSend}>
            <input
              type="text"
              className="message-input"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={handleMessageChange}
            />
            <button type="submit" className="send-button">
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
