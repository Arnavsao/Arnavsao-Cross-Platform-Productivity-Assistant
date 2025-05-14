import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);

    // Querying elements dynamically can be heavy. Consider a more targeted approach if performance issues arise.
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input[type="button"], input[type="submit"], select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const handleMouseEnter = () => setIsHoveringInteractive(true);
    const handleMouseLeave = () => setIsHoveringInteractive(false);

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  const cursorVariants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      width: 16,
      height: 16,
      backgroundColor: 'rgba(14, 165, 233, 0.7)',
      borderColor: 'rgba(56, 189, 248, 0.9)',
      borderWidth: '2px',
      opacity: 1,
      transition: { type: 'spring', stiffness: 600, damping: 30, mass: 0.5 }
    },
    interactive: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      width: 24,
      height: 24,
      backgroundColor: 'rgba(14, 165, 233, 0.3)',
      borderColor: 'rgba(56, 189, 248, 1)',
      borderWidth: '3px',
      opacity: 1,
      scale: 1.2,
      transition: { type: 'spring', stiffness: 400, damping: 20 }
    }
  };

  // Hide default system cursor globally if this component is active
  // This should be done carefully, perhaps in a higher-level component or App.jsx
  // For now, it's implied this component replaces it on non-touch devices.

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block shadow-md"
      variants={cursorVariants}
      animate={isHoveringInteractive ? 'interactive' : 'default'}
      initial={{ opacity: 0 }}
    />
  );
};

export default CustomCursor; 