import { createContext, useContext, useState } from 'react';
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  // sessionStorage keeps separate demo tabs independent; localStorage preserves normal login persistence.
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => sessionStorage.getItem('token') || localStorage.getItem('token'));
 
  function login(userData, jwt) {
    setUser(userData);
    setToken(jwt);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwt);
  }
 
  function logout() {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
 
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  return useContext(AuthContext);
}
