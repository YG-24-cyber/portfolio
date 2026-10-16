import React, { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const scrollPercent = (totalScroll / windowHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed h-0.5 bg-gradient-to-r from-blue-500 via-indigo-400 to-teal-400 z-50 top-0 left-0 transition-[width] duration-75 ease-out pointer-events-none"
      style={{ width: `${scrollProgress}%` }}
    />
  );
}
