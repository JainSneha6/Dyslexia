import { FaClipboardCheck, FaUserEdit, FaRobot, FaPencilAlt, FaFileAlt, FaHeadset } from 'react-icons/fa';

const services = [
    {
      title: 'Dyslexia Screening Test',
      description: 'Comprehensive test for dyslexia screening and intervention insights.',
      link: '/dyslexia-screening-tests',
      icon: <FaClipboardCheck className="text-blue-500 text-3xl mb-2" />,
    },
    {
      title: 'Customized Learning Plans',
      description: 'Personalized learning plans for individual strengths and needs.',
      link: '/customized-learning-path',
      icon: <FaUserEdit className="text-green-500 text-3xl mb-2" />,
    },
    {
      title: 'Chatbot',
      description: 'AI-based chatbot for real-time assistance and guidance.',
      link: '/chatbot',
      icon: <FaRobot className="text-yellow-500 text-3xl mb-2" />,
    },
    {
      title: 'Writing Support',
      description: 'Exercises and software to enhance writing skills.',
      link: '/writing-assistant',
      icon: <FaPencilAlt className="text-purple-500 text-3xl mb-2" />,
    },
    {
      title: 'Document Conversion & Learning Aids',
      description: 'Tools for converting documents and generating notes.',
      link: '/document-support',
      icon: <FaFileAlt className="text-red-500 text-3xl mb-2" />,
    },
    {
      title: 'Consultation',
      description: 'Expert guidance for dyslexia management.',
      icon: <FaHeadset className="text-teal-500 text-3xl mb-2" />,
    },
];

export default services;
