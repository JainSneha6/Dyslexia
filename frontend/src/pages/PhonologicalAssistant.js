import React, { useState } from 'react';

// Expanded sample data for activities
const soundIdentificationWords = [
  { word: 'Cat', sound: 'c' },
  { word: 'Dog', sound: 'd' },
  { word: 'Fish', sound: 'f' },
  { word: 'Sun', sound: 's' },
  { word: 'Tree', sound: 't' },
  { word: 'Mouse', sound: 'm' },
];

const segmentationWords = ['Sun', 'Ball', 'Star', 'Cup', 'Fish', 'Drum', 'Flag', 'Bird'];

const rhymingPairs = [
  { word1: 'Hat', word2: 'Cat', doesRhyme: true },
  { word1: 'Dog', word2: 'Log', doesRhyme: true },
  { word1: 'Sun', word2: 'Run', doesRhyme: true },
  { word1: 'Fish', word2: 'Dish', doesRhyme: true },
  { word1: 'Star', word2: 'Car', doesRhyme: true },
  { word1: 'Tree', word2: 'Bee', doesRhyme: true },
  { word1: 'Bird', word2: 'Word', doesRhyme: true },
  { word1: 'Cup', word2: 'Hat', doesRhyme: false },
];

// Text-to-Speech function
const speak = (text) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
};

// Function to play sound feedback
const playSound = (isCorrect) => {
  const audio = new Audio(isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3');
  audio.play();
};

const PhonologicalAwarenessAssistant = () => {
  const [activity, setActivity] = useState('soundIdentification');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  // Total questions for progress calculation
  const totalQuestions = activity === 'soundIdentification' ? soundIdentificationWords.length : segmentationWords.length;
  const progressPercentage = ((currentWordIndex / totalQuestions) * 100).toFixed(0);

  const handleSoundIdentification = (selectedSound) => {
    const currentWord = soundIdentificationWords[currentWordIndex];
    setSelectedOption(selectedSound);
    if (selectedSound === currentWord.sound) {
      setScore((prevScore) => prevScore + 1);
      setFeedback('Correct! Great job!');
      playSound(true);
    } else {
      setFeedback('Try again!');
      playSound(false);
    }
    setTimeout(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % soundIdentificationWords.length);
      setSelectedOption(null);
    }, 1000);
  };

  const handleSegmentation = (selectedCount) => {
    const currentWord = segmentationWords[currentWordIndex];
    setSelectedOption(selectedCount);
    if (selectedCount === currentWord.length) {
      setScore((prevScore) => prevScore + 1);
      setFeedback('Good job!');
      playSound(true);
    } else {
      setFeedback('Try again!');
      playSound(false);
    }
    setTimeout(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % segmentationWords.length);
      setSelectedOption(null);
    }, 1000);
  };

  const handleRhymingMatch = (doesRhyme) => {
    const currentPair = rhymingPairs[currentWordIndex];
    setSelectedOption(doesRhyme);
    if (doesRhyme === currentPair.doesRhyme) {
      setScore((prevScore) => prevScore + 1);
      setFeedback('Correct! They rhyme!');
      playSound(true);
    } else {
      setFeedback('Nope, try again!');
      playSound(false);
    }
    setTimeout(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rhymingPairs.length);
      setSelectedOption(null);
    }, 1000);
  };

  const resetGame = () => {
    setScore(0);
    setCurrentWordIndex(0);
    setFeedback('');
    setSelectedOption(null);
  };

  const changeActivity = (newActivity) => {
    setActivity(newActivity);
    resetGame(); // Reset the game when changing activities
  };

  return (
    <section className="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 min-h-screen p-8" style={{ fontFamily: 'OpenDyslexic', lineHeight: '1.5' }}>
      <h2 className="text-3xl font-semibold text-purple-700 mb-6">Phonological Awareness Assistant</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => changeActivity('soundIdentification')}
          className={`px-4 py-2 mx-2 rounded-full ${activity === 'soundIdentification' ? 'bg-purple-500 text-white' : 'bg-white'}`}
        >
          Sound Identification
        </button>
        <button
          onClick={() => changeActivity('segmentation')}
          className={`px-4 py-2 mx-2 rounded-full ${activity === 'segmentation' ? 'bg-purple-500 text-white' : 'bg-white'}`}
        >
          Word Segmentation
        </button>
        <button
          onClick={() => changeActivity('rhyming')}
          className={`px-4 py-2 mx-2 rounded-full ${activity === 'rhyming' ? 'bg-purple-500 text-white' : 'bg-white'}`}
        >
          Rhyme Matching
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        {activity === 'soundIdentification' && (
          <div>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
              onClick={() => speak(soundIdentificationWords[currentWordIndex].word)}
            >
              Hear Word
            </button>
            <h3 className="text-xl mb-4">
              Which sound does the word "{soundIdentificationWords[currentWordIndex].word}" start with?
            </h3>
            <div className="flex justify-center space-x-4">
              {['a', 'b', 'c', 'd', 'f', 's', 't', 'm'].map((sound) => (
                <button
                  key={sound}
                  onClick={() => handleSoundIdentification(sound)}
                  className={`px-4 py-2 rounded-full ${selectedOption === sound ? 'bg-yellow-300' : 'bg-gray-200'}`}
                >
                  {sound}
                </button>
              ))}
            </div>
          </div>
        )}

        {activity === 'segmentation' && (
          <div>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
              onClick={() => speak(segmentationWords[currentWordIndex])}
            >
              Hear Word
            </button>
            <h3 className="text-xl mb-4">How many sounds are in the word "{segmentationWords[currentWordIndex]}"?</h3>
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => handleSegmentation(count)}
                  className={`px-4 py-2 rounded-full ${selectedOption === count ? 'bg-yellow-300' : 'bg-gray-200'}`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        )}

        {activity === 'rhyming' && (
          <div>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
              onClick={() => {
                speak(rhymingPairs[currentWordIndex].word1);
                speak(rhymingPairs[currentWordIndex].word2);
              }}
            >
              Hear Words
            </button>
            <h3 className="text-xl mb-4">
              Do "{rhymingPairs[currentWordIndex].word1}" and "{rhymingPairs[currentWordIndex].word2}" rhyme?
            </h3>
            <button
              onClick={() => handleRhymingMatch(true)}
              className={`px-4 py-2 rounded-full mr-2 ${selectedOption === true ? 'bg-yellow-300' : 'bg-green-500'}`}
            >
              Yes
            </button>
            <button
              onClick={() => handleRhymingMatch(false)}
              className={`px-4 py-2 rounded-full ${selectedOption === false ? 'bg-yellow-300' : 'bg-red-500'}`}
            >
              No
            </button>
          </div>
        )}
      </div>

      {feedback && <p className="text-lg mt-4 text-blue-700">{feedback}</p>}
      <p className="mt-2 text-gray-600">Score: {score}</p>
      <div className="mt-4 mb-6">
        <div className="h-4 bg-gray-300 rounded-full">
          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{`Progress: ${progressPercentage}%`}</p>
      </div>
      <button onClick={resetGame} className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-full">
        Reset Game
      </button>
    </section>
  );
};

export default PhonologicalAwarenessAssistant;
