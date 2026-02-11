from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
import base64
import io
from PIL import Image, ImageOps
import imagehash

app = Flask(__name__)
# Use a secret key for session management
app.config['SECRET_KEY'] = 'dev-secret-key-change-in-prod'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app) # Enable CORS for frontend communication

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # Relationship to puzzle
    puzzle = db.relationship('AuthPuzzle', backref='user', uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email
        }

class AuthPuzzle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # Store the perceptual hash of the image as a hex string
    image_hash = db.Column(db.String(255), nullable=False) 

# Create database tables
with app.app_context():
    db.create_all()

def process_image(base64_string):
    """Converts base64 string to PIL Image, crops to content, and computes hash."""
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    
    image_data = base64.b64decode(base64_string)
    image = Image.open(io.BytesIO(image_data)).convert('L') # Convert to grayscale immediately

    # 1. Bounding Box Cropping (Remove whitespace)
    # Invert image (drawing is black on white) so content is white on black for getbbox
    inverted_image = ImageOps.invert(image)
    bbox = inverted_image.getbbox()

    if bbox:
        image = image.crop(bbox)
    
    # 2. Resize and Hash
    # dhash is sensitive to details (gradients).
    # Now that we normalized position/scale via cropping, dhash should work better.
    image = image.resize((64, 64))
    return imagehash.dhash(image)

# API Routes

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    image_data = data.get('image_data') # Base64 string from canvas

    if not all([name, email, image_data]):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    try:
        # Compute hash
        p_hash = process_image(image_data)
        
        new_user = User(name=name, email=email)
        new_puzzle = AuthPuzzle(image_hash=str(p_hash), user=new_user)
        
        db.session.add(new_user)
        db.session.add(new_puzzle)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully', 'user': new_user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/login-challenge', methods=['POST'])
def login_challenge():
    """Step 1: User provides email, we check if they exist."""
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'message': 'User found',
        'email': user.email
    }), 200

@app.route('/api/verify', methods=['POST'])
def verify_answer():
    """Step 2: User draws the image, we check similarity."""
    data = request.json
    email = data.get('email')
    image_data = data.get('image_data')

    if not all([email, image_data]):
        return jsonify({'error': 'Missing email or drawing'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        # Compute hash of the login attempt
        login_hash = process_image(image_data)
        stored_hash = imagehash.hex_to_hash(user.puzzle.image_hash)
        
        # Calculate Hamming distance
        distance = login_hash - stored_hash
        
        # Calculate percentage match (64 bits total)
        match_percentage = (1 - (distance / 64.0)) * 100
        
        print(f"Login Attempt for {email}: Distance {distance}, Match {match_percentage:.2f}%") # Debug log

        # Threshold: 
        # User requested 45% matching.
        # 45% match = distance 35 (out of 64).
        if distance <= 35:
            return jsonify({
                'message': 'Authentication successful',
                'token': 'dummy-jwt-token-for-demo',
                'user': user.to_dict(),
                'distance': int(distance),
                'match_percentage': match_percentage
            }), 200
        else:
            return jsonify({'error': f'Authentication failed. Match: {match_percentage:.1f}% (Required: >45%)' }), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
