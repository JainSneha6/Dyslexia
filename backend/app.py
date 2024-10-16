from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import google.generativeai as genai
import PyPDF2

# Configure the Generative AI API
API_KEY = "AIzaSyC6iqFmmBrHeAzOu4VSgO7SYCkNtmwCZM8"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

app = Flask(__name__)
CORS(app,supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Change this to a secure random key
db = SQLAlchemy(app)
jwt = JWTManager(app)  # Initialize JWT Manager

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    test_score = db.Column(db.Integer, default=0)

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify(message='User already exists!'), 409

    new_user = User(email=data['email'], password=generate_password_hash(data['password'], method='pbkdf2:sha256'))
    db.session.add(new_user)
    db.session.commit()
    return jsonify(message='User created successfully!'), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(message='Login successful!', access_token=access_token), 200
    return jsonify(message='Invalid email or password!'), 401

@app.route('/api/save-reading-results', methods=['POST'])
@jwt_required()
def save_reading_results():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify(message='Unauthorized!'), 401

    data = request.get_json()
    reading_speed = data.get('readingSpeed')
    time_taken = data.get('timeTaken')

    print(f"User ID: {current_user_id}, Reading Speed: {reading_speed}, Time Taken: {time_taken}")

    return jsonify(message='Reading results saved successfully!'), 200

@app.route('/api/upload-audio', methods=['POST'])
@jwt_required()
def upload_audio():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify(message='Unauthorized!'), 401

    if 'audio' not in request.files:
        return jsonify(message='No audio file provided!'), 400

    audio_file = request.files['audio']
    audio_path = os.path.join('uploads', f'reading_test_{current_user_id}.wav')
    audio_file.save(audio_path)

    fluency_rating = assess_fluency(audio_path)
    
    print(fluency_rating)

    return jsonify(message='Audio uploaded successfully!', fluency_rating=fluency_rating), 200

def assess_fluency(audio_path):
    prompt = "Rate the fluency of the audio from 100. Just give me the number."
    user_audio_file = genai.upload_file(path=audio_path)
    response = model.generate_content([user_audio_file, prompt])
    
    # Extract the fluency rating from the response text.
    fluency_rating = extract_fluency_rating(response.text)
    return fluency_rating

def extract_fluency_rating(response_text):
    try:
        # Try converting the response text to an integer, which should be the fluency rating.
        fluency_rating = int(response_text.strip())
        return fluency_rating
    except ValueError:
        # If the conversion fails, return 0 or handle the error as needed.
        print("Error extracting fluency rating:", response_text)
        return 0
    
@app.route('/api/writing-assistant', methods=['POST'])
@jwt_required()
def writing_assistant():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify(message='Unauthorized!'), 401

    data = request.get_json()
    user_text = data.get('text')

    if not user_text:
        return jsonify(message='No text provided!'), 400

    prompt = (
        "Improve the coherence for the following text: "
        f"'{user_text}'"
    )

    try:
        response = model.generate_content([prompt])
        improved_text = response.text
        return jsonify(message='Text improved successfully!', improved_text=improved_text), 200
    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify(message='Error generating improved text!'), 500
    
@app.route('/api/writing-assistant-spelling', methods=['POST'])
@jwt_required()
def writing_assistant_spelling():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify(message='Unauthorized!'), 401

    data = request.get_json()
    user_text = data.get('text')

    if not user_text:
        return jsonify(message='No text provided!'), 400

    prompt = (
        '''Tell the user about the spelling mistakes and sentence formation mistakes for the given text.
        Provide in a short and concise way keeping in mind this is for a dyslexic person.
        '''
        f"'{user_text}'"
    )

    try:
        response = model.generate_content([prompt])
        improved_text = response.text.replace('**','').replace("*",'')
        return jsonify(message='Text improved successfully!', improved_text=improved_text), 200
    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify(message='Error generating improved text!'), 500
    
# Function to extract text from a PDF using PyPDF2
def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page_num in range(len(reader.pages)):
            text += reader.pages[page_num].extract_text()
    return text

@app.route('/api/upload-pdf', methods=['POST'])
@jwt_required()
def upload_pdf():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify(message='Unauthorized!'), 401

    # Log the request to debug
    print(request.json)  # Log the incoming JSON request

    # Ensure 'content' is part of the request
    if 'content' not in request.json:
        print("No text content in request!")
        return jsonify(message='No content provided!'), 400

    extracted_text = request.json['content']

    # Check if extracted text is empty
    if not extracted_text.strip():
        print("No text extracted from PDF!")
        return jsonify(message='Failed to extract text from the PDF!'), 400

    # Send extracted text to the Gemini API for simplification
    simplified_text = simplify_text(extracted_text)

    return jsonify(message='PDF uploaded and simplified successfully!', simplified_text=simplified_text), 200


def simplify_text(text):
    prompt = (
        "Simplify the following text to make it more understandable:\n"
        f"'{text}'"
    )
    try:
        response = model.generate_content([prompt])
        simplified_text = response.text
        return simplified_text
    except Exception as e:
        print(f"Error simplifying text: {e}")
        return "Error simplifying text."



if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    with app.app_context():
        db.create_all()
    app.run(debug=True)
