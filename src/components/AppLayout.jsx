import React from 'react';
export function AppLayout({ title, subtitle, children, footer }) {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <header className="auth-header">
          <p className="auth-eyebrow">InfraOps Mobile</p>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </header>
        <div className="auth-content">{children}</div>
        {footer ? <footer className="auth-footer">{footer}</footer> : null}
      </section>
    </main>
  );
}
