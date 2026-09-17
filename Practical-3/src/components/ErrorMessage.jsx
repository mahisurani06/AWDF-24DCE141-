function ErrorMessage({ message, onRetry }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{message}</p>

      <button onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export default ErrorMessage;