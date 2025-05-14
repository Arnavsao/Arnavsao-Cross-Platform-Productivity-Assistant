import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { selectIsAuthenticated } from '../redux/authSlice';

// You might want to use an actual search icon from a library like react-icons later
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const FullSearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const Hero = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleSearchClick = () => {
    if (isAuthenticated) {
      navigate('/chat'); 
    } else {
      navigate('/login'); // Or directly to /chat and let ChatPage handle auth check
                         // For now, this maintains previous logic: login first if not auth.
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.section 
      className="relative pt-36 pb-20 md:pt-48 md:pb-24 flex flex-col items-center justify-center text-center min-h-[70vh] md:min-h-[60vh] overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto z-10">
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 tracking-tight">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 pb-2">
            Zenith Mode
          </span>
          <span className="block text-slate-300 text-2xl sm:text-3xl md:text-4xl mt-3 font-normal tracking-normal">
            Focus, Flow, Achieve.
          </span>
        </motion.h1>
        <motion.p variants={itemVariants} className="text-lg sm:text-xl text-slate-400 max-w-xl md:max-w-2xl mx-auto mb-10">
          Your intelligent assistant for peak productivity and mindful balance. Describe your task, set your mood, and let Zenith guide your session.
        </motion.p>
        
        <motion.div variants={itemVariants} className="w-full">
          <div 
            onClick={handleSearchClick}
            onFocus={handleSearchClick} 
            tabIndex={0} 
            role="button" 
            aria-label="Start a new session or go to chat"
            className="group relative w-full max-w-xl mx-auto bg-slate-800/70 hover:bg-slate-700/90 backdrop-blur-sm border border-slate-700 hover:border-sky-500 rounded-full shadow-xl transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-slate-400 group-hover:text-sky-300 transition-colors duration-300 text-lg">
                Start your productive session...
              </span>
              <SearchIcon />
            </div>
          </div>
        </motion.div>

      </div>
      {/* Placeholder for potential background elements if not using a JS library */}
    </motion.section>
  );
};

export default Hero; 