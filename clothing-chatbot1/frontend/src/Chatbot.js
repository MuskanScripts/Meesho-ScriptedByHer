import React, { useState } from 'react';
import axios from 'axios';
import ImageCard from './ImageCard';

function Chatbot() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);

  const handleSend = async () => {
    const res = await axios.post('/api/recommend', { message });
    setResponses(res.data);
  };

  return (
    <div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask for clothes..." />
      <button onClick={handleSend}>Send</button>
      <div>
        {responses.map((item, idx) => (
          <ImageCard key={idx} product={item} />
        ))}
      </div>
    </div>
  );
}

export default Chatbot;