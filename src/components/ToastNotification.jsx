import React, { useEffect, useState } from 'react';

const ToastNotification = ({ type, message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setIsLeaving(false);
      
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose && onClose();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message || !isVisible) return null;

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgClass: 'bg-linear-to-r from-green-500/20 to-emerald-500/20',
          borderClass: 'border-green-400/50',
          glowClass: 'shadow-[0_0_25px_rgba(34,197,94,0.4)]',
          iconClass: 'text-green-400',
          icon: '✅',
          titleColor: 'text-green-400'
        };
      case 'error':
        return {
          bgClass: 'bg-linear-to-r from-red-500/20 to-pink-500/20',
          borderClass: 'border-red-400/50',
          glowClass: 'shadow-[0_0_25px_rgba(239,68,68,0.4)]',
          iconClass: 'text-red-400',
          icon: '❌',
          titleColor: 'text-red-400'
        };
      case 'info':
        return {
          bgClass: 'bg-linear-to-r from-blue-500/20 to-cyan-500/20',
          borderClass: 'border-cyan-400/50',
          glowClass: 'shadow-[0_0_25px_rgba(6,182,212,0.4)]',
          iconClass: 'text-cyan-400',
          icon: 'ℹ️',
          titleColor: 'text-cyan-400'
        };
      case 'warning':
        return {
          bgClass: 'bg-linear-to-r from-yellow-500/20 to-orange-500/20',
          borderClass: 'border-yellow-400/50',
          glowClass: 'shadow-[0_0_25px_rgba(251,191,36,0.4)]',
          iconClass: 'text-yellow-400',
          icon: '⚠️',
          titleColor: 'text-yellow-400'
        };
      default:
        return {
          bgClass: 'bg-linear-to-r from-gray-500/20 to-slate-500/20',
          borderClass: 'border-gray-400/50',
          glowClass: 'shadow-[0_0_25px_rgba(107,114,128,0.4)]',
          iconClass: 'text-gray-400',
          icon: '📢',
          titleColor: 'text-gray-400'
        };
    }
  };

  const config = getToastConfig();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`
          ${config.bgClass} ${config.borderClass} ${config.glowClass}
          backdrop-blur-md rounded-xl border-2 p-4 
          transform transition-all duration-300 ease-out
          ${isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
          ${!isLeaving ? 'animate-slide-in' : ''}
        `}
      >
        {/* Animated border */}
        <div className="absolute inset-0 rounded-xl bg-linear-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        
        <div className="relative flex items-start space-x-3">
          <div className={`text-2xl ${config.iconClass} flex-shrink-0 animate-pulse`}>
            {config.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`font-semibold text-sm ${config.titleColor} mb-1`}>
              {type === 'success' && 'Success!'}
              {type === 'error' && 'Error'}
              {type === 'info' && 'Information'}
              {type === 'warning' && 'Warning'}
            </div>
            <div className="text-gray-200 text-sm leading-relaxed">
              {message}
            </div>
          </div>
          
          <button
            onClick={() => {
              setIsLeaving(true);
              setTimeout(() => {
                setIsVisible(false);
                onClose && onClose();
              }, 300);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200 text-xl leading-none"
          >
            ×
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50 rounded-b-xl overflow-hidden">
          <div
            className={`h-full ${config.bgClass} transition-all ease-linear`}
            style={{
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;