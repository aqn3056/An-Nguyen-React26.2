import { Component } from 'react';
import Button from './Button.jsx';

// Catches render-time errors and shows a generic fallback so stack traces and
// internal details are never exposed to users. Details are logged in dev only.
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, info);
    }
  }

  handleReload = () => {
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="app">
          <main className="login">
            <div className="login__card glass" role="alert">
              <div className="login__head">
                <h1 className="login__title">Something went wrong</h1>
                <p className="login__subtitle">
                  An unexpected error occurred. Please reload the page to
                  continue.
                </p>
              </div>
              <Button variant="primary" onClick={this.handleReload}>
                Reload app
              </Button>
            </div>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
