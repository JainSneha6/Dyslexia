import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [response, setResponse] = useState('');

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (text) formData.append('text', text);
    if (image) formData.append('image', image);
    if (audio) formData.append('audio', audio);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/ask', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  console.log(response)

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Dyslexic Support Chatbot</h1>

      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Type your question here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e, setImage)}
        className="mb-4"
      />

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => handleFileChange(e, setAudio)}
        className="mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {response && (
        <div className="mt-6 p-4 bg-white rounded shadow-md w-full max-w-md">
          <h2 className="font-bold">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
