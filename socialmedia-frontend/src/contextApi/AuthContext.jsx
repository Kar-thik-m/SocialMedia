import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:4000/user/loaduser', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
          }
        } catch (error) {
          console.error('Failed to load user:', error);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const register = async (userData) => {
    const response = await fetch('http://localhost:4000/user/register', {
      method: 'POST',
      body: userData,
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } else {
      throw new Error('Registration failed');
    }
  };

  const login = async (credentials) => {
    const response = await fetch('http://localhost:4000/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      
      localStorage.setItem('token', data.token);
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
