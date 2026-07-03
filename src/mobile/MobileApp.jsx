import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ForbiddenPage } from '../pages/ForbiddenPage.jsx';
import { HomePage } from '../pages/HomePage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { SessionCheckPage } from '../pages/SessionCheckPage.jsx';
import { useAuthStore } from '../stores/authStore.js';
import './mobile.css';

function normalizeRoute(pathname) {
  if (pathname === '/' || pathname === '/m' || pathname.startsWith('/m/')) {
    return '/mobile/';
  }

  if (pathname === '/mobile') return '/mobile/';
  if (pathname.startsWith('/mobile/')) return pathname;
  return '/mobile/';
}

export default function MobileApp() {
  const auth = useAuthStore();
  const [route, setRoute] = useState(() => normalizeRoute(window.location.pathname));
  const [notice, setNotice] = useState('');

  const navigate = useCallback((to, options = {}) => {
    const nextRoute = normalizeRoute(to);
    const method = options.replace ? 'replaceState' : 'pushState';
    window.history[method]({}, '', nextRoute);
    setRoute(nextRoute);
    setNotice(options.notice || '');
  }, []);

  useEffect(() => {
    const onPopState = () => setRoute(normalizeRoute(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const normalized = normalizeRoute(window.location.pathname);
    if (normalized !== window.location.pathname) {
      window.history.replaceState({}, '', normalized);
      setRoute(normalized);
    }
  }, []);

  useEffect(() => {
    if (auth.error?.status === 401) {
      auth.clearAuthState();
      navigate('/mobile/login', { replace: true, notice: '当前登录已失效，请重新扫码绑定。' });
      return;
    }
    if (auth.error?.status === 403) {
      navigate('/mobile/forbidden', { replace: true });
    }
  }, [auth.error, auth.clearAuthState, navigate]);

  useEffect(() => {
    if (route === '/mobile/home' && auth.status === 'unauthenticated') {
      navigate('/mobile/login', { replace: true });
    }
    if ((route === '/mobile/login' || route === '/mobile/pair') && auth.status === 'authenticated') {
      navigate('/mobile/home', { replace: true });
    }
  }, [auth.status, navigate, route]);

  const page = useMemo(() => {
    if (route === '/mobile/login' || route === '/mobile/pair') {
      return <LoginPage auth={auth} navigate={navigate} />;
    }
    if (route === '/mobile/home') {
      return <HomePage auth={auth} navigate={navigate} />;
    }
    if (route === '/mobile/forbidden') {
      return <ForbiddenPage auth={auth} navigate={navigate} />;
    }
    return <SessionCheckPage auth={auth} navigate={navigate} />;
  }, [auth, navigate, route]);

  return (
    <>
      {notice ? <div className="route-notice" role="status">{notice}</div> : null}
      {page}
    </>
  );
}
