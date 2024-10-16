import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Dyslexia Screening Test',
    description: 'A comprehensive test to screen for dyslexia and provide insights on necessary interventions.',
    link: '/dyslexia-screening-tests',
  },
  {
    title: 'Customized Learning Plans',
    description: 'Personalized learning plans that cater to individual strengths and needs.',
    link:'/customized-learning-path'
  },
  {
    title: 'Reading Assistance',
    description: 'Tools to improve reading comprehension and speed, tailored for individuals with dyslexia.',
    link: '/reading-assistance'
  },
  {
    title: 'Writing Support',
    description: 'Specialized exercises and software designed to enhance writing skills for those with dyslexia.',
    link: '/writing-assistant '
  },
  {
    title: 'Document Conversion & Learning Aids',
    description: 'Tools for converting documents, generating structured notes, and creating mind maps to enhance learning.',
    link: '/document-support '
  },
  {
    title: 'Consultation',
    description: 'Connect with experts for guidance and support tailored to dyslexia management.',
  },
];


const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-lg shadow-md transform transition-all duration-700 ease-out 
                ${isVisible ? `animate-crazyCardAnimation delay-${index * 200}` : 'opacity-0'}`}
          >
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              {service.link ? (
                <Link to={service.link} className="hover:underline">{service.title}</Link>
              ) : (
                service.title
              )}
            </h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection