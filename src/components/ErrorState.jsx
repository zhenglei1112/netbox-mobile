export function ErrorState({ title = '操作失败', message, action }) {
  return (
    <div className="state-block state-error" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {action ? <div className="state-actions">{action}</div> : null}
    </div>
  );
}
