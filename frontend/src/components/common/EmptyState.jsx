// Reusable empty-state placeholder.
const EmptyState = ({
  icon = '📭',
  title = 'Nothing here yet',
  message = 'There is no data to display.',
  action = null,
}) => {
  return (
    <div className="state-box">
      <div className="state-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <div className="mt-16">{action}</div>}
    </div>
  );
};

export default EmptyState;
