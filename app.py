from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://docuease-ss.netlify.app", "http://localhost:3000"]}})

# Optional: Tesseract path
pytesseract.pytesseract.tesseract_cmd = os.getenv("TESSERACT_CMD", "tesseract")

@app.route('/ocr', methods=['POST'])
def ocr():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})

    file = request.files['file']
    lang = request.form.get('lang', 'eng')  # 'eng' by default

    try:
        img = Image.open(file.stream)
        text = pytesseract.image_to_string(img, lang=lang)
        return jsonify({'extracted_text': text})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
