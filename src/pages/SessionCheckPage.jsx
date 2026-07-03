import React from 'react';
import { useEffect } from 'react';

import { AppLayout } from '../components/AppLayout.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { messageForAuthError } from '../utils/errors.js';

export function SessionCheckPage({ auth, navigate }) {
  const { checkSession } = auth;

  useEffect(() => {
    let mounted = true;

    checkSession().then((result) => {
      if (!mounted) return;
      if (result.error?.status === 403) {
        navigate('/mobile/forbidden', { replace: true });
        return;
      }
      navigate(result.authenticated ? '/mobile/home' : '/mobile/login', { replace: true });
    });

    return () => {
      mounted = false;
    };
  }, [checkSession, navigate]);

  return (
    <AppLayout title="NetBox 移动端" subtitle="正在确认当前移动端会话。">
      {auth.status === 'error' ? (
        <ErrorState
          title="网络异常"
          message={messageForAuthError(auth.error)}
          action={<button className="primary-button" onClick={() => navigate('/mobile/login')}>进入扫码绑定</button>}
        />
      ) : (
        <LoadingState />
      )}
    </AppLayout>
  );
}
