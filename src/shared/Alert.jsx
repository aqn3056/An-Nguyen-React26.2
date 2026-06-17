import { WarningIcon } from './icons.jsx';

function Alert({ message, children }) {
  return (
    <div className="alert" role="alert">
      <WarningIcon />
      <p>{message}</p>
      {children && <div className="alert__actions">{children}</div>}
    </div>
  );
}

export default Alert;
