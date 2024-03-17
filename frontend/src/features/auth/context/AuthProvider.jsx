import { useState, useEffect, createContext, useContext } from 'react';

import { LoadingPage } from '../../../components/LoadingPage';
import { whoami } from '../api';

const AuthContext = createContext({});

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  function login(email) {
    setIsLoggedIn(true);
    setUser({ email });
  }

  function logout() {
    setIsLoggedIn(false);
    setUser(null);
  }

  useEffect(() => {
    async function checkLoginStatus() {
      const { response, data } = await whoami();
      if (!response.ok) {
        throw new Error('whoami error');
      }

      if (data === null) {
        setIsLoggedIn(false);
        setUser(null);
      } else {
        setIsLoggedIn(true);
        setUser({ email: data });
      }
    }

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {isLoggedIn === null ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
}
