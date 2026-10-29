export default function ErrorMessage({ message, onRetry, compact = false }) {
  return (
    <div className={`error-message${compact ? " compact" : ""}`} role="alert">
      <span className="error-icon" aria-hidden="true">!</span>
      <div><strong>Something went wrong</strong><p>{message}</p></div>
      {onRetry && <button className="button button-secondary" onClick={onRetry}>Try again</button>}
    </div>
  );
}
