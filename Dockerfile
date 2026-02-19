# Use Python 3.10 Bookworm (stable Debian 12) for better compatibility
FROM python:3.10-bookworm

# Set working directory
WORKDIR /app

# Install system dependencies
# Using full bookworm image avoids some 'slim' missing package issues
RUN apt-get update --fix-missing && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libgl1-mesa-glx \
    libglib2.0-0 \
    python3-dev \
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
