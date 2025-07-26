FROM python:3.9-slim

# Install Tesseract and language packs
RUN apt-get update && \
    apt-get install -y tesseract-ocr tesseract-ocr-eng tesseract-ocr-hin tesseract-ocr-mar && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Environment variable (optional but safe)
ENV TESSERACT_CMD=tesseract

# Expose the port
EXPOSE 5000

# Run using gunicorn in production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
