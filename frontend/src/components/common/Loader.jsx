// Reusable loading spinner with an optional label.
const Loader = ({ label = 'Loading…', compact = false }) => {
  if (compact) {
    return <span className="spinner spinner-sm" aria-label="loading" />;
  }
  return (
    <div className="loader-wrap">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
};

export default Loader;
