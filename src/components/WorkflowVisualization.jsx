import React from 'react';

const WorkflowVisualization = ({ currentStep, isGenerating, isPublishing }) => {
  const steps = [
    { 
      id: 'topic', 
      name: 'Topic', 
      icon: '💡', 
      description: 'Enter your idea',
      completed: currentStep >= 1 
    },
    { 
      id: 'generation', 
      name: 'AI Generation', 
      icon: '🤖', 
      description: 'AI creates content',
      completed: currentStep >= 2 
    },
    { 
      id: 'preview', 
      name: 'Preview', 
      icon: '👁️', 
      description: 'Review & edit',
      completed: currentStep >= 3 
    },
    { 
      id: 'publish', 
      name: 'Publish', 
      icon: '🚀', 
      description: 'Send to platforms',
      completed: currentStep >= 4 
    },
    { 
      id: 'platforms', 
      name: 'Platforms', 
      icon: '📱', 
      description: 'Content delivered',
      completed: currentStep >= 5 
    }
  ];

  const getStepClass = (step, index) => {
    const baseClass = "relative flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 transition-all duration-500";
    
    if (step.completed) {
      return `${baseClass} bg-gradient-to-br from-green-400/20 to-emerald-500/20 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)] backdrop-blur-sm`;
    }
    
    if ((index === 1 && isGenerating) || (index === 3 && isPublishing)) {
      return `${baseClass} bg-gradient-to-br from-purple-400/20 to-pink-500/20 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-pulse backdrop-blur-sm`;
    }
    
    if (currentStep === index + 1) {
      return `${baseClass} bg-gradient-to-br from-blue-400/20 to-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] backdrop-blur-sm`;
    }
    
    return `${baseClass} bg-gray-800/50 border-gray-600 backdrop-blur-sm`;
  };

  const getConnectorClass = (index) => {
    const baseClass = "flex-1 h-0.5 mx-2 transition-all duration-1000";
    
    if (currentStep > index + 1) {
      return `${baseClass} bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]`;
    }
    
    if (currentStep === index + 2 || (index === 0 && isGenerating) || (index === 2 && isPublishing)) {
      return `${baseClass} bg-gradient-to-r from-purple-400 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse`;
    }
    
    return `${baseClass} bg-gray-600/50`;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 mb-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
          AI Automation Workflow
        </h3>
        <p className="text-gray-400 text-sm">Real-time process visualization</p>
      </div>
      
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={getStepClass(step, index)}>
                <span className="text-2xl mb-1">{step.icon}</span>
                {((index === 1 && isGenerating) || (index === 3 && isPublishing)) && (
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping"></div>
                )}
              </div>
              <div className="mt-3 text-center">
                <div className={`text-sm font-medium transition-colors duration-300 ${
                  step.completed ? 'text-green-400' : 
                  currentStep === index + 1 ? 'text-cyan-400' : 'text-gray-500'
                }`}>
                  {step.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {step.description}
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={getConnectorClass(index)}>
                <div className="relative h-full">
                  {((index === 0 && isGenerating) || (index === 2 && isPublishing)) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse rounded-full"></div>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkflowVisualization;