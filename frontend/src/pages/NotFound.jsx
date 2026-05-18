import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const NotFound = () => {
  return (
    <>
      <Navbar pageTitle="Not Found" />
      <div className="page-content">
        <EmptyState
          icon="🚫"
          title="Page Not Found"
          message="The page you're looking for doesn't exist or has been moved."
          action={<Link to="/dashboard" className="btn btn-primary">← Back to Dashboard</Link>}
        />
      </div>
    </>
  );
};

export default NotFound;
