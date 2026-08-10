# DocuEase OCR Web App
A lightweight web application for seamless text extraction from images.


**Simplifying Document Digitization through OCR**

[![Netlify Status](https://api.netlify.com/api/v1/badges/31707da4-6642-41fe-934e-a9c755c87a28/deploy-status)](https://app.netlify.com/projects/docuease-ss/deploys)

## 🚀 Live Demo

- **Frontend:** [DocuEase on Netlify](https://docuease-ss.netlify.app/)
- **Backend API:** [Flask API on Render](https://ocr-backend-gr8w.onrender.com)

---

## 📝 Project Overview

DocuEase is a web-based Optical Character Recognition (OCR) platform that extracts text from images in **English, Hindi, and Marathi**, enabling rapid document digitization for students, businesses, and researchers.

---

## ⚙️ Tech Stack

- **Frontend:** React.js (JavaScript, HTML, CSS)
- **Backend:** Flask, Python, Tesseract OCR
- **Deployment:**
  - Frontend – Netlify
  - Backend – Render

---

## 💻 Implementation Details

### **Frontend**
- Built using **React.js functional components and hooks**.
- Features:
  - File upload input
  - Language selection dropdown
  - Dark mode toggle
  - Responsive, aesthetic UI with neon theme.

### **Backend**
- Developed with **Flask**.
- Uses **Tesseract OCR** for multi-language text extraction.
- REST API with `/ocr` POST endpoint.

### **Deployment**
- **Frontend** deployed on **Netlify** for fast static serving.
- **Backend** deployed on **Render** for scalable API hosting.

---

## 🚧 Limitations

- Cold start delay (~10-30 sec) if backend is inactive for >15 min.
- Accuracy depends on image clarity and supported fonts.
- Limited concurrency due to free hosting plan constraints.
---

## 👤 Developer

**Sahil Shukre**

Connect on GitHub: [Shukre-Sahil](https://github.com/Shukre-Sahil)

**Mayank Gomase**

Connect on GitHub: [Mayankg-13](https://github.com/Mayankg-13)

---
