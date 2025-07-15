import React from 'react';

function ImageCard({ product }) {
  return (
    <div style={{ border: '1px solid gray', padding: 10, margin: 10 }}>
      <img src={product.image_url} alt={product.title} style={{ width: 200 }} />
      <h3>{product.title}</h3>
      <p>₹{product.price}</p>
    </div>
  );
}

export default ImageCard;