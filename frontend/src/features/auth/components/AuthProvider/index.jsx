import { useState, useEffect } from 'react';

import { AuthContext } from '../../context';
import { LoadingSpinner } from '../../../../components/LoadingSpinner/LoadingSpinner';
import { whoami } from '../../api';

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
      {isLoggedIn === null ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
}
