# Use Python 3.9 slim image for a smaller footprint
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies (Tesseract OCR + GL libraries for OpenCV if needed)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
# Note: Installing torch/torchvision CPU version to save space/build time if GPU not needed
# Hugging Face Spaces CPU basic tier does not have GPU
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download TrOCR model to avoid timeout on first run
COPY download_model.py .
RUN python download_model.py && rm download_model.py

# Copy the rest of the application
COPY . .

# Create a non-root user (Hugging Face requirement for security)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

# Command to run the application using Gunicorn
# 2 workers recommended for free tier
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "2", "--timeout", "120", "app:app"]
