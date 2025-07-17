import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [language, setLanguage] = useState('eng');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleLangChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('lang', language);

    try {
      const response = await axios.post('http://192.168.196.71:5000/ocr', formData);
      setExtractedText(response.data.extracted_text);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ margin: '40px' }}>
      <h1>Welcome to DocuEase!</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" required />
        
        <select value={language} onChange={handleLangChange}>
          <option value="eng">English</option>
          <option value="hin">Hindi</option>
          <option value="mar">Marathi</option>
        </select>

        <button type="submit">Extract Text</button>
      </form>

      <h2>Extracted Text:</h2>
      <textarea rows="10" cols="80" value={extractedText} readOnly></textarea>
    </div>
  );
}

export default App;
