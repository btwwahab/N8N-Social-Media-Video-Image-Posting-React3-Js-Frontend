import React from 'react';

const PlatformSelector = ({ platforms, onPlatformChange }) => {
  const platformOptions = [
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      color: 'from-blue-500 to-blue-600', 
      icon: '💼',
      gradient: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-400/50',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      color: 'from-blue-400 to-blue-500', 
      icon: '👥',
      gradient: 'from-blue-400/20 to-blue-500/20',
      border: 'border-blue-300/50',
      glow: 'shadow-[0_0_20px_rgba(96,165,250,0.3)]'
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      color: 'from-purple-500 to-pink-500', 
      icon: '📸',
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-400/50',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]'
    }
  ];

  return (
    <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 group hover:border-purple-400/50 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(168,85,247,0.2)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Target Platforms
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
          <span className="text-xs text-purple-400 font-medium">
            {platforms.length} SELECTED
          </span>
        </div>
      </div>
      
      <div className="space-y-4 flex-1">
        {platformOptions.map((platform) => {
          const isSelected = platforms.includes(platform.id);
          
          return (
            <div
              key={platform.id}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                isSelected 
                  ? `bg-linear-to-r ${platform.gradient} ${platform.border} ${platform.glow}` 
                  : 'bg-gray-800/30 border-gray-600/50 hover:border-gray-500/70'
              } hover:scale-[1.02] group/platform`}
              onClick={() => onPlatformChange(platform.id)}
            >
              {/* Animated border for selected platforms */}
              {isSelected && (
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              )}
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`text-3xl transition-transform duration-300 ${
                    isSelected ? 'scale-110' : 'group-hover/platform:scale-105'
                  }`}>
                    {platform.icon}
                  </div>
                  
                  <div>
                    <div className={`font-semibold transition-colors duration-300 ${
                      isSelected ? 'text-white' : 'text-gray-300'
                    }`}>
                      {platform.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {isSelected ? 'Ready for publishing' : 'Click to select'}
                    </div>
                  </div>
                </div>
                
                {/* Custom toggle switch */}
                <div className="relative">
                  <div className={`toggle-switch ${isSelected ? `active ${platform.id}` : ''}`}>
                    <div className="toggle-switch-handle">
                      <div className="toggle-switch-glow"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Connection indicator */}
              {isSelected && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
        <div className="text-xs text-gray-400 flex items-center">
          <span className="text-cyan-400 mr-2">⚡</span>
          Posts will be published simultaneously across all selected platforms
        </div>
      </div>
    </div>
  );
};

export default PlatformSelector;