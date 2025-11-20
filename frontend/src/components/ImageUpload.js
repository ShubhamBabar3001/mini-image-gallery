// src/components/ImageUpload.js
import React, { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    // Reset states
    setUploading(true);
    setUploadProgress(0);
    setMessage('');

    // Simulate progress (since we can't get actual upload progress with fetch)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const result = await onUpload(file);
      
      // Complete progress
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);

      setMessage({
        text: result.message,
        type: result.success ? 'success' : 'error'
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setMessage({
        text: 'Upload failed: ' + error.message,
        type: 'error'
      });
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="image-upload">
      <div 
        className={`upload-area ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileSelect}
          disabled={uploading}
          className="file-input"
        />
        
        <div className="upload-content">
          {uploading ? (
            <>
              <div className="upload-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p>Uploading... {uploadProgress}%</p>
            </>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <p>Click to upload or drag and drop</p>
              <p className="upload-hint">PNG or JPG (max 3MB)</p>
            </>
          )}
        </div>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;