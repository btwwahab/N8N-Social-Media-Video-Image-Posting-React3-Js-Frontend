import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Environment variables
  const ADMIN_USERNAME = import.meta.env.VITE_APP_ADMIN_USERNAME;
  const ADMIN_EMAIL = import.meta.env.VITE_APP_ADMIN_EMAIL;
  const ADMIN_PASSWORD = import.meta.env.VITE_APP_ADMIN_PASSWORD;
  const JWT_SECRET = import.meta.env.VITE_APP_JWT_SECRET;
  const SESSION_TIMEOUT = parseInt(import.meta.env.VITE_APP_SESSION_TIMEOUT) || 480; // minutes

  // Check for existing session on component mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = () => {
    try {
      const sessionToken = Cookies.get('auth_session');
      if (sessionToken) {
        const decrypted = CryptoJS.AES.decrypt(sessionToken, JWT_SECRET).toString(CryptoJS.enc.Utf8);
        if (decrypted) {
          const sessionData = JSON.parse(decrypted);
          const now = new Date().getTime();
          
          // Check if session is still valid (not expired)
          if (sessionData.expires > now) {
            setUser({
              username: sessionData.username,
              email: sessionData.email,
              loginTime: sessionData.loginTime
            });
            setIsAuthenticated(true);
          } else {
            // Session expired, clean up
            logout();
          }
        }
      }
    } catch (error) {
      console.error('Session validation error:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // Validate credentials against environment variables
      if ((username === ADMIN_USERNAME || username === ADMIN_EMAIL) && password === ADMIN_PASSWORD) {
        const loginTime = new Date().getTime();
        const expirationTime = loginTime + (SESSION_TIMEOUT * 60 * 1000); // Convert minutes to milliseconds
        
        const userData = {
          username: ADMIN_USERNAME,
          email: ADMIN_EMAIL,
          loginTime,
          expires: expirationTime
        };

        // Encrypt session data and store in cookie
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(userData), JWT_SECRET).toString();
        Cookies.set('auth_session', encrypted, { 
          expires: SESSION_TIMEOUT / (24 * 60), // Convert minutes to days for cookie expiration
          secure: window.location.protocol === 'https:',
          sameSite: 'strict'
        });

        setUser({
          username: userData.username,
          email: userData.email,
          loginTime: userData.loginTime
        });
        setIsAuthenticated(true);

        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: 'Invalid username or password.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login. Please try again.' };
    }
  };

  const logout = () => {
    Cookies.remove('auth_session');
    setUser(null);
    setIsAuthenticated(false);
  };

  const extendSession = () => {
    if (isAuthenticated && user) {
      const now = new Date().getTime();
      const expirationTime = now + (SESSION_TIMEOUT * 60 * 1000);
      
      const userData = {
        username: user.username,
        email: user.email,
        loginTime: user.loginTime,
        expires: expirationTime
      };

      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(userData), JWT_SECRET).toString();
      Cookies.set('auth_session', encrypted, { 
        expires: SESSION_TIMEOUT / (24 * 60),
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      });
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    extendSession,
    sessionTimeout: SESSION_TIMEOUT
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;