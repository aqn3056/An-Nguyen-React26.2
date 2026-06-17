import { Link } from 'react-router-dom';
import EmptyState from '../shared/EmptyState.jsx';
import { InboxIcon } from '../shared/icons.jsx';

function NotFoundPage() {
  return (
    <div className="glass panel">
      <EmptyState icon={<InboxIcon />} title="Page not found">
        The page you are looking for does not exist.
      </EmptyState>
      <div className="not-found__action">
        <Link to="/" className="btn btn--primary">
          Back to tasks
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
