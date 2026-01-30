import os
from datetime import datetime
from flask import Flask, render_template, redirect, url_for, flash, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_wtf import FlaskForm
from flask_wtf.csrf import CSRFProtect
from wtforms import StringField, PasswordField, SelectField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging (replaces print statements)
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

# ============== API KEY ROTATION ==============

def get_gemini_api_keys():
    """
    Load multiple Gemini API keys from environment.
    Supports GEMINI_API_KEY (single) or GEMINI_API_KEYS (comma-separated).
    """
    # Try comma-separated keys first
    keys_str = os.getenv('GEMINI_API_KEYS', '')
    if keys_str:
        keys = [k.strip() for k in keys_str.split(',') if k.strip() and k.strip() != 'your-key-here']
        if keys:
            return keys
    
    # Fall back to single key
    single_key = os.getenv('GEMINI_API_KEY', '')
    if single_key and single_key != 'your-gemini-api-key-here':
        return [single_key]
    
    return []

# Global state for API key rotation
_api_keys = get_gemini_api_keys()
_current_key_index = 0
_exhausted_keys = set()  # Track keys that hit quota today

def get_next_api_key():
    """
    Get the next available Gemini API key.
    Returns (key, key_index) or (None, -1) if all keys exhausted.
    """
    global _current_key_index
    
    if not _api_keys:
        return None, -1
    
    # Try each key starting from current index
    attempts = 0
    while attempts < len(_api_keys):
        if _current_key_index not in _exhausted_keys:
            key = _api_keys[_current_key_index]
            return key, _current_key_index
        
        _current_key_index = (_current_key_index + 1) % len(_api_keys)
        attempts += 1
    
    return None, -1

def mark_key_exhausted(key_index):
    """Mark a key as exhausted (quota exceeded)."""
    global _exhausted_keys
    _exhausted_keys.add(key_index)
    logger.warning(f"API key #{key_index + 1} exhausted. {len(_api_keys) - len(_exhausted_keys)} keys remaining.")

def rotate_to_next_key():
    """Rotate to the next available API key."""
    global _current_key_index
    _current_key_index = (_current_key_index + 1) % len(_api_keys)

def get_api_key_status():
    """Get status of API keys for monitoring."""
    return {
        'total_keys': len(_api_keys),
        'exhausted_count': len(_exhausted_keys),
        'available_count': len(_api_keys) - len(_exhausted_keys),
        'current_index': _current_key_index
    }

# Initialize Flask app
app = Flask(__name__)
# Strict Secret Key check for production
if os.environ.get('FLASK_ENV') == 'production' and not os.environ.get('SECRET_KEY'):
    logger.warning("WARNING: FLASK_ENV is production but SECRET_KEY is not set!")

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
# Hybrid Database Config: PostgreSQL (Prod) or SQLite (Dev)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///medisum.db')
# Fix for some Postgres providers (Heroku/Render) that use 'postgres://' instead of 'postgresql://'
if app.config['SQLALCHEMY_DATABASE_URI'].startswith("postgres://"):
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize extensions
db = SQLAlchemy(app)
csrf = CSRFProtect(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ============== DATABASE MODELS ==============

class User(UserMixin, db.Model):
    """User model for authentication."""
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'patient' or 'doctor'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to prescriptions
    prescriptions = db.relationship('Prescription', backref='user', lazy=True)
    
    def get_id(self):
        return str(self.user_id)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Prescription(db.Model):
    """Prescription model for storing uploaded prescriptions."""
    __tablename__ = 'prescriptions'
    
    prescription_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    image_path = db.Column(db.String(256), nullable=False)
    ocr_text = db.Column(db.Text)
    doctor_summary = db.Column(db.Text)  # AI-generated doctor summary
    patient_summary = db.Column(db.Text)  # AI-generated patient summary
    prescription_date = db.Column(db.Date)  # Date written on the prescription
    visit_reason = db.Column(db.String(255))  # Short title/reason for visit
    key_insights = db.Column(db.String(500))  # One-sentence key insight or takeaway
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    medicines = db.relationship('Medicine', backref='prescription', lazy=True, cascade='all, delete-orphan')
    medical_tests = db.relationship('MedicalTest', backref='prescription', lazy=True, cascade='all, delete-orphan')


class Medicine(db.Model):
    """Medicine model for storing extracted medicine information."""
    __tablename__ = 'medicines'
    
    medicine_id = db.Column(db.Integer, primary_key=True)
    prescription_id = db.Column(db.Integer, db.ForeignKey('prescriptions.prescription_id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    dosage = db.Column(db.String(100))  # e.g., "500mg", "10ml"
    frequency = db.Column(db.String(100))  # e.g., "twice daily", "morning/evening"
    duration = db.Column(db.String(100))  # e.g., "7 days", "2 weeks"
    timing = db.Column(db.String(100))  # e.g., "after meals", "before bed"
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    instructions = db.Column(db.Text)  # Any special instructions


class MedicalTest(db.Model):
    """Medical test model for storing extracted test information."""
    __tablename__ = 'medical_tests'
    
    test_id = db.Column(db.Integer, primary_key=True)
    prescription_id = db.Column(db.Integer, db.ForeignKey('prescriptions.prescription_id'), nullable=False)
    test_name = db.Column(db.String(200), nullable=False)  # e.g., "Blood Test", "X-Ray", "MRI"
    test_date = db.Column(db.Date)
    status = db.Column(db.String(50), default='pending')  # pending, completed, cancelled
    instructions = db.Column(db.Text)  # Fasting required, etc.


class HealthReading(db.Model):
    """Health reading model for tracking BP and sugar levels."""
    __tablename__ = 'health_readings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    date = db.Column(db.Date, nullable=False)  # One entry per day
    bp_systolic = db.Column(db.Integer)   # e.g., 120 mmHg
    bp_diastolic = db.Column(db.Integer)  # e.g., 80 mmHg
    sugar_level = db.Column(db.Integer)   # mg/dL (fasting or random)
    sugar_type = db.Column(db.String(20), default='fasting')  # fasting, random, post_meal
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref=db.backref('health_readings', lazy=True))

# ============== FLASK-LOGIN ==============

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# ============== FORMS ==============

class LoginForm(FlaskForm):
    """Login form with CSRF protection."""
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')


class RegisterForm(FlaskForm):
    """Registration form with CSRF protection."""
    name = StringField('Full Name', validators=[DataRequired(), Length(min=2, max=100)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(), EqualTo('password', message='Passwords must match')
    ])
    submit = SubmitField('Register')


# ============== ROUTES ==============

@app.route('/')
def index():
    """Homepage - Antigravity landing page."""
    # If user is already logged in, they can still view the landing page,
    # but the nav bar will show "Go to Dashboard" instead of "Login".
    # This is a common pattern for SAAS.
    return render_template('landing.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login page."""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        
        if user is None:
            flash('No account found with that email.', 'error')
            return render_template('login.html', form=form)
        
        if not user.check_password(form.password.data):
            flash('Incorrect password.', 'error')
            return render_template('login.html', form=form)
        
        login_user(user)
        flash(f'Welcome back, {user.name}!', 'success')
        
        # Redirect to next page if specified
        next_page = request.args.get('next')
        return redirect(next_page or url_for('dashboard'))
    
    return render_template('login.html', form=form)


@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration page."""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = RegisterForm()
    if form.validate_on_submit():
        # Check if email already exists
        existing_user = User.query.filter_by(email=form.email.data).first()
        if existing_user:
            flash('Email already registered. Please login instead.', 'error')
            return render_template('register.html', form=form)
        
        # Create new user
        user = User(
            name=form.name.data,
            email=form.email.data,
            role='user'
        )
        user.set_password(form.password.data)
        
        try:
            db.session.add(user)
            db.session.commit()
            flash('Account created successfully! Please login.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            flash('An error occurred. Please try again.', 'error')
    
    return render_template('register.html', form=form)


@app.route('/logout')
@login_required
def logout():
    """User logout."""
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))


@app.route('/dashboard')
@login_required
def dashboard():
    """User dashboard showing prescription stats."""
    prescription_count = Prescription.query.filter_by(user_id=current_user.user_id).count()
    recent_prescriptions = Prescription.query.filter_by(user_id=current_user.user_id)\
        .order_by(Prescription.upload_date.desc()).limit(5).all()
    
    # Get medicine and test counts for user's prescriptions
    user_prescriptions = Prescription.query.filter_by(user_id=current_user.user_id).all()
    medicine_count = sum(len(p.medicines) for p in user_prescriptions)
    test_count = sum(len(p.medical_tests) for p in user_prescriptions)
    
    # Get active medicines (all medicines from all prescriptions)
    active_medicines = []
    for p in user_prescriptions:
        active_medicines.extend(p.medicines)
    
    # Get pending tests list
    pending_tests_list = []
    for p in user_prescriptions:
        for t in p.medical_tests:
            if t.status == 'pending':
                pending_tests_list.append(t)
    
    pending_tests = len(pending_tests_list)
    
    return render_template('dashboard.html', 
                         prescription_count=prescription_count,
                         recent_prescriptions=recent_prescriptions,
                         medicine_count=medicine_count,
                         test_count=test_count,
                         pending_tests=pending_tests,
                         active_medicines=active_medicines,
                         pending_tests_list=pending_tests_list)


# ============== FILE UPLOAD ==============

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def perform_ocr_trocr(image_path):
    """
    Perform OCR using TrOCR (Microsoft's handwriting recognition model).
    Best for handwritten text like prescriptions.
    """
    from transformers import TrOCRProcessor, VisionEncoderDecoderModel
    from PIL import Image
    import torch
    
    try:
        logger.info("Loading TrOCR handwriting model (first load may take a minute)...")
        
        # Use the handwritten-specific model
        processor = TrOCRProcessor.from_pretrained('microsoft/trocr-base-handwritten')
        model = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-base-handwritten')
        
        full_path = os.path.join(app.config['UPLOAD_FOLDER'], image_path)
        image = Image.open(full_path).convert("RGB")
        
        # Get image dimensions
        width, height = image.size
        
        # Split image into horizontal strips for line-by-line processing
        # TrOCR works best on single lines of text
        num_strips = max(8, height // 50)  # More strips for taller images
        strip_height = height // num_strips
        
        all_text = []
        
        for i in range(num_strips):
            top = i * strip_height
            bottom = min((i + 1) * strip_height + 10, height)  # Slight overlap
            
            strip = image.crop((0, top, width, bottom))
            
            # Process strip
            pixel_values = processor(strip, return_tensors="pt").pixel_values
            
            with torch.no_grad():
                generated_ids = model.generate(pixel_values, max_length=128)
            
            text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            
            if text and text.strip() and len(text.strip()) > 1:
                all_text.append(text.strip())
        
        if all_text:
            result = "\n".join(all_text)
            return f"[Local OCR - TrOCR Handwriting]\n\n{result}", None
        else:
            return None, "TrOCR could not extract text from this image."
            
    except Exception as e:
        logger.error(f"TrOCR failed: {str(e)}")
        return None, f"TrOCR failed: {str(e)}"


def perform_ocr_tesseract(image_path):
    """
    Perform OCR using local Tesseract (fallback for printed text).
    """
    import pytesseract
    from PIL import Image
    
    try:
        full_path = os.path.join(app.config['UPLOAD_FOLDER'], image_path)
        img = Image.open(full_path)
        
        # Perform OCR with Tesseract
        text = pytesseract.image_to_string(img)
        
        if text and text.strip():
            return f"[Local OCR - Tesseract]\n\n{text.strip()}", None
        else:
            return None, "Tesseract could not extract text from this image."
            
    except Exception as e:
        return None, f"Tesseract OCR failed: {str(e)}"


def perform_ocr(image_path, max_retries=3, retry_delay=30):
    """
    Perform OCR on an image using Gemini API with API key rotation.
    Stage 1: Basic text extraction only.
    Cycles through multiple API keys when quota exceeded.
    Falls back to local TrOCR if all API keys exhausted.
    """
    import google.generativeai as genai
    from PIL import Image
    import time
    
    use_fallback = False
    
    # Get API key using rotation system
    gemini_api_key, key_index = get_next_api_key()
    
    if not gemini_api_key:
        logger.info("No Gemini API keys available, using TrOCR fallback...")
        use_fallback = True
    
    logger.info(f"Starting OCR for {image_path}...")
    
    if not use_fallback:
        genai.configure(api_key=gemini_api_key)
        
        # Check file extension
        ext = image_path.rsplit('.', 1)[-1].lower()
        
        if ext == 'pdf':
            return None, "PDF OCR support coming soon. Please upload an image (JPG/PNG) for now."
        
        # Load the image
        full_path = os.path.join(app.config['UPLOAD_FOLDER'], image_path)
        img = Image.open(full_path)
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Simple OCR prompt (Stage 1 - text extraction only)
        prompt = """Extract all text from this prescription image. 
        Include:
        - Patient name (if visible)
        - Doctor name (if visible)
        - All medicine names with dosage
        - Frequency instructions (e.g., twice daily, morning/evening)
        - Duration (e.g., 7 days, 2 weeks)
        - Any medical tests mentioned
        - Any special instructions or warnings
        
        Format the extracted text clearly and organize it into sections."""
        
        # Try API keys with rotation on quota errors
        while True:
            try:
                response = model.generate_content([prompt, img])
                
                if response and response.text:
                    logger.info(f"Gemini API success (using key #{key_index + 1})")
                    return response.text, None
                else:
                    logger.warning("Gemini API returned empty response")
                    return None, "OCR failed to extract text. Please try again."
                    
            except Exception as e:
                error_msg = str(e)
                logger.error(f"OCR error with key #{key_index + 1}: {error_msg}")
                
                # Check if it's a quota/rate limit error
                is_quota_error = ("quota" in error_msg.lower() or 
                                "resource" in error_msg.lower() or 
                                "429" in error_msg)
                
                if is_quota_error:
                    # Mark current key as exhausted and try next
                    mark_key_exhausted(key_index)
                    gemini_api_key, key_index = get_next_api_key()
                    
                    if gemini_api_key:
                        logger.info(f"Switching to API key #{key_index + 1}...")
                        genai.configure(api_key=gemini_api_key)
                        continue  # Retry with new key
                    else:
                        logger.warning("All API keys exhausted, falling back to TrOCR...")
                        use_fallback = True
                        break
                elif "API key" in error_msg.lower() or "invalid" in error_msg.lower():
                    return None, "Invalid Gemini API key. Please check your .env file."
                else:
                    return None, f"OCR processing failed: {error_msg}"
    
    # Use TrOCR fallback (best for handwritten prescriptions)
    if use_fallback:
        return perform_ocr_trocr(image_path)


@app.route('/delete_prescription/<int:prescription_id>', methods=['POST'])
@login_required
def delete_prescription(prescription_id):
    """Delete a prescription and its associated file."""
    prescription = Prescription.query.get_or_404(prescription_id)
    
    # Security check: Ensure user owns this prescription
    if prescription.user_id != current_user.user_id:
        flash('You do not have permission to delete this prescription.', 'error')
        return redirect(url_for('dashboard'))
    
    try:
        # 1. Delete the file from filesystem
        if prescription.image_path:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], prescription.image_path)
            if os.path.exists(file_path):
                os.remove(file_path)
        
        # 2. Delete from database (Cascades to medicines/tests automatically)
        db.session.delete(prescription)
        db.session.commit()
        
        flash('Prescription deleted successfully.', 'success')
        
    except Exception as e:
        db.session.rollback()
        flash(f'Error deleting prescription: {str(e)}', 'error')
        
    # Redirect based on where the user likely came from
    return redirect(url_for('history'))


def extract_structured_data(ocr_text):
    """
    Extract structured medicine and test data from OCR text using Gemini API.
    Stage 2: Structured extraction.
    Returns: (medicines_list, tests_list, doctor_summary, patient_summary, error)
    """
    import google.generativeai as genai
    import json
    import re
    from datetime import datetime, timedelta
    
    # Get API key using rotation system
    gemini_api_key, key_index = get_next_api_key()
    if not gemini_api_key:
        return [], [], None, None, None, None, None, "No Gemini API keys available"
    
    if not ocr_text or len(ocr_text.strip()) < 10:
        return [], [], None, None, None, None, None, "OCR text is too short to extract data"
    
    try:
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        today = datetime.now().strftime("%Y-%m-%d")
        
        prompt = f"""Analyze this prescription text and extract structured data.
Today's date is: {today}

PRESCRIPTION TEXT:
{ocr_text}

Return a JSON object with this exact structure:
{{
    "medicines": [
        {{
            "name": "medicine name",
            "dosage": "dosage amount like 500mg or 10ml",
            "frequency": "how often like twice daily, once at night",
            "duration": "how long like 7 days, 2 weeks",
            "timing": "when to take like after meals, before bed",
            "instructions": "any special instructions"
        }}
    ],
    "tests": [
        {{
            "test_name": "test name like Blood Test, X-Ray, MRI",
            "instructions": "any instructions like fasting required"
        }}
    ],
    "prescription_date": "YYYY-MM-DD (date written on prescription, return null if not found)",
    "visit_reason": "Short 3-5 word title for the visit reason, e.g., 'Viral Fever Treatment', 'Diabetes Checkup', 'Annual Physical'",
    "key_insights": "A concise one-sentence key takeaway or diagnosis, e.g., 'Diagnosed with acute bronchitis; prescribed antibiotics and rest.'",
    "doctor_summary": "A professional clinical summary of this prescription for doctors (2-3 sentences)",
    "patient_summary": "A simple, easy-to-understand summary for patients explaining what medicines to take and when (2-3 sentences)"
}}

Rules:
- If a field is not found, use null
- For duration, extract the exact text (e.g., "7 days", "2 weeks")
- Only include medicines and tests that are clearly mentioned
- If no medicines found, return empty array []
- If no tests found, return empty array []
- Return ONLY the JSON object, no other text"""

        response = model.generate_content(prompt)
        
        if not response or not response.text:
            return [], [], None, None, "No response from AI"
        
        # Clean up response - extract JSON from response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if "```" in response_text:
            # Look for ```json ... ``` or just ``` ... ```
            match = re.search(r'```(?:json)?\s*(\{[\s\S]*?\})\s*```', response_text)
            if match:
                response_text = match.group(1)
            else:
                # Fallback: try to find the first { and last }
                json_match = re.search(r'\{[\s\S]*\}', response_text)
                if json_match:
                    response_text = json_match.group()
        else:
             # Try to find the first { and last } just in case
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                response_text = json_match.group()
        
        data = json.loads(response_text)
        
        medicines = data.get('medicines', [])
        tests = data.get('tests', [])
        doctor_summary = data.get('doctor_summary')
        patient_summary = data.get('patient_summary')
        visit_reason = data.get('visit_reason')
        key_insights = data.get('key_insights')
        prescription_date_str = data.get('prescription_date')
        
        prescription_date = None
        if prescription_date_str:
            try:
                prescription_date = datetime.strptime(prescription_date_str, "%Y-%m-%d").date()
            except:
                pass # Keep as None if parse fails
        
        return medicines, tests, doctor_summary, patient_summary, prescription_date, visit_reason, key_insights, None
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}")
        logger.error(f"Raw response was: {response.text}") # Log the raw response for debugging
        return [], [], None, None, None, None, None, f"Failed to parse extracted data. Raw log has details."
    except Exception as e:
        logger.error(f"Extraction error: {str(e)}")
        return [], [], None, None, None, None, None, f"Extraction failed: {str(e)}"


@app.route('/upload', methods=['GET', 'POST'])
@login_required
def upload():
    """Upload a new prescription."""
    if request.method == 'POST':
        # Check if file was uploaded
        if 'file' not in request.files:
            flash('No file selected.', 'error')
            return redirect(request.url)
        
        file = request.files['file']
        
        # Check if filename is empty
        if file.filename == '':
            flash('No file selected.', 'error')
            return redirect(request.url)
        
        # Validate file type
        if not allowed_file(file.filename):
            flash('Invalid file type. Please upload JPG, PNG, or PDF files only.', 'error')
            return redirect(request.url)
        
        try:
            # Generate unique filename
            from werkzeug.utils import secure_filename
            import uuid
            
            ext = file.filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4().hex}.{ext}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            # Save file
            file.save(filepath)
            
            # Perform OCR on the uploaded image
            ocr_text, ocr_error = perform_ocr(unique_filename)
            
            # Create prescription record
            prescription = Prescription(
                user_id=current_user.user_id,
                image_path=unique_filename,
                ocr_text=ocr_text
            )
            
            db.session.add(prescription)
            db.session.commit()
            
            # If OCR was successful, extract structured data
            if ocr_text:
                medicines_data, tests_data, doc_summary, pat_summary, pres_date, reason, insights, extract_error = extract_structured_data(ocr_text)
                
                # Update prescription with summaries
                prescription.doctor_summary = doc_summary
                prescription.patient_summary = pat_summary
                prescription.prescription_date = pres_date
                prescription.visit_reason = reason
                prescription.key_insights = insights
                
                # Add medicines
                for med in medicines_data:
                    if med.get('name'):
                        medicine = Medicine(
                            prescription_id=prescription.prescription_id,
                            name=med.get('name', ''),
                            dosage=med.get('dosage'),
                            frequency=med.get('frequency'),
                            duration=med.get('duration'),
                            timing=med.get('timing'),
                            instructions=med.get('instructions')
                        )
                        db.session.add(medicine)
                
                # Add medical tests
                for test in tests_data:
                    if test.get('test_name'):
                        medical_test = MedicalTest(
                            prescription_id=prescription.prescription_id,
                            test_name=test.get('test_name', ''),
                            instructions=test.get('instructions')
                        )
                        db.session.add(medical_test)
                
                db.session.commit()
                
                if extract_error:
                    flash(f'Prescription uploaded. Note: {extract_error}', 'info')
                else:
                    flash('Prescription analyzed successfully!', 'success')
            else:
                if ocr_error:
                    flash(f'Prescription uploaded. OCR Note: {ocr_error}', 'info')
                else:
                    flash('Prescription uploaded.', 'success')
            
            return redirect(url_for('view_prescription', prescription_id=prescription.prescription_id))
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Upload error: {str(e)}")
            flash(f'Upload failed. Please try again.', 'error')
            return redirect(request.url)
    
    return render_template('upload.html')


@app.route('/prescription/<int:prescription_id>')
@login_required
def view_prescription(prescription_id):
    """View a specific prescription."""
    prescription = Prescription.query.get_or_404(prescription_id)
    
    # Ensure user owns this prescription
    if prescription.user_id != current_user.user_id:
        flash('Access denied.', 'error')
        return redirect(url_for('dashboard'))
    
    return render_template('results.html', prescription=prescription)


@app.route('/history')
@login_required
def history():
    """View all prescriptions."""
    prescriptions = Prescription.query.filter_by(user_id=current_user.user_id)\
        .order_by(Prescription.upload_date.desc()).all()
    
    return render_template('history.html', prescriptions=prescriptions)


@app.route('/timeline')
@login_required
def timeline():
    """View medical timeline of prescriptions only."""
    
    # Fetch all prescriptions
    prescriptions = Prescription.query.filter_by(user_id=current_user.user_id).all()
    
    # Sort: Use prescription_date (preferable) or upload_date
    # Reverse=True for Newest First
    prescriptions.sort(key=lambda p: p.prescription_date or p.upload_date.date(), reverse=True)
    
    # Generate events list for timeline
    events = []
    
    for p in prescriptions:
        # Determine display date
        display_date = p.prescription_date or p.upload_date.date()
        
        # Determine title (Visit Reason) and description
        title = p.visit_reason or "Medical Visit"
        
        # Build description based on content
        desc_parts = []
        if p.medicines:
            desc_parts.append(f"{len(p.medicines)} Meds")
        if p.medical_tests:
            desc_parts.append(f"{len(p.medical_tests)} Tests")
        
        # Use key_insights if available, otherwise fallback to medicine/test counts
        description = p.key_insights if p.key_insights else (" • ".join(desc_parts) if desc_parts else "No medicines/tests extracted")

        events.append({
            'type': 'visit', # Generic type for all
            'date': display_date,
            'title': title,
            'description': description, # This is now the key insight
            'prescription_id': p.prescription_id,
            'details': p.patient_summary or "Click to view details"
        })
    
    return render_template('timeline.html', events=events)


# ============== HEALTH VITALS TRACKING ==============

@app.route('/api/health', methods=['GET'])
@login_required
def get_health_readings():
    """Get user's health readings for charts."""
    from flask import jsonify
    
    readings = HealthReading.query.filter_by(user_id=current_user.user_id)\
        .order_by(HealthReading.date.desc()).limit(30).all()
    
    return jsonify({
        'readings': [{
            'id': r.id,
            'date': r.date.strftime('%Y-%m-%d'),
            'bp_systolic': r.bp_systolic,
            'bp_diastolic': r.bp_diastolic,
            'sugar_level': r.sugar_level,
            'sugar_type': r.sugar_type,
            'notes': r.notes
        } for r in readings]
    })


@app.route('/api/health', methods=['POST'])
# @csrf.exempt # Removed for security - token is now sent by frontend
@login_required
def add_health_reading():
    """Add today's health reading (BP and/or sugar)."""
    from flask import jsonify
    from datetime import date
    
    data = request.get_json()
    today = date.today()
    
    # Check if today's entry exists
    existing = HealthReading.query.filter_by(
        user_id=current_user.user_id,
        date=today
    ).first()
    
    if existing:
        # Update existing entry
        if data.get('bp_systolic'):
            existing.bp_systolic = int(data['bp_systolic'])
        if data.get('bp_diastolic'):
            existing.bp_diastolic = int(data['bp_diastolic'])
        if data.get('sugar_level'):
            existing.sugar_level = int(data['sugar_level'])
        if data.get('sugar_type'):
            existing.sugar_type = data['sugar_type']
        if data.get('notes'):
            existing.notes = data['notes']
        db.session.commit()
        return jsonify({'status': 'updated', 'id': existing.id})
    else:
        # Create new entry
        reading = HealthReading(
            user_id=current_user.user_id,
            date=today,
            bp_systolic=int(data['bp_systolic']) if data.get('bp_systolic') else None,
            bp_diastolic=int(data['bp_diastolic']) if data.get('bp_diastolic') else None,
            sugar_level=int(data['sugar_level']) if data.get('sugar_level') else None,
            sugar_type=data.get('sugar_type', 'fasting'),
            notes=data.get('notes')
        )
        db.session.add(reading)
        db.session.commit()
        return jsonify({'status': 'created', 'id': reading.id})


@app.route('/api/health/<int:reading_id>', methods=['DELETE'])
# @csrf.exempt # Removed for security - token is now sent by frontend
@login_required
def delete_health_reading(reading_id):
    """Delete a health reading."""
    from flask import jsonify
    
    reading = HealthReading.query.get_or_404(reading_id)
    
    if reading.user_id != current_user.user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(reading)
    db.session.commit()
    return jsonify({'status': 'deleted'})


# ============== MULTILINGUAL SUPPORT ==============

SUPPORTED_LANGUAGES = {
    'en': 'English',
    'hi': 'Hindi (हिंदी)',
    'ta': 'Tamil (தமிழ்)',
    'te': 'Telugu (తెలుగు)',
    'bn': 'Bengali (বাংলা)',
    'mr': 'Marathi (मराठी)'
}

@app.route('/set_language', methods=['POST'])
def set_language():
    """Set user's preferred language in session."""
    from flask import jsonify, session
    data = request.get_json()
    lang = data.get('lang', 'en')
    if lang in SUPPORTED_LANGUAGES:
        session['lang'] = lang
        return jsonify({'status': 'ok', 'lang': lang})
    return jsonify({'error': 'Invalid language'}), 400


# ============== RAG CHATBOT ==============

@app.route('/chat')
@login_required
def chat():
    """AI Chat page for querying prescription data."""
    return render_template('chat.html')


@app.route('/api/chat', methods=['POST'])
@login_required
def chat_api():
    """API endpoint for RAG chatbot. Uses context injection with Gemini."""
    import google.generativeai as genai
    from flask import jsonify
    
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'Please enter a message'}), 400
        
        # Use dedicated chatbot API key (separate quota from OCR)
        chat_api_key = os.getenv('GEMINI_CHAT_API_KEY', '')
        if not chat_api_key:
            # Fallback to rotation system if no dedicated key
            chat_api_key, key_index = get_next_api_key()
        else:
            key_index = -1  # Dedicated key, no rotation needed
        
        if not chat_api_key:
            return jsonify({'error': 'AI service temporarily unavailable'}), 503
        
        # Build context from user's prescriptions
        prescriptions = Prescription.query.filter_by(user_id=current_user.user_id)\
            .order_by(Prescription.upload_date.desc()).all()
        
        if not prescriptions:
            return jsonify({
                'response': "You don't have any prescriptions uploaded yet. Please upload a prescription first to ask questions about your health data."
            })
        
        # Build prescription context
        context_parts = []
        for p in prescriptions:
            date_str = p.prescription_date.strftime('%B %d, %Y') if p.prescription_date else p.upload_date.strftime('%B %d, %Y')
            
            context_parts.append(f"### Prescription from {date_str}")
            
            if p.visit_reason:
                context_parts.append(f"Visit Reason: {p.visit_reason}")
            
            if p.key_insights:
                context_parts.append(f"Key Insights: {p.key_insights}")
            
            if p.medicines:
                meds = []
                for m in p.medicines:
                    med_info = f"- {m.name}"
                    if m.dosage:
                        med_info += f" ({m.dosage})"
                    if m.frequency:
                        med_info += f" - {m.frequency}"
                    if m.timing:
                        med_info += f" - {m.timing}"
                    if m.duration:
                        med_info += f" for {m.duration}"
                    meds.append(med_info)
                context_parts.append("Medicines:\n" + "\n".join(meds))
            
            if p.medical_tests:
                tests = [f"- {t.test_name} (Status: {t.status})" for t in p.medical_tests]
                context_parts.append("Tests:\n" + "\n".join(tests))
            
            if p.patient_summary:
                context_parts.append(f"Summary: {p.patient_summary}")
            
            context_parts.append("")  # Empty line between prescriptions
        
        context = "\n".join(context_parts)
        
        # Get user's preferred language
        from flask import session
        user_lang = session.get('lang', 'en')
        lang_name = SUPPORTED_LANGUAGES.get(user_lang, 'English')
        
        # Build prompt with language instruction
        lang_instruction = ""
        if user_lang != 'en':
            lang_instruction = f"\n\nIMPORTANT: Respond in {lang_name}. The user prefers to receive answers in {lang_name}."
        
        prompt = f"""You are a helpful AI health assistant for the Medi-Sum application. 
Answer questions based ONLY on the user's prescription data provided below. 
Be concise, friendly, and helpful. If the information is not in the data, say so politely.
Do not make up information. Always be accurate about medicine names, dosages, and frequencies.{lang_instruction}

## User's Prescription Data:
{context}

## User's Question:
{user_message}

## Your Response:"""

        # Call Gemini API
        genai.configure(api_key=chat_api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        response = model.generate_content(prompt)
        
        if response and response.text:
            logger.info(f"Chat response generated {'(dedicated key)' if key_index == -1 else f'(key #{key_index + 1})'}")
            return jsonify({'response': response.text})
        else:
            return jsonify({'error': 'Could not generate response'}), 500
            
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Chat error: {error_msg}")
        
        # Check for quota errors
        if "quota" in error_msg.lower() or "429" in error_msg:
            mark_key_exhausted(key_index)
            return jsonify({'error': 'AI service is busy. Please try again in a moment.'}), 503
        
        return jsonify({'error': 'Something went wrong. Please try again.'}), 500


# ============== ERROR HANDLERS ==============

@app.errorhandler(404)
def not_found_error(error):
    return render_template('error.html', error_code=404, message='Page not found'), 404


@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('error.html', error_code=500, message='Internal server error'), 500


# ============== DATABASE INITIALIZATION ==============

def init_db():
    """Initialize the database."""
    with app.app_context():
        db.create_all()
        logger.info("Database initialized!")


if __name__ == '__main__':
    init_db()
    # Production-ready: Debug off by default, Port from Env
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.getenv('PORT', 5000))
    app.run(debug=debug_mode, port=port, host='0.0.0.0')
