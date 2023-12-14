import { createContext, useContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  //   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  function login(email) {
    // setIsLoggedIn(true);
    setUser({ email });
    navigate('/', { replace: true });
  }

  function logout() {
    // setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Outlet />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
