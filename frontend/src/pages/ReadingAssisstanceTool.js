import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import paragraphs from '../utils/ReadingParagraphs';

const ReadingAssistanceTool = () => {
  const [isReading, setIsReading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [readingTime, setReadingTime] = useState(0);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(0);
  const [fluencyRating, setFluencyRating] = useState(null);
  const [isFluencyRatingReceived, setIsFluencyRatingReceived] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentParagraph, setCurrentParagraph] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1); // Default speech speed
  const [voices, setVoices] = useState([]); // Available voices
  const [selectedVoice, setSelectedVoice] = useState(null); // Selected voice
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [wordDefinitions, setWordDefinitions] = useState({
    word: '',
    definition: '',
    synonyms: [],
  });

  const dyslexiaFriendlyFont = {
    fontFamily: 'OpenDyslexic, sans-serif',
    lineHeight: '2',
    letterSpacing: '0.1em',
    wordSpacing: '0.15em',
    backgroundColor: '#F0F8FF',
    color: '#333',
    padding: '10px',
    fontSize: '1.2rem',
  };

  useEffect(() => {
    setIsVisible(true);
    const synth = window.speechSynthesis;
    const availableVoices = synth.getVoices();

    // Set available voices and select the first one
    setVoices(availableVoices);
    setSelectedVoice(availableVoices[0]); // Default voice to the first available voice

    // Voice change listener
    synth.onvoiceschanged = () => {
      const updatedVoices = synth.getVoices();
      setVoices(updatedVoices);
      setSelectedVoice(updatedVoices[0]); // Default to the first available voice
    };
  }, []);

  const handleStartReading = async () => {
    setIsReading(true);
    setStartTime(Date.now());

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      let chunks = [];
      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setIsRecording(false);
      };

      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        toast.error('MediaRecorder error occurred.');
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Error accessing microphone. Please check your permissions.');
      setIsReading(false);
    }
  };

  const handleFinishReading = () => {
    setIsReading(false);
    const timeTaken = (Date.now() - startTime) / 1000;
    setReadingTime(timeTaken);
    setIsTestCompleted(true);

    const wordsInPassage = paragraphs[currentParagraph].split(' ').length;
    const speed = (wordsInPassage / (timeTaken / 60)).toFixed(2);
    setReadingSpeed(speed);

    if (mediaRecorder) {
      mediaRecorder.stop();
    } else {
      toast.error('Recording not started correctly.');
    }
  };

  const saveResultsToBackend = async (speed, timeTaken) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please log in.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/save-reading-results',
        { readingSpeed: speed, timeTaken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Results saved successfully!');
    } catch (error) {
      console.error('Error saving results:', error.response ? error.response.data : error.message);
      toast.error('Error saving results!');
    }
  };

  const uploadAudioToBackend = async () => {
    if (!audioBlob) {
      toast.error('No audio recorded!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please log in.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', audioBlob, 'reading-test.wav');

    try {
      const response = await axios.post('http://localhost:5000/api/upload-audio', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setFluencyRating(response.data.fluency_rating);
      setIsFluencyRatingReceived(true);
      toast.success('Audio uploaded and fluency rating received!');
    } catch (error) {
      console.error('Error uploading audio:', error.response ? error.response.data : error.message);
      toast.error('Error uploading audio!');
    }
  };

  useEffect(() => {
    if (isTestCompleted && audioBlob) {
      saveResultsToBackend(readingSpeed, readingTime);
      uploadAudioToBackend();
    }
  }, [isTestCompleted, audioBlob]);

  useEffect(() => {
    if (isFluencyRatingReceived) {
      setIsFluencyRatingReceived(false);
    }
  }, [isFluencyRatingReceived]);

  const handleParagraphSelect = (index) => {
    setCurrentParagraph(index);
    setIsTestCompleted(false);
    setFluencyRating(null);
    setAudioBlob(null);
    setReadingTime(0);
    setReadingSpeed(0);
  };

  const handleReadSentence = (text, index) => {
    const words = text.split(' ');
    const synth = window.speechSynthesis;
    let wordIndex = 0;
  
    // Set the current sentence index
    setCurrentSentenceIndex(index);
  
    const readNextWord = () => {
      if (wordIndex < words.length) {
        const utterance = new SpeechSynthesisUtterance(words[wordIndex]);
        utterance.rate = speechSpeed;
        utterance.voice = selectedVoice;
  
        // Increment the index after the word is spoken
        utterance.onend = () => {
          wordIndex++;
          readNextWord(); // Read the next word after the current one ends
        };
  
        // Read the word
        synth.speak(utterance);
      } else {
        // Reset current sentence index when done reading
        setCurrentSentenceIndex(null);
      }
    };
  
    readNextWord();
  };

  const handleWordClick = async (word) => {
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = response.data[0];
      setWordDefinitions({
        word,
        definition: data.meanings[0].definitions[0].definition,
        synonyms: data.meanings[0].synonyms || [],
      });
    } catch (error) {
      console.error('Error fetching word meaning:', error);
      toast.error('Error fetching word meaning!');
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 min-h-screen p-8 flex flex-col items-center">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-blue-800 mb-8 text-center">Reading Assistance Tool</h2>

      {currentParagraph === null ? (
        <section className="grid grid-cols-1 gap-6 w-full max-w-4xl">
          <h3 className="text-xl font-bold mb-4 text-center">Select a paragraph to read:</h3>
          {paragraphs.map((paragraph, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105
                w-full ${isVisible ? `animate-crazyCardAnimation delay-${index * 200}` : 'opacity-0'}`}
              onClick={() => handleParagraphSelect(index)}
            >
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                {`Paragraph ${index + 1}`}
              </h3>
              <p className="text-gray-600">{paragraph.substring(0, 100)}...</p>
            </div>
          ))}
        </section>
      ) : (
        <div className={`bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full mx-auto text-center 
          ${isVisible ? 'opacity-100 animate-fadeIn' : 'opacity-0'}`}>
          <h3 className="text-xl font-bold mb-4">Read the following passage:</h3>
          <div className="text-gray-700 mb-4" style={dyslexiaFriendlyFont}>
            {paragraphs[currentParagraph].split('. ').map((sentence, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center mb-2 flex-wrap">
                <span
                  className={`inline-block cursor-pointer ${currentSentenceIndex === index ? 'bg-yellow-200' : ''}`}
                >
                  {sentence.split(' ').map((word, wordIndex) => (
                    <span
                      key={wordIndex}
                      onClick={() => handleWordClick(word)}
                      className="inline-block cursor-pointer hover:bg-gray-200"
                      style={{ marginRight: '6px' }}
                    >
                      {word}
                    </span>
                  ))}
                </span>
                <button
                  onClick={() => handleReadSentence(sentence.trim(), index)}
                  className="text-blue-500 underline hover:text-blue-700 ml-4"
                >
                  Listen
                </button>
              </div>
            ))}
          </div>


          <div className="mb-4">
            <label htmlFor="speechSpeed" className="mr-2">Speech Speed:</label>
            <input
              type="range"
              id="speechSpeed"
              min="0.5"
              max="2"
              step="0.1"
              value={speechSpeed}
              onChange={(e) => setSpeechSpeed(e.target.value)}
              className="w-full"
            />
            <p>Current Speed: {speechSpeed}x</p>
          </div>

          <div className="mb-4">
            <label htmlFor="voiceSelect" className="mr-2">Select Voice:</label>
            <select
              id="voiceSelect"
              value={selectedVoice ? selectedVoice.name : ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value);
                setSelectedVoice(voice);
              }}
            >
              {voices.map((voice, index) => (
                <option key={index} value={voice.name}>{voice.name} ({voice.lang})</option>
              ))}
            </select>
          </div>

          {!isReading ? (
            <button
              onClick={handleStartReading}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
            >
              Start Reading
            </button>
          ) : (
            <button
              onClick={handleFinishReading}
              className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
            >
              Finish Reading
            </button>
          )}

          {wordDefinitions.word && (
            <div className="bg-blue-100 p-4 rounded-lg mt-4">
              <h4 className="text-blue-800 font-semibold">
                Meaning of "{wordDefinitions.word}":
              </h4>
              <p className="text-blue-600">{wordDefinitions.definition}</p>
              {wordDefinitions.synonyms.length > 0 && (
                <p className="text-blue-500">
                  <strong>Synonyms:</strong> {wordDefinitions.synonyms.join(', ')}
                </p>
              )}
            </div>
          )}    

          {isTestCompleted && (
            <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg shadow-md text-left">
              <h4 className="text-lg font-semibold text-purple-800 mb-2">Results:</h4>
              <p className="text-gray-800 mb-1">
                Time Taken: <span className="font-bold">{readingTime.toFixed(2)} seconds</span>
              </p>
              <p className="text-gray-800 mb-1">
                Reading Speed: <span className="font-bold">{readingSpeed} WPM</span>
              </p>
              {fluencyRating !== null && (
                <p className="text-gray-800 mb-1">
                  Fluency Rating: <span className="font-bold">{fluencyRating}</span>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReadingAssistanceTool;
