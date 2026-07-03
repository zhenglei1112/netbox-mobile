import { StatusBadge } from '../components/StatusBadge.jsx';

export function ChangePage() {
  return (
    <section className="page-stack">
      <article className="module-card">
        <div>
          <h2>割接确认</h2>
          <p>预留割接计划、窗口期、现场确认和回退状态入口。</p>
        </div>
        <StatusBadge tone="attention">待设计</StatusBadge>
      </article>
    </section>
  );
}
