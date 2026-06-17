import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import Button from '../../shared/Button.jsx';
import Alert from '../../shared/Alert.jsx';
import Spinner from '../../shared/Spinner.jsx';
import { LogoIcon } from '../../shared/icons.jsx';
import {
  loginSchema,
  flattenFieldErrors,
  EMAIL_MAX,
  PASSWORD_MAX,
} from '../../utils/todoSchemas.js';
import { sanitizeText } from '../../utils/sanitize.js';
import { logon } from '../../services/authService.js';

function LogonForm({ onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = flattenFieldErrors(result.error);
      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const credentials = {
        email: sanitizeText(result.data.email),
        password: result.data.password,
      };
      const { name, csrfToken } = await logon(credentials);
      onAuthenticated({ name, token: csrfToken });
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login__card glass">
      <div className="login__head">
        <span className="login__mark">
          <LogoIcon />
        </span>
        <h1 className="login__title">Welcome back</h1>
        <p className="login__subtitle">Sign in to manage your tasks.</p>
      </div>

      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        {authError && <Alert message={authError} />}
        <TextInputWithLabel
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
          maxLength={EMAIL_MAX}
          autoComplete="email"
          required
        />
        <TextInputWithLabel
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          maxLength={PASSWORD_MAX}
          autoComplete="current-password"
          required
        />
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner label="Signing in" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </div>
  );
}

export default LogonForm;
