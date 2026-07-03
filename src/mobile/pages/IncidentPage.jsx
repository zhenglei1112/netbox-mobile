import { StatusBadge } from '../components/StatusBadge.jsx';

export function IncidentPage() {
  return (
    <section className="page-stack">
      <article className="module-card">
        <div>
          <h2>故障确认</h2>
          <p>预留故障列表、影响范围、处理状态和移动端确认入口。</p>
        </div>
        <StatusBadge tone="attention">待设计</StatusBadge>
      </article>
    </section>
  );
}
