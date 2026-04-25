import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { user, logout, extendSession, sessionTimeout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState('');

  useEffect(() => {
    if (user && user.loginTime) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const sessionExpiry = user.loginTime + (sessionTimeout * 60 * 1000);
        const timeLeft = sessionExpiry - now;

        if (timeLeft <= 0) {
          setSessionTimeLeft('Session Expired');
          logout();
        } else {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          setSessionTimeLeft(`${hours}h ${minutes}m`);
        }
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [user, sessionTimeout, logout]);

  const handleLogout = () => {
    setShowMenu(false);
    logout();
  };

  const handleExtendSession = () => {
    extendSession();
    setShowMenu(false);
  };

  const getInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : 'AD';
  };

  const getLoginTime = () => {
    if (user && user.loginTime) {
      return new Date(user.loginTime).toLocaleString();
    }
    return 'Unknown';
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-3 bg-gray-800/60 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-3 hover:bg-gray-700/60 hover:border-cyan-400/50 transition-all duration-300 group shadow-lg"
      >
        {/* Avatar */}
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform shadow-md">
          {getInitials(user?.username)}
        </div>
        
        {/* User Info */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-sm font-medium text-gray-200">
            {user?.username || 'Admin'}
          </span>
          <span className="text-xs text-cyan-400">
            {sessionTimeLeft && `${sessionTimeLeft} left`}
          </span>
        </div>

        {/* Dropdown Arrow */}
        <div className={`text-cyan-400 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowMenu(false)}
          ></div>

          {/* Menu */}
          <div className="absolute right-0 top-full mt-3 w-80 bg-gray-900/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl shadow-2xl z-20 overflow-hidden">
            {/* User Info Header */}
            <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-purple-600/10 to-cyan-600/10">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {getInitials(user?.username)}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-100">
                    {user?.username || 'Admin User'}
                  </h3>
                  <p className="text-sm text-cyan-400">
                    {user?.email || 'admin@aziona.com'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Administrator Access
                  </p>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="p-4 border-b border-gray-700/30 bg-gray-800/20">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="text-gray-400 mb-1">Login Time</div>
                  <div className="text-gray-200 font-medium">{new Date(user?.loginTime).toLocaleTimeString()}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="text-gray-400 mb-1">Session Status</div>
                  <div className={`font-medium flex items-center ${sessionTimeLeft?.includes('Expired') ? 'text-red-400' : 'text-green-400'}`}>
                    <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></div>
                    {sessionTimeLeft || 'Active'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 space-y-2">
              <button
                onClick={handleExtendSession}
                className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-400/30 transition-all duration-200 text-left group border border-transparent"
              >
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-200">Extend Session</div>
                  <div className="text-xs text-gray-400">Reset session timer</div>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-red-500/10 hover:border-red-400/30 transition-all duration-200 text-left group border border-transparent"
              >
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-red-400">Sign Out</div>
                  <div className="text-xs text-gray-400">End current session</div>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-cyan-500/20 bg-gray-800/30">
              <div className="flex items-center justify-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400">Secure Session Active</span>
                <div className="flex items-center space-x-1 text-cyan-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>SSL</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;