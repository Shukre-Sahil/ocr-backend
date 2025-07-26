import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { FaFileWord, FaFilePdf, FaClipboard } from 'react-icons/fa';


function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [language, setLanguage] = useState('eng');
  const [darkMode, setDarkMode] = useState(true); // default dark mode
  const [loading, setLoading] = useState(false); // Loader (updated)


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLangChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleDownloadDocx = () => {
    if (!extractedText) return;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun(extractedText)]
          })
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "extracted_text.docx");
    });
  };

  const handleDownloadPDF = () => {
    if (!extractedText) return;

    const doc = new jsPDF();
    doc.setFont("Courier", "normal");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(extractedText, 180); // wrap text within page width
    doc.text(lines, 10, 10);
    doc.save("extracted_text.pdf");
  };

  const handleCopyToClipboard = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText)
      .then(() => alert("Text copied to clipboard!"))
      .catch((err) => console.error("Failed to copy text:", err));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('lang', language);

    setLoading(true); //start loader (updated)
    
    try {
      const response = await axios.post('https://ocr-backend-gr8w.onrender.com/ocr', formData,
        {timeout:90000}
      );
      setExtractedText(response.data.extracted_text);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); //stop loader (updated)
    }
  };

  const colors = darkMode ? {
    primary: '#3B82F6',
    secondary: '#A78BFA',
    background: '#0F172A',
    text: '#E2E8F0',
    accent: '#10B981',
    neonPop: '#00F0FF'
  } : {
    primary: '#2563EB',
    secondary: '#7C3AED',
    background: '#F9FAFB',
    text: '#1F2937',
    accent: '#10B981',
    neonPop: '#00F0FF'
  };

  const appStyles = {
    fontFamily: '"Michroma", sans-serif',
    background: darkMode
      ? linear-gradient(135deg, ${colors.background}, #1E293B)
      : linear-gradient(135deg, ${colors.background}, #FFFFFF),
    color: colors.text,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    transition: 'background 0.5s ease, color 0.5s ease'
  };

  const headingStyle = {
    fontFamily: '"Michroma", sans-serif',
    color: colors.primary,
    fontSize: '2em',
    margin: '10px 0',
    textAlign: 'center',
    textShadow: 0 0 10px ${colors.neonPop}
  };

  const taglineStyle = {
    fontSize: '15px',
    fontFamily: '"Michroma", sans-serif',
    marginTop: '-6px',
    marginBottom: '30px',
    color: colors.secondary,
    textAlign: 'center'
  };

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: darkMode ? 'rgba(30,41,59,0.85)' : '#E5E7EB',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: 0 0 12px ${colors.neonPop},
    width: '90%',
    maxWidth: '500px',
    transition: 'background-color 0.5s ease'
  };

  const buttonStyles = {
    backgroundColor: colors.primary,
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
    fontFamily: '"Michroma", sans-serif',
    boxShadow: 0 0 10px ${colors.neonPop},
    transition: 'all 0.3s ease'
  };

  const textareaStyles = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #334155',
    fontSize: '14px',
    backgroundColor: darkMode ? '#1E293B' : '#F3F4F6',
    color: colors.text,
    fontFamily: '"Bitcount Grid Single", monospace',
    transition: 'background-color 0.5s ease, color 0.5s ease'
  };

  return (
    <div style={appStyles}>
      <div style={{ alignSelf: 'flex-end', marginBottom: '10px', marginRight: '20px' }}>
        <label style={{ fontFamily: '"Michroma", sans-serif', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
            style={{ marginRight: '8px' }}
          />
          {darkMode ? 'Dark Mode' : 'Light Mode'}
        </label>
      </div>

      <h1 style={headingStyle}>DocuEase</h1>
      <p style={taglineStyle}>Simplifying Document Digitization through OCR</p>

    {loading && (
  <div className="loader-dots-container">
    <div className="loader-dots">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div className="loader-text">Processing... Please wait.</div>
  </div>
)}

      <form onSubmit={handleSubmit} style={formStyles}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          required
          style={{
            marginBottom: '15px',
            padding: '8px',
            borderRadius: '5px',
            border: 'none',
            width: '100%',
            color: colors.text,
            backgroundColor: darkMode ? '#334155' : '#D1D5DB',
            fontFamily: '"Michroma", sans-serif'
          }}
        />

        <select
          value={language}
          onChange={handleLangChange}
          style={{
            marginBottom: '20px',
            padding: '8px',
            width: '100%',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: darkMode ? '#334155' : '#D1D5DB',
            color: colors.text,
            fontFamily: '"Michroma", sans-serif'
          }}
        >
          <option value="eng">English</option>
          <option value="hin">Hindi</option>
          <option value="mar">Marathi</option>
        </select>

        <button
          type="submit"
          style={buttonStyles}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = colors.accent;
            e.currentTarget.style.animation = 'neon-glow 1.5s infinite alternate';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary;
            e.currentTarget.style.animation = 'none';
          }}
        >
          Extract Text
        </button>
      </form>

      <div style={{ marginTop: '30px', width: '90%', maxWidth: '600px' }}>
        <h3 style={{ fontFamily: '"Fjalla One", sans-serif', textAlign: 'center', color: colors.secondary }}>
          Extracted Text:
        </h3>
        <textarea rows="10" value={extractedText} readOnly style={textareaStyles}></textarea>
      </div>


      {extractedText && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '20px'
          }}
        >
          <button
            onClick={handleDownloadDocx}
            style={{
              backgroundColor: colors.accent,
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: '"Michroma", sans-serif',
              boxShadow: 0 0 5px rgba(0,0,0,0.3),
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#059669'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = colors.accent; }}
          >
            <FaFileWord />
            DOCX
          </button>

          <button
            onClick={handleDownloadPDF}
            style={{
              backgroundColor: colors.accent,
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: '"Michroma", sans-serif',
              boxShadow: 0 0 5px rgba(0,0,0,0.3),
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#059669'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = colors.accent; }}
          >
            <FaFilePdf />
            PDF
          </button>

          <button
            onClick={handleCopyToClipboard}
            style={{
              backgroundColor: colors.primary,
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: '"Michroma", sans-serif',
              boxShadow: 0 0 5px rgba(0,0,0,0.3),
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1D4ED8'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = colors.primary; }}
          >
            <FaClipboard />
            Copy
          </button>
        </div>
      )}



      <footer style={{ marginTop: '50px', color: '#9CA3AF', fontSize: '11px', fontFamily: '"Michroma", sans-serif', textAlign: 'center' }}>
        © 2025 DocuEase | Developed by Sahil Shukre
      </footer>
    </div>
  );
}

export default App;