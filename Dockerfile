# Use Python 3.10 slim image for better compatibility
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies (Tesseract OCR + GL libraries)
# Combine apt-get update and install to keep layer small
# Added --no-install-recommends to reduce image size
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements FIRST to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
# Upgrade pip first
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port (Render sets PORT env var, but good to doc)
EXPOSE 10000

# Command to run the application using Gunicorn
# Bind to 0.0.0.0:$PORT (Render injects PORT)
CMD gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
