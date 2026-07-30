function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
      <h2>Error</h2>

      <p>{message}</p>

      <button onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export default ErrorMessage;