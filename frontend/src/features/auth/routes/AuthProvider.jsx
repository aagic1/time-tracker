import { createContext, useContext, useEffect, useState } from 'react';
import { LoadingSpinner } from '../../../components/LoadingSpinner/LoadingSpinner';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
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
    async function whoami() {
      const res = await fetch('http://localhost:8000/api/v1/auth/whoami', {
        credentials: 'include',
      });
      if (!res.ok) {
        console.log('whoami error');
        throw new Error('whoami error');
      }

      const data = await res.json();
      if (data === null) {
        setIsLoggedIn(false);
        setUser(null);
      } else {
        setIsLoggedIn(true);
        setUser({ email: data });
      }
    }

    whoami();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {isLoggedIn === null ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
}
