import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 py-8 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Zenith Mode. Elevate Your Productivity. All rights reserved.
        </p>
        <div className="mt-4">
          <a href="#" className="text-slate-500 hover:text-sky-400 px-2 transition-colors">
            Privacy Policy
          </a>
          <span className="text-slate-600">|</span>
          <a href="#" className="text-slate-500 hover:text-sky-400 px-2 transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 