import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { shapes, colors, shapeColorSequences } from '../utils/KauffmanMemoryTest';

const KauffmanMemoryTest = () => {
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [userSelections, setUserSelections] = useState([]);
  const [showSequence, setShowSequence] = useState(true);
  const [testCompleted, setTestCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
    checkTestCompletion(); // Check if test was completed in local storage
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentSequenceIndex < shapeColorSequences.length && !testCompleted) {
      setCurrentSequence(shapeColorSequences[currentSequenceIndex]);
      setUserSelections([]);
      setShowSequence(true);

      const timer = setTimeout(() => {
        setShowSequence(false);
      }, 10000); // Show sequence for 10 seconds

      return () => clearTimeout(timer);
    }
  }, [currentSequenceIndex, isLoggedIn, testCompleted]);

  const checkTestCompletion = () => {
    const savedScore = localStorage.getItem('totalScore');
    const completed = localStorage.getItem('testCompleted') === 'true';

    if (completed) {
      setTestCompleted(true);
      setTotalScore(savedScore ? parseInt(savedScore, 10) : 0);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to access the test.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/check-login', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.loggedIn) {
        setIsLoggedIn(true);
        toast.success('Login verified successfully!');
      } else {
        handleNotLoggedIn();
      }
    } catch (error) {
      handleNotLoggedIn();
    }
  };

  const handleNotLoggedIn = () => {
    toast.error('Unauthorized. Please login again.');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  };

  const handleSelection = (shape, color) => {
    if (userSelections.length < currentSequence.length) {
      setUserSelections([...userSelections, { shape, color }]);
      // If 4 shapes have been selected, stop further selections
      if (userSelections.length + 1 === 4) {
        checkSequence();
      }
    }
  };

  const checkSequence = () => {
    const isCorrectSequence = userSelections.every(
      (selection, index) =>
        selection.shape === currentSequence[index].shape &&
        selection.color === currentSequence[index].color
    );

    if (isCorrectSequence) {
      setTotalScore((prevTotalScore) => prevTotalScore + 1); // Update total score
      toast.success('Correct sequence!');
    } else {
      toast.error('Incorrect sequence!');
    }

    if (currentSequenceIndex === shapeColorSequences.length - 1) {
      saveScore();
    } else {
      setCurrentSequenceIndex((prevIndex) => prevIndex + 1);
    }
  };

  const saveScore = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/test-score', { score: totalScore }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success(response.data.message);
      setTestCompleted(true);
      localStorage.setItem('totalScore', totalScore);
      localStorage.setItem('testCompleted', 'true');
      localStorage.setItem('kauffmanTestCompleted', 'true'); 
    } catch (error) {
      console.error('Error saving score:', error.response.data); 
      toast.error('Error saving score!');
    }
  };
  

  return (
    <div className="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 min-h-screen p-8" style={{ fontFamily: 'OpenDyslexic', lineHeight: '1.5' }}>
      <ToastContainer />
      <h2 className="text-4xl font-bold text-blue-800 mb-8 text-center">Kauffman Memory Test</h2>

      {isLoggedIn ? (
        <>
          {testCompleted ? (
            <div className="flex justify-center items-center h-full">
              <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full transform transition-transform hover:scale-105 duration-300">
                <h3 className="text-3xl font-semibold text-center text-purple-600 mb-4">Test Results</h3>
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-bold text-green-600 mb-4">{totalScore}</div>
                  <p className="text-lg text-gray-700">Total Score out of {shapeColorSequences.length}</p>
                  <p className="text-md text-gray-500 mt-4">Great job completing the test!</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {showSequence ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex space-x-4">
                    {currentSequence.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: item.color,
                          width: '100px',
                          height: '100px',
                          borderRadius: item.shape === 'circle' ? '50%' : '0',
                          clipPath:
                            item.shape === 'triangle'
                              ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                              : 'none',
                        }}
                        className="transition-transform duration-300 transform hover:scale-110"
                      ></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-lg text-gray-700 mb-4">Select the shapes and colors in the order you saw them:</p>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {shapes.map((shape) =>
                      colors.map((color) => (
                        <button
                          key={`${shape}-${color}`}
                          className={`w-24 h-24 ${shape === 'circle' ? 'rounded-full' : ''} border m-2 transition-transform transform hover:scale-105`}
                          style={{
                            backgroundColor: color,
                            clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
                          }}
                          onClick={() => handleSelection(shape, color)}
                        >
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <p className="text-red-500 text-center">Please login to access this test.</p>
      )}
    </div>
  );
};

export default KauffmanMemoryTest;
