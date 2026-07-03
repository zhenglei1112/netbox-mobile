import { StatusBadge } from '../components/StatusBadge.jsx';

export function ContractPage() {
  return (
    <section className="page-stack">
      <article className="module-card">
        <div>
          <h2>合同查询</h2>
          <p>预留合同、供应商、服务周期和附件索引入口。</p>
        </div>
        <StatusBadge tone="neutral">待接入</StatusBadge>
      </article>
    </section>
  );
}
