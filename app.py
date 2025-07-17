from flask import Flask, request, jsonify
import pytesseract
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # To allow frontend to connect

# Update for your system
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

@app.route('/ocr', methods=['POST'])
def ocr():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})

    file = request.files['file']
    lang = request.form.get('lang', 'eng')  # Default to English if not specified

    try:
        img = Image.open(file.stream)
        text = pytesseract.image_to_string(img, lang=lang)
        return jsonify({'extracted_text': text})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')




