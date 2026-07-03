import { AppLayout } from '../components/AppLayout.jsx';
import { EmptyState } from '../components/EmptyState.jsx';

function formatTime(value) {
  if (!value) return '暂无记录';
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export function HomePage({ auth, navigate }) {
  const user = auth.me || auth.session?.user;
  const device = auth.me?.device || auth.session?.device;

  async function handleRefresh() {
    const result = await auth.checkSession();
    if (result.error?.status === 401 || !result.authenticated) {
      navigate('/mobile/login', { replace: true, notice: '当前登录已失效，请重新扫码绑定。' });
    }
    if (result.error?.status === 403) {
      navigate('/mobile/forbidden', { replace: true });
    }
  }

  async function handleLogout() {
    await auth.logout();
    navigate('/mobile/login', { replace: true });
  }

  return (
    <AppLayout title="NetBox 移动端" subtitle="当前状态：已登录">
      {user ? (
        <section className="profile-card">
          <dl>
            <div>
              <dt>用户</dt>
              <dd>{user.display_name || user.username}</dd>
            </div>
            <div>
              <dt>设备</dt>
              <dd>{device?.name || '未知设备'}</dd>
            </div>
            <div>
              <dt>设备状态</dt>
              <dd>{device?.status || '未知'}</dd>
            </div>
            <div>
              <dt>最近登录</dt>
              <dd>{formatTime(auth.me?.last_login_at || auth.session?.last_login_at)}</dd>
            </div>
          </dl>
          <div className="button-stack">
            <button className="secondary-button" type="button" onClick={handleRefresh}>重新检查会话</button>
            <button className="danger-button" type="button" onClick={handleLogout}>退出登录</button>
          </div>
        </section>
      ) : (
        <EmptyState title="正在读取用户信息" message="如果长时间没有响应，请重新检查会话。" />
      )}
    </AppLayout>
  );
}
