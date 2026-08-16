import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchUsersByEmail, fetchUserById, createUser, updateUser } from '../api/users.js';

const AuthContext = createContext(null);
const SESSION_KEY = 'hf_current_user_id';

function authError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [status, setStatus] = useState('restoring'); // restoring | ready | sessionError
  const [sessionError, setSessionError] = useState(null);

  const restoreSession = useCallback(async () => {
    const storedId = localStorage.getItem(SESSION_KEY);
    if (!storedId) {
      setStatus('ready');
      return;
    }
    setStatus('restoring');
    setSessionError(null);
    try {
      const user = await fetchUserById(storedId);
      setCurrentUser(user);
      setStatus('ready');
    } catch (error) {
      setSessionError(error);
      setStatus('sessionError');
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const register = useCallback(async ({ name, email, password }) => {
    const existing = await fetchUsersByEmail(email);
    if (Array.isArray(existing) && existing.some((u) => u.email?.toLowerCase() === email.toLowerCase())) {
      throw authError('email_exists');
    }
    const user = await createUser({ name, email, password, emergencyContact: null, bloodType: '', allergies: '', conditions: '' });
    localStorage.setItem(SESSION_KEY, user.id);
    setCurrentUser(user);
    setStatus('ready');
    return user;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const matches = await fetchUsersByEmail(email);
    const user = Array.isArray(matches)
      ? matches.find((u) => u.email?.toLowerCase() === email.toLowerCase() && u.password === password)
      : null;
    if (!user) {
      throw authError('invalid_credentials');
    }
    localStorage.setItem(SESSION_KEY, user.id);
    setCurrentUser(user);
    setStatus('ready');
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setStatus('ready');
  }, []);

  const updateProfile = useCallback(
    async (payload) => {
      if (!currentUser) throw authError('not_authenticated');
      const updated = await updateUser(currentUser.id, { ...currentUser, ...payload });
      setCurrentUser(updated);
      return updated;
    },
    [currentUser]
  );

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      status,
      sessionError,
      register,
      login,
      logout,
      updateProfile,
      retrySessionRestore: restoreSession,
    }),
    [currentUser, status, sessionError, register, login, logout, updateProfile, restoreSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
