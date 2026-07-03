import { StatusBadge } from '../components/StatusBadge.jsx';

export function RoomPage() {
  return (
    <section className="page-stack">
      <article className="module-card">
        <div>
          <h2>机房查询</h2>
          <p>预留站点、机房、机柜和设备位置查询入口。</p>
        </div>
        <StatusBadge tone="neutral">待接入</StatusBadge>
      </article>
    </section>
  );
}
