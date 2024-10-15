import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full py-6 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 text-center shadow-md rounded-b-lg">
      <h1 className="text-4xl font-bold text-blue-800">LexiEase AI</h1>
      <p className="text-lg text-blue-600 mt-2">
        Empowering individuals with dyslexia through technology.
      </p>
      <div className="mt-4">
        <Link to="/login">
          <button className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign Up
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
