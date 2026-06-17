import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoffError, setLogoffError] = useState('');
  const [isLoggingOff, setIsLoggingOff] = useState(false);

  const handleLogoff = async () => {
    setIsLoggingOff(true);
    setLogoffError('');

    const result = await logout();
    if (result.success) {
      navigate('/login');
    } else {
      setLogoffError(result.error);
      setIsLoggingOff(false);
    }
  };

  return (
    <>
      {logoffError && <p role="alert">{logoffError}</p>}
      <button type="button" onClick={handleLogoff} disabled={isLoggingOff}>
        {isLoggingOff ? 'Logging off...' : 'Log Off'}
      </button>
    </>
  );
}

export default Logoff;
