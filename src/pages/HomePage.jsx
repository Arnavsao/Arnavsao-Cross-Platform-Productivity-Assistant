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
      // Delay this section slightly more if Hero has staggerChildren
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center">
      <Hero />
      {/* 
        The main interactive area for choosing focus (mode/mood) has been removed.
        This functionality will be part of the /chat route.
        The Hero component's "Get Started" button will handle navigation 
        to login or chat based on authentication status.
      */}
      <motion.div 
        className="my-10 p-6 max-w-2xl mx-auto"
        variants={sectionVariants}
        initial="hidden"
        animate="visible" // Animate when it enters viewport, or just on load like this
        // For viewport-triggered animation: initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
      >
      </motion.div>
    </div>
  );
};

export default HomePage; 