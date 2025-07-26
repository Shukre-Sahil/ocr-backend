from flask import Flask, request, jsonify
import pytesseract
from PIL import Image, ImageEnhance
import numpy as np
import cv2
from flask_cors import CORS
import os
import io

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://docuease-ss.netlify.app", "http://localhost:3000"]}})  # allow frontend and local host


# Update for your system
pytesseract.pytesseract.tesseract_cmd = os.getenv("TESSERACT_CMD", "tesseract")


def preprocess_image(pil_image):
    # Convert PIL image to OpenCV format (numpy array)
    img = np.array(pil_image)

    # Convert RGBA or RGB to BGR
    if img.shape[2] == 4:
        img = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
    else:
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    # Resize (Upscale if too small)
    height, width = img.shape[:2]
    if height < 1000 or width < 1000:
        img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    # Denoising with bilateral filter
    img = cv2.bilateralFilter(img, 9, 75, 75)

    # Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # CLAHE for contrast enhancement
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(gray)

    # Adaptive thresholding
    thresh = cv2.adaptiveThreshold(enhanced, 255, 
                                   cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY, 11, 2)

    # Morphological closing to remove small holes/noise
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1,1))
    processed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    # Convert back to PIL Image
    pil_processed = Image.fromarray(processed)

    return pil_processed


@app.route('/ocr', methods=['POST'])
def ocr():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})

    file = request.files['file']
    lang = request.form.get('lang', 'eng')  # Default to English if not specified

    try:
        img = Image.open(file.stream)
        processed_img = preprocess_image(img)  # Preprocess before OCR

        text = pytesseract.image_to_string(processed_img, lang=lang)
        return jsonify({'extracted_text': text})

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
