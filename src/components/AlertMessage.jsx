import React from 'react';

const AlertMessage = ({ type, message, onClose }) => {
  if (!message) return null;

  const baseClasses = "p-4 rounded-lg border mb-4";
  const typeClasses = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };

  const icons = {
    success: "✅",
    error: "❌", 
    info: "ℹ️"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl mr-2">{icons[type]}</span>
          <span>{message}</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertMessage;