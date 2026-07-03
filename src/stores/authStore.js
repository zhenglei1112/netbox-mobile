import { useCallback, useMemo, useState } from 'react';

import { authService } from '../api/authService.js';

export function useAuthStore() {
  const [session, setSession] = useState(null);
  const [me, setMe] = useState(null);
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  const clearAuthState = useCallback(() => {
    setSession({ authenticated: false });
    setMe(null);
    setStatus('unauthenticated');
    setError(null);
  }, []);

  const checkSession = useCallback(async () => {
    setStatus('checking');
    setError(null);
    try {
      const nextSession = await authService.getSession();
      setSession(nextSession);
      if (nextSession.authenticated) {
        const user = await authService.getMe();
        setMe(user);
        setStatus('authenticated');
        return { authenticated: true, session: nextSession, me: user };
      }
      setMe(null);
      setStatus('unauthenticated');
      setError(null);
      return { authenticated: false, session: nextSession };
    } catch (nextError) {
      setError(nextError);
      if (nextError.status === 401) {
        clearAuthState();
        return { authenticated: false, error: nextError };
      }
      setStatus('error');
      return { authenticated: false, error: nextError };
    }
  }, [clearAuthState]);

  const logout = useCallback(async () => {
    await authService.logout();
    clearAuthState();
  }, [clearAuthState]);

  return useMemo(() => ({
    session,
    me,
    status,
    error,
    checkSession,
    clearAuthState,
    logout,
    setError
  }), [session, me, status, error, checkSession, clearAuthState, logout]);
}
