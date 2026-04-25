import React from 'react';

const LoadingSpinner = ({ text = "Processing", className = "" }) => {
  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      <div className="relative">
        <div className="w-8 h-8 border-2 border-purple-500/30 rounded-full"></div>
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin absolute top-1 left-1 animation-delay-150"></div>
      </div>
      <div className="flex space-x-1">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="text-cyan-400 animate-pulse font-medium"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;