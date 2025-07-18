# Use official Python slim image
FROM python:3.9-slim

# Install system dependencies including Hindi and Marathi OCR data
RUN apt-get update && \
    apt-get install -y tesseract-ocr tesseract-ocr-eng tesseract-ocr-hin tesseract-ocr-mar && \
    apt-get clean

# Set working directory
WORKDIR /app

# Copy requirements.txt first and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all remaining files
COPY . .

# Expose port (Render uses 10000 by default, but Flask defaults to 5000; Render maps automatically)
EXPOSE 5000

# Set environment variable for Tesseract path
ENV TESSERACT_CMD=tesseract

# Command to run the app with gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
