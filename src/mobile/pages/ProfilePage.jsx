import { StatusBadge } from '../components/StatusBadge.jsx';

export function ProfilePage() {
  return (
    <section className="page-stack">
      <article className="module-card">
        <div>
          <h2>连接状态</h2>
          <p>预留登录状态、NetBox 连接检查、版本和权限摘要。</p>
        </div>
        <StatusBadge tone="idle">空壳</StatusBadge>
      </article>
    </section>
  );
}
