# app.py
import os
import uuid
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# In-memory storage for images
images_store = {}
MAX_FILE_SIZE = 3 * 1024 * 1024  # 3 MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_image(file):
    """Validate image file"""
    if not file or file.filename == '':
        return False, "No file selected"
    
    if not allowed_file(file.filename):
        return False, "Only PNG and JPEG files are allowed"
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_length = file.tell()
    file.seek(0)  # Reset file pointer
    
    if file_length > MAX_FILE_SIZE:
        return False, "File size must be less than 3 MB"
    
    return True, "Valid"

@app.route('/upload', methods=['POST'])
def upload_image():
    """Upload a single image file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        
        # Validate the file
        is_valid, message = validate_image(file)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Read file data
        file_data = file.read()
        mime_type = file.mimetype
        
        # Generate unique ID
        image_id = str(uuid.uuid4())
        
        # Store in memory
        images_store[image_id] = {
            'id': image_id,
            'filename': file.filename,
            'mimeType': mime_type,
            'data': file_data
        }
        
        return jsonify({
            'id': image_id,
            'filename': file.filename,
            'mimeType': mime_type,
            'message': 'Image uploaded successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@app.route('/images', methods=['GET'])
def get_images():
    """Get list of all uploaded images"""
    try:
        images_list = []
        for image_id, image_data in images_store.items():
            images_list.append({
                'id': image_data['id'],
                'filename': image_data['filename'],
                'mimeType': image_data['mimeType']
            })
        
        return jsonify(images_list), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch images: {str(e)}'}), 500

@app.route('/images/<image_id>', methods=['GET'])
def get_image(image_id):
    """Get specific image by ID"""
    try:
        if image_id not in images_store:
            return jsonify({'error': 'Image not found'}), 404
        
        image_data = images_store[image_id]
        return send_file(
            io.BytesIO(image_data['data']),
            mimetype=image_data['mimeType']
        ), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch image: {str(e)}'}), 500

@app.route('/images/<image_id>', methods=['DELETE'])
def delete_image(image_id):
    """Delete specific image by ID"""
    try:
        if image_id not in images_store:
            return jsonify({'error': 'Image not found'}), 404
        
        # Remove image from storage
        del images_store[image_id]
        
        return jsonify({'message': 'Image deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to delete image: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'image_count': len(images_store)}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)