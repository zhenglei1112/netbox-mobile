import { StatusBadge } from './StatusBadge.jsx';

export function MobileHeader({ title }) {
  return (
    <header className="mobile-header">
      <div>
        <p className="mobile-eyebrow">NetBox Mobile</p>
        <h1>{title}</h1>
      </div>
      <StatusBadge tone="idle">框架</StatusBadge>
    </header>
  );
}
