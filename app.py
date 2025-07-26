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
        return jsonify({'error': 'No file uploaded'})

    file = request.files['file']
    lang = request.form.get('lang', 'eng')  # Default to English

    try:
        img = Image.open(file.stream)

        # Resize large images
        max_size = (1600, 1600)
        if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
            img.thumbnail(max_size, Image.LANCZOS)

        # OCR with Tesseract
        text = pytesseract.image_to_string(img, lang=lang, config='--oem 3 --psm 6')

        return jsonify({'extracted_text': text})

    except Exception as e:
        return jsonify({'error': str(e)})



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')