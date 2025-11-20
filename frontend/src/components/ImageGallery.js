// src/components/ImageGallery.js
import React, { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images, onDeleteImage, apiBase }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (imageId) => {
    setDeletingId(imageId);
    try {
      await onDeleteImage(imageId);
    } finally {
      setDeletingId(null);
    }
  };

  if (images.length === 0) {
    return (
      <div className="empty-gallery">
        <div className="empty-icon">🖼️</div>
        <p>No images yet. Upload your first image!</p>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <h2>Your Images ({images.length})</h2>
      <div className="gallery-grid">
        {images.map(image => (
          <div key={image.id} className="gallery-item">
            <div className="image-container">
              <img
                src={`${apiBase}/images/${image.id}`}
                alt={image.filename}
                loading="lazy"
              />
              <button
                className={`delete-btn ${deletingId === image.id ? 'deleting' : ''}`}
                onClick={() => handleDelete(image.id)}
                disabled={deletingId === image.id}
              >
                {deletingId === image.id ? 'Deleting...' : '×'}
              </button>
            </div>
            <div className="image-info">
              <span className="filename">{image.filename}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;