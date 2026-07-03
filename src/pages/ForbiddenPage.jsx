import React from 'react';
import { AppLayout } from '../components/AppLayout.jsx';
import { ErrorState } from '../components/ErrorState.jsx';

export function ForbiddenPage({ auth, navigate }) {
  async function handleLogout() {
    await auth.logout().catch(() => {});
    navigate('/mobile/login', { replace: true });
  }

  return (
    <AppLayout title="无移动端权限" subtitle="当前用户没有移动端登录权限。">
      <ErrorState
        title="无法登录"
        message="请联系管理员开通 mobile.login 权限后重新扫码绑定。"
        action={
          <div className="button-stack">
            <button className="primary-button" type="button" onClick={() => navigate('/mobile/login', { replace: true })}>重新扫码</button>
            <button className="secondary-button" type="button" onClick={handleLogout}>退出登录</button>
          </div>
        }
      />
    </AppLayout>
  );
}
