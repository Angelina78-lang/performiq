// Confirmation modal for destructive actions.
const ConfirmDialog = ({
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
  isDangerous = false,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal modal-sm">
        <div className="modal-head">
          <h3>{title}</h3>
        </div>
        <div className="modal-body" style={{ fontSize: '14px', color: 'var(--text-soft)' }}>
          {message}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
