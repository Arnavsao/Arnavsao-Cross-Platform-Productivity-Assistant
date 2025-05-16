import React from 'react';
import Hero from '../components/Hero';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const HomePage = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut", delay: 0.5 } 
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center">
      <Hero />
      <motion.div 
        className="my-10 p-6 max-w-2xl mx-auto"
        variants={sectionVariants}
        initial="hidden"
        animate="visible" // Animate when it enters viewport, or just on load like this
      >
      </motion.div>
    </div>
  );
};

export default HomePage; 