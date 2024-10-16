import React, { useState, useEffect } from 'react';
import { FaAppleAlt, FaBicycle, FaBus, FaCar, FaCarrot, FaPepperHot, FaShip, FaTrain } from 'react-icons/fa';
import { GiCherry, GiGrapes, GiWatermelon, GiStrawberry, GiPineapple, GiLion, GiTiger, GiElephant, GiAirplane } from 'react-icons/gi';
import { GiPotato, GiTomato, GiPeas, GiBellPepper } from 'react-icons/gi';
import { FaCat, FaDog, FaHorse } from 'react-icons/fa';

const stages = {
  fruits: [
    { icon: <FaAppleAlt />, name: 'Apple' },
    { icon: <GiCherry />, name: 'Cherry' },
    { icon: <GiGrapes />, name: 'Grapes' },
    { icon: <GiWatermelon />, name: 'Watermelon' },
    { icon: <GiStrawberry />, name: 'Strawberry' },
    { icon: <GiPineapple />, name: 'Pineapple' }
  ],
  animals: [
    { icon: <FaCat />, name: 'Cat' },
    { icon: <FaDog />, name: 'Dog' },
    { icon: <FaHorse />, name: 'Horse' },
    { icon: <GiLion />, name: 'Lion' },
    { icon: <GiTiger />, name: 'Tiger' },
    { icon: <GiElephant />, name: 'Elephant' },
  ],
  vegetables: [
    { icon: <FaCarrot />, name: 'Carrot' },
    { icon: <GiPotato />, name: 'Potato' },
    { icon: <GiTomato />, name: 'Tomato' },
    { icon: <GiPeas />, name: 'Peas' },
    { icon: <FaPepperHot />, name: 'Pepper' },
    { icon: <GiBellPepper />, name: 'BellPepper' },
  ],
  vehicles: [
    { icon: <FaCar />, name: 'Car' },
    { icon: <FaBus />, name: 'Bus' },
    { icon: <FaTrain />, name: 'Train' },
    { icon: <FaBicycle />, name: 'Bicycle' },
    { icon: <GiAirplane />, name: 'Airplane' },
    { icon: <FaShip />, name: 'Ship' },
  ]
};

const generateCards = (selectedStage) => {
  const cardData = [...stages[selectedStage], ...stages[selectedStage]]; // Duplicate icons for pairs
  return cardData.sort(() => Math.random() - 0.5); // Shuffle the cards
};

const MemoryGame = () => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    if (selectedStage) {
      setCards(generateCards(selectedStage));
    }
  }, [selectedStage]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].name === cards[secondIndex].name) {
        setMatchedIndices((prev) => [...prev, firstIndex, secondIndex]);
      }
      setTimeout(() => setFlippedIndices([]), 1000);
      setMoves((prev) => prev + 1);
    }
  }, [flippedIndices, cards]);

  useEffect(() => {
    if (matchedIndices.length === cards.length && cards.length > 0) {
      setTimeout(() => setGameCompleted(true), 500); // Slight delay before showing the message
    }
  }, [matchedIndices, cards]);

  const handleCardClick = (index) => {
    if (!flippedIndices.includes(index) && !matchedIndices.includes(index)) {
      setFlippedIndices((prev) => [...prev, index]);
    }
  };

  const handleStageSelect = (stage) => {
    setSelectedStage(stage);
    setFlippedIndices([]);
    setMatchedIndices([]);
    setMoves(0);
    setGameCompleted(false);
  };

  return (
    <section className="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Memory Game</h1>
      {selectedStage === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {Object.keys(stages).map((stage, index) => (
            <div
              key={stage}
              className={`bg-white p-6 rounded-2xl shadow-xl cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl animate-crazyCardAnimation delay-${index * 100}`}
              onClick={() => handleStageSelect(stage)}
            >
              <h2 className="text-2xl font-bold text-center text-blue-700">
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </h2>
              <div className="flex justify-center mt-6">
                {stages[stage].map(({ icon }, iconIndex) => (
                  <span key={iconIndex} className="text-4xl mx-2 text-gray-700">
                    {icon}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : gameCompleted ? (
        <div className="flex flex-col items-center animate-fadeIn">
          <h2 className="text-4xl font-extrabold text-green-600 mb-4 animate-bounce">
            Congratulations!
          </h2>
          <p className="text-lg text-gray-700 mb-2">You completed the game in {moves} moves!</p>
          <button
            onClick={() => setSelectedStage(null)}
            className="bg-red-400 text-white px-4 py-2 rounded-full mt-4"
          >
            Back to Stages
          </button>
        </div>
      ) : (
        <div className={`flex flex-col items-center transition-opacity duration-500 ${gameCompleted ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-lg mb-4 text-gray-700">Moves: {moves}</p>

          <div className="grid grid-cols-3 gap-4">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`w-24 h-24 flex justify-center items-center border border-gray-300 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 cursor-pointer
                  ${flippedIndices.includes(index) || matchedIndices.includes(index) ? 'bg-white' : 'bg-gray-200'}
                `}
                onClick={() => handleCardClick(index)}
              >
                {(flippedIndices.includes(index) || matchedIndices.includes(index)) && (
                  <span className="text-5xl text-blue-700">{card.icon}</span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setSelectedStage(null)}
            className="mt-6 bg-red-400 text-white px-4 py-2 rounded-full"
          >
            Back to Stages
          </button>
        </div>
      )}
    </section>
  );
};

export default MemoryGame;
