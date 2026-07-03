export function LoadingState({ title = '正在检查登录状态', message = '请稍候。' }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
