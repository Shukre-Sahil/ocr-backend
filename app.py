from flask import Flask, request, jsonify
import pytesseract
from PIL import Image
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://docuease-ss.netlify.app", "http://localhost:3000"]}}) # to allow frontend and local host to connect.

# Update for your system
pytesseract.pytesseract.tesseract_cmd = os.getenv("TESSERACT_CMD", "tesseract")


@app.route('/ocr', methods=['POST'])
def ocr():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    lang = request.form.get('lang', 'eng')

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        img = Image.open(file.stream).convert("RGB")

        # Resize to avoid memory/timeout issues
        MAX_WIDTH = 1000
        MAX_HEIGHT = 1000
        if img.width > MAX_WIDTH or img.height > MAX_HEIGHT:
            img.thumbnail((MAX_WIDTH, MAX_HEIGHT))

        # Run OCR with timeout
        try:
            text = pytesseract.image_to_string(img, lang=lang, timeout=10)
        except RuntimeError as e:
            if "Tesseract process timeout" in str(e):
                return jsonify({'error': 'Image is too complex or takes too long to process. Try a smaller/clearer image.'}), 408
            return jsonify({'error': str(e)}), 500

        return jsonify({'extracted_text': text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')