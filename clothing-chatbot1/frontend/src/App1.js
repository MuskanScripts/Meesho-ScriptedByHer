// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [message, setMessage] = useState('');
//   const [chatHistory, setChatHistory] = useState([
//     { sender: 'bot', msg: 'Hello! 👋 Looking for something stylish?' },
//   ]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!message.trim()) return;

//     const newHistory = [...chatHistory, { sender: 'user', msg: message }];
//     setChatHistory(newHistory);

//     try {
//       const res = await axios.post('http://localhost:5000/api/recommend', { message });

//       // If it's a casual reply (from Qwen mock)
//       if (res.data?.text) {
//         setChatHistory([...newHistory, { sender: 'bot', msg: res.data.text }]);
//       } else if (Array.isArray(res.data)) {
//         if (res.data.length === 0) {
//           setChatHistory([...newHistory, { sender: 'bot', msg: "Sorry, I couldn't find anything matching your query." }]);
//         } else {
//           const recommendations = res.data.map((item, idx) => (
//             `<div key="${idx}" style="margin: 10px 0;">
//               <img src="${item.images?.src}" alt="product" style="width: 100px; height: auto; border-radius: 10px;" />
//               <div><strong>${item.productDisplayName || 'Product'}</strong></div>
//             </div>`
//           )).join('');

//           setChatHistory([...newHistory, {
//             sender: 'bot',
//             msg: `<div>Here are some recommendations:</div>${recommendations}`
//           }]);
//         }
//       }
//     } catch (err) {
//       console.error("❌ Axios error:", err);
//       setChatHistory([...newHistory, { sender: 'bot', msg: 'Error contacting server.' }]);
//     }

//     setMessage('');
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">🛍️ Meesho Recommender Bot</div>
//       <div className="chat-box">
//         {chatHistory.map((item, index) => (
//           <div
//             key={index}
//             className={`message ${item.sender === 'user' ? 'from-user' : 'from-bot'}`}
//             dangerouslySetInnerHTML={{ __html: item.msg }}
//           />
//         ))}
//       </div>
//       <form onSubmit={handleSend} className="input-area">
//         <input
//           id="chat-input"
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message..."
//           autoComplete="off"
//         />
//         <button id="send-btn" type="submit">➤</button>
//       </form>
//     </div>
//   );
// }

// export default App;
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', msg: 'Hello! 👋 Looking for something stylish?' },
  ]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user', msg: message }];
    setChatHistory(newHistory);

    try {
      const res = await axios.post('http://localhost:5000/api/recommend', { message });

      let botMessages = [];

      if (Array.isArray(res.data) && res.data.length > 0) {
        botMessages = res.data.map((item, idx) => {
          const imageUrl = Array.isArray(item.images)
            ? item.images[0]
            : typeof item.images === 'string'
              ? item.images
              : '';

          return {
            sender: 'bot',
            msg: (
              <div key={idx} style={{ margin: '10px 0' }}>
                {imageUrl && (
                  <img
                    src={imageUrl}
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
          };
        });
      } else {
        botMessages = [{ sender: 'bot', msg: "Sorry, I couldn't find anything matching your query." }];
      }

      setChatHistory([...newHistory, ...botMessages]);
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
