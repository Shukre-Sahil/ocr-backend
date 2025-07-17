import cv2
import numpy as np
import pytesseract
from PIL import Image

def ocr_core(img):
    text = pytesseract.image_to_string(img)
    return text

image_path = input("Enter image filename (with extension): ")
img = cv2.imread(image_path)

if img is None:
    print("Image not loaded. Check filename or path.")
    exit()

def get_greyscale(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def remove_noise(image):
    return cv2.medianBlur(image,5)

# def thresholding(image):
#     return cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]


def resize_image(image, scale_percent):
    width = int(image.shape[1] * scale_percent / 100)
    height = int(image.shape[0] * scale_percent / 100)
    dim = (width, height)
    return cv2.resize(image, dim, interpolation = cv2.INTER_AREA)

def increase_contrast(image):
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl,a,b))
    return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

# Optional preprocessing enhancements
img = resize_image(img, 150)
img = increase_contrast(img)

img = get_greyscale(img)
# img = thresholding(img)
img = remove_noise(img)

print(ocr_core(img))
