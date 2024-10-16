import React, { useState } from 'react';

// Sample data for activities
const soundIdentificationWords = [
  { word: 'Cat', sound: 'c' },
  { word: 'Dog', sound: 'd' },
  { word: 'Fish', sound: 'f' },
];

const segmentationWords = ['Sun', 'Ball', 'Star'];

const rhymingPairs = [
  { word1: 'Hat', word2: 'Cat', doesRhyme: true },
  { word1: 'Dog', word2: 'Log', doesRhyme: true },
  { word1: 'Sun', word2: 'Run', doesRhyme: true },
  { word1: 'Fish', word2: 'Dish', doesRhyme: true },
];

const PhonologicalAwarenessAssistant = () => {
  const [activity, setActivity] = useState('soundIdentification');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [userInput, setUserInput] = useState('');
  const totalQuestions = activity === 'soundIdentification' ? soundIdentificationWords.length : segmentationWords.length;

  // Progress percentage
  const progressPercentage = ((currentWordIndex / totalQuestions) * 100).toFixed(0);

  const handleSoundIdentification = (e) => {
    e.preventDefault();
    const currentWord = soundIdentificationWords[currentWordIndex];
    if (userInput.toLowerCase() === currentWord.sound) {
      setScore((prevScore) => prevScore + 1);
      setFeedback('Correct! Great job!');
    } else {
      setFeedback('Try again!');
    }
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % soundIdentificationWords.length);
    setUserInput('');
  };

  const handleSegmentation = (e) => {
    e.preventDefault();
    const currentWord = segmentationWords[currentWordIndex];
    if (userInput === currentWord.length.toString()) {
      setScore((prevScore) => prevScore + 1);
      setFeedback('Good job!');
    } else {
      setFeedback('Try again!');
    }
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % segmentationWords.length);
    setUserInput('');
  };

  const handleRhymingMatch = (doesRhyme) => {
    const currentPair = rhymingPairs[currentWordIndex];
    if (doesRhyme === currentPair.doesRhyme) {
      setScore((prevScore) => prevScore + 1);
      setFeedback('Correct! They rhyme!');
    } else {
      setFeedback('Nope, try again!');
    }
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rhymingPairs.length);
  };

  const resetGame = () => {
    setScore(0);
    setCurrentWordIndex(0);
    setFeedback('');
    setUserInput('');
  };

  return (
    <section className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 min-h-screen p-8">
      <h2 className="text-3xl font-semibold text-purple-700 mb-6">Phonological Awareness Assistant</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActivity('soundIdentification')}
          className={`px-4 py-2 mx-2 rounded-full ${activity === 'soundIdentification' ? 'bg-purple-500 text-white' : 'bg-white'}`}
        >
          Sound Identification
        </button>
        <button
          onClick={() => setActivity('segmentation')}
          className={`px-4 py-2 mx-2 rounded-full ${activity === 'segmentation' ? 'bg-purple-500 text-white' : 'bg-white'}`}
        >
          Word Segmentation
        </button>
        <button
          onClick={() => setActivity('rhyming')}
          className={`px-4 py-2 mx-2 rounded-full ${activity === 'rhyming' ? 'bg-purple-500 text-white' : 'bg-white'}`}
        >
          Rhyme Matching
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        {activity === 'soundIdentification' && (
          <form onSubmit={handleSoundIdentification}>
            <h3 className="text-xl mb-4">Which sound does the word "{soundIdentificationWords[currentWordIndex].word}" start with?</h3>
            <p className="mb-4">Tip: Say the word aloud to hear the starting sound.</p>
            <input
              type="text"
              placeholder="Enter the sound"
              className="p-2 border rounded-lg"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full">Submit</button>
          </form>
        )}

        {activity === 'segmentation' && (
          <form onSubmit={handleSegmentation}>
            <h3 className="text-xl mb-4">How many sounds are in the word "{segmentationWords[currentWordIndex]}"?</h3>
            <p className="mb-4">Tip: Clap out the sounds as you say the word.</p>
            <input
              type="number"
              placeholder="Enter number of sounds"
              className="p-2 border rounded-lg"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full">Submit</button>
          </form>
        )}

        {activity === 'rhyming' && (
          <div>
            <h3 className="text-xl mb-4">Do "{rhymingPairs[currentWordIndex].word1}" and "{rhymingPairs[currentWordIndex].word2}" rhyme?</h3>
            <button
              onClick={() => handleRhymingMatch(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-full mr-2"
            >
              Yes
            </button>
            <button
              onClick={() => handleRhymingMatch(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-full"
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
          <div
            className="h-full bg-purple-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{`Progress: ${progressPercentage}%`}</p>
      </div>
      <button
        onClick={resetGame}
        className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-full"
      >
        Reset Game
      </button>
    </section>
  );
};

export default PhonologicalAwarenessAssistant;
