// Reusable error message display.
const ErrorMessage = ({ message = 'An error occurred', onDismiss = null }) => {
  return (
    <div style={{
      padding: '12px 14px',
      backgroundColor: 'rgba(248, 113, 113, 0.12)',
      border: '1px solid rgba(248, 113, 113, 0.32)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--red)',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px',
    }}>
      <span>⚠️ {message}</span>
      {onDismiss && (
        <button onClick={onDismiss} style={{ opacity: 0.7, fontSize: '16px', padding: '0 4px' }}>
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
