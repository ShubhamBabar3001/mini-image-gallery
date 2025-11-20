# Mini Image Gallery

A full-stack web application for uploading, viewing, and deleting images. Built with **Flask backend** and **React frontend**.

## Features

- Upload single images (JPEG/PNG, max 3MB)
- View all uploaded images in a responsive gallery
- Delete images with one click
- Progress indicator during upload
- Responsive design for mobile and desktop
- In-memory image storage (no database required)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

```bash
    cd backend
```
2. Install dependencies:

```bash
    pip install -r requirements.txt
```

3. Run the Flask server:
```bash
    python app.py
```
### The backend will run on: http://localhost:5000


## Frontend Setup
1. Navigate to the frontend directory:
```bash
    cd frontend
```

2. Install dependencies:
```bash
    npm install
```

3. Start the React app:
```bash
    npm start
```

The frontend will run on: http://localhost:3000 and communicate with the backend.

How to Use the App

Open the frontend in your browser (http://localhost:3000)

Click Upload and select an image (JPEG/PNG, ≤ 3MB)

Watch the progress bar while uploading

The uploaded image will appear in the gallery immediately

Click the Delete button on any image to remove it

Design Choices

Backend in Flask: Simple, lightweight, ideal for in-memory storage

Frontend in React: Component-based UI for easy image upload and gallery display

In-memory storage: Avoids database setup, perfect for a mini-project

CSS simplicity: Focus on clarity and responsiveness, keeping the UI clean and functional

Notes

Uploaded images are stored in memory only; restarting the backend will clear all images

Supported image types: JPEG and PNG

Maximum file size: 3 MB
