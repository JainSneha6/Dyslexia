import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaBook, FaHeadphones, FaPencilAlt } from 'react-icons/fa'; // Icons for the cards

const readingAssistanceOptions = [
  {
    title: 'Reading Aloud Support',
    description: 'Utilize audio resources that read text aloud to help improve comprehension and fluency.',
    link: '/reading-assistance',
    icon: <FaHeadphones className="text-blue-700 text-5xl" />,
  }
];

const MildLearningPathPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [completedAssistance, setCompletedAssistance] = useState({});

  useEffect(() => {
    setIsVisible(true);

    // Check for completed assistance options
    const completionStatus = {};
    readingAssistanceOptions.forEach(option => {
      if (option.localStorageKey) {
        const isCompleted = localStorage.getItem(option.localStorageKey) === 'true';
        if (isCompleted) {
          completionStatus[option.title] = true;
        }
      }
    });
    setCompletedAssistance(completionStatus);
  }, []);

  return (
    <section className="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 min-h-screen p-8">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Mild Learning Path: Reading Assistance</h2>
      <div className="grid grid-cols-1 gap-6">
        {readingAssistanceOptions.map((option, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-lg shadow-md transform transition-all duration-700 ease-out
              ${isVisible ? `animate-crazyCardAnimation delay-${index * 200}` : 'opacity-0'}`}
          >
            <div className="flex items-center mb-4">
              {option.icon}
              <h3 className="text-xl font-bold text-blue-700 ml-4">
                {option.link ? (
                  <Link to={option.link} className="hover:underline">
                    {option.title}
                  </Link>
                ) : (
                  option.title
                )}
              </h3>
            </div>
            <p className="text-gray-600">{option.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MildLearningPathPage;
