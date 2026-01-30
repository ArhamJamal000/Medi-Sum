#!/bin/bash
# Script to run the app locally in production mode (using gunicorn)
# This simulates how it will run on Hugging Face Spaces

# Install gunicorn if not present
if ! command -v gunicorn &> /dev/null
then
    echo "Gunicorn not found. Installing..."
    pip install gunicorn
fi

# Run the app
echo "Starting Medi-Sum in Production Mode on port 7860..."
echo "Access at: http://localhost:7860"
gunicorn --bind 0.0.0.0:7860 --workers 2 --timeout 120 app:app
