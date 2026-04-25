import React from 'react';

const AIAssistant = ({ isThinking, isGenerating, isPublishing, lastAction, isModalOpen }) => {
  const getAssistantState = () => {
    if (isGenerating) {
      return {
        mood: '🤖',
        status: 'Generating content...',
        color: 'from-purple-400 to-pink-500',
        glow: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
        animation: 'animate-pulse'
      };
    }
    
    if (isPublishing) {
      return {
        mood: '🚀',
        status: 'Publishing to platforms...',
        color: 'from-cyan-400 to-blue-500',
        glow: 'shadow-[0_0_30px_rgba(6,182,212,0.5)]',
        animation: 'animate-bounce'
      };
    }
    
    if (lastAction === 'success') {
      return {
        mood: '✨',
        status: 'Mission accomplished!',
        color: 'from-green-400 to-emerald-500',
        glow: 'shadow-[0_0_30px_rgba(34,197,94,0.5)]',
        animation: 'animate-pulse'
      };
    }
    
    if (lastAction === 'error') {
      return {
        mood: '😓',
        status: 'Oops, need to retry...',
        color: 'from-red-400 to-pink-500',
        glow: 'shadow-[0_0_30px_rgba(239,68,68,0.5)]',
        animation: 'animate-pulse'
      };
    }
    
    return {
      mood: '🎯',
      status: 'Ready for automation',
      color: 'from-cyan-400 to-purple-400',
      glow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
      animation: 'hover:animate-pulse'
    };
  };

  const state = getAssistantState();

  // Hide assistant when modal is open
  if (isModalOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative group">
        {/* Main assistant avatar */}
        <div
          className={`
            w-16 h-16 rounded-full bg-linear-to-br ${state.color}
            flex items-center justify-center text-2xl
            border-2 border-white/20 backdrop-blur-sm
            ${state.glow} ${state.animation}
            transition-all duration-300 cursor-pointer
            hover:scale-110
          `}
        >
          {state.mood}
        </div>
        
        {/* Status tooltip */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900/90 backdrop-blur-md text-white text-xs px-3 py-2 rounded-lg border border-gray-700/50 whitespace-nowrap">
            {state.status}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
          </div>
        </div>
        
        {/* Activity rings */}
        {(isGenerating || isPublishing) && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping animation-delay-300"></div>
          </>
        )}
        
        {/* Success sparkles */}
        {lastAction === 'success' && (
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;