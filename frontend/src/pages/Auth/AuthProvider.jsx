import { createContext, useContext, useState } from 'react';
import { Outlet, useLoaderData, useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export async function loader() {
  const res = await fetch('http://localhost:8000/api/v1/auth/whoami', {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('whoami error');
  }

  return await res.json();
}

export default function AuthProvider({ children }) {
  const loaderData = useLoaderData();

  //   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(
    loaderData === null ? null : { email: loaderData }
  );
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
