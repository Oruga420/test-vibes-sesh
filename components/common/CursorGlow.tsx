import React, { useState, useEffect } from 'react';

const CursorGlow: React.FC = () => {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible]);

  return (
    <div
      className={`pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl z-50 transition-opacity duration-300 ${isVisible ? 'opacity-50' : 'opacity-0'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, hsl(180, 100%, 70%), hsl(210, 100%, 70%), hsl(240, 100%, 70%), hsl(270, 100%, 70%), hsl(300, 100%, 70%))',
        backgroundSize: '200% 200%',
        animation: 'rainbow-spin 8s linear infinite',
      }}
    />
  );
};

export default CursorGlow;
