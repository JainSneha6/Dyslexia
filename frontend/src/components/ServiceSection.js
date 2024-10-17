import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import services from '../utils/services';

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-lg shadow-md transform transition-all duration-700 ease-out
                ${isVisible ? `animate-crazyCardAnimation delay-${index * 200}` : 'opacity-0'} w-full`}
          >
            <div className="flex items-start">
              {service.icon}
              <h3 className="text-xl font-bold text-blue-700 mb-2 ml-2 text-center w-full">
                {service.link ? (
                  <Link to={service.link} className="hover:underline">{service.title}</Link>
                ) : (
                  service.title
                )}
              </h3>
            </div>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;