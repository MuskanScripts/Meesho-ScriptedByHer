import { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatWidget.css';
import chatIcon from './chat-icon.png';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', msg: "👗 Hey there! I’m Daily Dresser. What are you looking for today?" }
  ]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [genderPref, setGenderPref] = useState('');
  const [seasonPref, setSeasonPref] = useState('');

  useEffect(() => {
    // Auto scroll to bottom
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [chatHistory]);

  const toggleSelection = (item) => {
    const exists = selectedItems.find(i => i._id === item._id);
    if (exists) {
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
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/recommend', { message });

      if (res.data?.text) {
        setChatHistory(prev => [...prev, { sender: 'bot', msg: res.data.text }]);
      } else if (Array.isArray(res.data)) {
        const flashcards = res.data.slice(0, 4).map(item => ({
          sender: 'bot',
          msg: (
            <div
              key={item._id}
              className={`flashcard ${selectedItems.some(i => i._id === item._id) ? 'selected' : ''}`}
              onClick={() => toggleSelection(item)}
            >
              {selectedItems.some(i => i._id === item._id) && <span className="tick">✔</span>}
              <img
                src={Array.isArray(item.images) ? item.images[0] : item.images}
                alt="product"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(Array.isArray(item.images) ? item.images[0] : item.images, '_blank');
                }}
              />
              <p>{item.productDisplayName}</p>
            </div>
          )
        }));

        setChatHistory(prev => [...newHistory, ...flashcards]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: 'bot', msg: '❌ Server error. Please try again later.' }]);
      console.error(err);
    }
  };

  const handleShare = () => {
    const shareText = selectedItems.map(item => item.productDisplayName).join(', ');
    if (navigator.share) {
      navigator.share({ text: `Check these out: ${shareText}` });
    } else {
      alert("Your browser doesn’t support native share. Selected items:\n" + shareText);
    }
  };

  const handleVirtualTryOn = () => {
    alert(`👗 Virtual try-on for: ${selectedItems[0].productDisplayName}`);
  };

  const sendPref = (type, value) => {
    if (type === 'gender') setGenderPref(value);
    if (type === 'season') setSeasonPref(value);
    setChatHistory(prev => [...prev, { sender: 'user', msg: value }]);
  };

  return (
    <>
      {!isOpen && (
        <img src={chatIcon} alt="chat" className="chat-icon" onClick={() => setIsOpen(true)} />
      )}

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span>👚 Daily Dresser</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chat-box">
            {/* Predefined Questions */}
            {chatHistory.length === 1 && (
              <div className="quick-questions">
                <div className="chip" onClick={() => sendPref('gender', 'Female')}>👩 Female</div>
                <div className="chip" onClick={() => sendPref('gender', 'Male')}>👨 Male</div>
                <div className="chip" onClick={() => sendPref('season', 'Summer')}>☀️ Summer</div>
                <div className="chip" onClick={() => sendPref('season', 'Winter')}>❄️ Winter</div>
              </div>
            )}

            {chatHistory.map((item, i) => (
              <div key={i} className={`chat-bubble ${item.sender === 'user' ? 'user' : 'bot'}`}>
                {item.msg}
              </div>
            ))}
          </div>

          {/* Actions */}
          {selectedItems.length > 0 && (
            <div className="action-bar">
              {selectedItems.length === 1 ? (
                <button onClick={handleVirtualTryOn}>🧪 Virtual Try-On</button>
              ) : (
                <button onClick={handleShare}>📤 Share</button>
              )}
            </div>
          )}
          {/* Input Area */}
          <form onSubmit={handleSend} className="input-area">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">➤</button>
          </form>

          {/* Bottom Navigation */}
          <div className="bottom-nav">
            <div className="nav-item active">
              <span>Home</span>
            </div>
            <div className="nav-item">
              <span>Conversation</span>
            </div>
            <div className="nav-item">
              <span>FAQ?</span>
            </div>
            <div className="nav-item">
              <span>Articles</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default ChatWidget;
