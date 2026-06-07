# Use Python 3.11 for latest Google API support (Fixes EOL warnings)
FROM python:3.11-slim-bookworm

# Set working directory
WORKDIR /app

# Install system dependencies
# libgl1 replaces libgl1-mesa-glx in newer Debian versions
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libgl1 \
    libglib2.0-0 \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user (UID 1000)
RUN useradd -m -u 1000 user

# Set environment variables
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    HF_HOME=/home/user/.cache/huggingface \
    PIP_BREAK_SYSTEM_PACKAGES=1

# Prepare Cache dir for user
RUN mkdir -p $HF_HOME && chown -R user:user /home/user

# Set working directory
WORKDIR /app

# Copy requirements (root ownership is fine here as we are root)
COPY requirements.txt .

# Install Python dependencies AS ROOT (Global Install)
# This avoids permission issues and simplifies path resolution
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download TrOCR model -> SKIPPED
# Verification: Build-time download causes OOM on small builders.
# The app will download the model automatically on first launch (runtime).

# Copy the rest of the application
COPY --chown=user:user . .

# Final switch to user for security
USER user

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

# Command to run the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "2", "--timeout", "120", "app:app"]
