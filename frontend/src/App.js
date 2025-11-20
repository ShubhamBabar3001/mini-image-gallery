// src/App.js
import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import ImageGallery from './components/ImageGallery';
import './App.css';

const API_BASE = 'http://localhost:5000';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/images`);
      if (response.ok) {
        const imagesData = await response.json();
        setImages(imagesData);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        // Refresh the gallery
        fetchImages();
        return { success: true, message: result.message };
      } else {
        const error = await response.json();
        return { success: false, message: error.error };
      }
    } catch (error) {
      return { success: false, message: 'Upload failed: ' + error.message };
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await fetch(`${API_BASE}/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove image from state
        setImages(images.filter(img => img.id !== imageId));
        return { success: true, message: 'Image deleted successfully' };
      } else {
        const error = await response.json();
        return { success: false, message: error.error };
      }
    } catch (error) {
      return { success: false, message: 'Delete failed: ' + error.message };
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mini Image Gallery</h1>
        <p>Upload, view, and manage your images</p>
      </header>

      <main className="app-main">
        <ImageUpload onUpload={handleImageUpload} />
        
        {loading ? (
          <div className="loading">Loading images...</div>
        ) : (
          <ImageGallery 
            images={images} 
            onDeleteImage={handleDeleteImage}
            apiBase={API_BASE}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Total images: {images.length}</p>
      </footer>
    </div>
  );
}

export default App;