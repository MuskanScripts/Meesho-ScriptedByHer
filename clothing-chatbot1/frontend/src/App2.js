import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', msg: 'Hello! 👋 Looking for something stylish?' },
  ]);
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelection = (item) => {
    const alreadySelected = selectedItems.find(i => i._id === item._id);
    if (alreadySelected) {
      setSelectedItems(selectedItems.filter(i => i._id !== item._id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user', msg: message }];
    setChatHistory(newHistory);

    try {
      const res = await axios.post('http://localhost:5000/api/recommend', { message });

      if (res.data?.text) {
        setChatHistory([...newHistory, { sender: 'bot', msg: res.data.text }]);
      } else if (Array.isArray(res.data)) {
        const topTwo = res.data.slice(0, 2);

        const recommendations = topTwo.map((item) => ({
          sender: 'bot',
          msg: (
            <div
              key={item._id}
              className={`recommendation ${selectedItems.some(i => i._id === item._id) ? 'selected' : ''}`}
              onClick={() => toggleSelection(item)}
              style={{
                margin: '10px 0',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                position: 'relative',
                cursor: 'pointer',
                backgroundColor: selectedItems.some(i => i._id === item._id) ? '#f0f9ff' : '#fff',
              }}
            >
              {selectedItems.some(i => i._id === item._id) && (
                <span style={{
                  position: 'absolute',
                  top: '5px',
                  right: '10px',
                  color: '#2563eb',
                  fontWeight: 'bold',
                }}>✔</span>
              )}
              {item.images && (
                <img
                  src={Array.isArray(item.images) ? item.images[0] : item.images}
                  alt="product"
                  style={{
                    width: '25vw',
                    maxWidth: '100px',
                    height: 'auto',
                    borderRadius: '10px',
                    marginBottom: '6px',
                  }}
                />
              )}
              <div><strong>{item.productDisplayName || 'Product'}</strong></div>
            </div>
          )
        }));

        setChatHistory([...newHistory, ...recommendations]);
      }
    } catch (err) {
      console.error("❌ Axios error:", err);
      setChatHistory([...newHistory, { sender: 'bot', msg: 'Error contacting server.' }]);
    }

    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">🛍️ Meesho Recommender Bot</div>
      <div className="chat-box">
        {chatHistory.map((item, index) => (
          <div
            key={index}
            className={`message ${item.sender === 'user' ? 'from-user' : 'from-bot'}`}
          >
            {item.msg}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="input-area">
        <input
          id="chat-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          autoComplete="off"
        />
        <button id="send-btn" type="submit">➤</button>
      </form>
    </div>
  );
}

export default App;
