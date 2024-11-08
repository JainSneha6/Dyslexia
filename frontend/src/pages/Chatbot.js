import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaMicrophone, FaPaperPlane, FaFileImage, FaStop } from 'react-icons/fa';

const Chatbot = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      const audioChunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (text) formData.append('text', text);
    if (image) formData.append('image', image);
    if (audioBlob) formData.append('audio', audioBlob, 'recording.wav');

    setMessages([...messages, { sender: 'user', content: text }]);

    try {
      const res = await axios.post('http://65.20.88.229/api/ask', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', content: res.data.response },
      ]);
    } catch (error) {
      console.error('Error sending request:', error);
    }

    setText('');
    setImage(null);
    setAudioBlob(null);
    setAudioURL('');
  };

  return (
    <div className="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 min-h-screen p-8 flex flex-col items-center" style={{ fontFamily: 'OpenDyslexic', lineHeight: '1.5' }} >
      <h1 className="text-5xl font-semibold text-blue-700 mb-8"> Dyslexia Support Chatbot</h1>

      <div className="w-full max-w-3xl flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden" style={{ height: '80vh' }}>
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl max-w-md ${msg.sender === 'user' ? 'ml-auto bg-purple-100 text-right' : 'mr-auto bg-gray-100 text-left'}`}
            >
              <p className="text-lg">{msg.content}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-purple-50 border-t border-gray-200">
          <div className="relative flex items-center">
            <textarea
              className="w-full py-2 px-4 pr-16 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:outline-none resize-none"
              rows="1"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your question..."
            ></textarea>

            <div className="absolute right-4 flex items-center space-x-3">
              <label className="cursor-pointer text-purple-500 hover:text-purple-700">
                <FaFileImage size={24} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setImage)}
                  className="hidden"
                />
              </label>

              {!isRecording ? (
                <button onClick={startRecording} className="text-green-500 hover:text-green-700">
                  <FaMicrophone size={24} />
                </button>
              ) : (
                <button onClick={stopRecording} className="text-red-500 hover:text-red-700">
                  <FaStop size={24} />
                </button>
              )}

              <button onClick={handleSubmit} className="text-blue-500 hover:text-blue-700">
                <FaPaperPlane size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
