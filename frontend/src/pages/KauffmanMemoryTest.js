import React, { useState, useEffect } from 'react';
import { FaApple, FaDog, FaCar, FaRocket, FaCat, FaFish } from 'react-icons/fa';

const MemoryTest = () => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isRevealing, setIsRevealing] = useState(true);
  const [score, setScore] = useState(null);
  const [testType, setTestType] = useState('icons'); // 'icons', 'words', or 'audio'
  const sequenceLength = 4; // Length of the sequence to display

  // Sample datasets
  const icons = [
    { id: 'apple', icon: <FaApple /> },
    { id: 'dog', icon: <FaDog /> },
    { id: 'car', icon: <FaCar /> },
    { id: 'rocket', icon: <FaRocket /> },
    { id: 'cat', icon: <FaCat /> },
    { id: 'fish', icon: <FaFish /> }
  ];

  const words = [
    { id: 'apple', word: 'Apple' },
    { id: 'dog', word: 'Dog' },
    { id: 'car', word: 'Car' },
    { id: 'rocket', word: 'Rocket' },
    { id: 'cat', word: 'Cat' },
    { id: 'fish', word: 'Fish' }
  ];

  const audio = [
    { id: 'apple', sound: 'sounds/apple.mp3' },
    { id: 'dog', sound: 'sounds/dog.mp3' },
    { id: 'car', sound: 'sounds/car.mp3' },
    { id: 'rocket', sound: 'sounds/rocket.mp3' },
    { id: 'cat', sound: 'sounds/cat.mp3' },
    { id: 'fish', sound: 'sounds/fish.mp3' }
  ];

  useEffect(() => {
    // Generate a random sequence based on the selected test type
    const dataset = testType === 'icons' ? icons : testType === 'words' ? words : audio;
    const randomSequence = generateRandomSequence(dataset, sequenceLength);
    setSequence(randomSequence);
    
    // Hide the sequence after 10 seconds to challenge the user's memory
    setTimeout(() => {
      setIsRevealing(false);
    }, 10000);
  }, [testType]);

  const generateRandomSequence = (dataArray, length) => {
    // Shuffle and select a random sequence from the provided dataset
    const shuffled = [...dataArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, length);
  };

  const handleUserInput = (item) => {
    setUserSequence((prev) => [...prev, item]);
  };

  const handleSubmit = () => {
    // Calculate the score based on user input directly in the frontend
    const score = calculateScore(sequence, userSequence);
    setScore(score);
  };

  const calculateScore = (original, user) => {
    // Calculate the number of correct items in sequence
    return user.reduce((acc, item, index) => {
      return item.id === original[index].id ? acc + 1 : acc;
    }, 0);
  };

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  return (
    <div>
      <h1>Memory Test</h1>
      <div>
        <button onClick={() => setTestType('icons')}>Test with Icons</button>
        <button onClick={() => setTestType('words')}>Test with Words</button>
        <button onClick={() => setTestType('audio')}>Test with Audio</button>
      </div>

      {isRevealing ? (
        <div>
          <h2>Memorize this sequence:</h2>
          <div className="sequence" style={{ display: 'flex', gap: '10px' }}>
            {sequence.map((item, index) => (
              <div key={index} style={{ fontSize: '30px' }}>
                {testType === 'icons' && item.icon}
                {testType === 'words' && <span>{item.word}</span>}
                {testType === 'audio' && (
                  <button onClick={() => playSound(item.sound)}>Play</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2>Enter the sequence:</h2>
          <div className="options" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {(testType === 'icons' ? icons : testType === 'words' ? words : audio).map((item, index) => (
              <button
                key={index}
                onClick={() => handleUserInput(item)}
                style={{ fontSize: '30px', padding: '10px', cursor: 'pointer' }}
              >
                {testType === 'icons' && item.icon}
                {testType === 'words' && item.word}
                {testType === 'audio' && 'Play Sound'}
              </button>
            ))}
          </div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
      
      {score !== null && <h2>Your Score: {score}/{sequence.length}</h2>}
    </div>
  );
};

export default MemoryTest;
