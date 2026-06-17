import { useCallback, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import GlassDefs from './layout/GlassDefs.jsx';
import Header from './layout/Header.jsx';
import Footer from './layout/Footer.jsx';
import LogonForm from './features/auth/LogonForm.jsx';
import TodosPage from './pages/TodosPage.jsx';
import TodosView from './pages/TodosView.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');

  const handleAuthenticated = useCallback(({ name, token: csrfToken }) => {
    setUser(name);
    setToken(csrfToken);
  }, []);

  const handleLogout = useCallback(() => {
    setUser('');
    setToken('');
  }, []);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <GlassDefs />
      <div className="shell">
        <Header user={user} onLogout={handleLogout} />
        {token ? (
          <main id="main" className="app-main">
            <Routes>
              <Route
                path="/"
                element={
                  <TodosPage token={token} onSessionExpired={handleLogout} />
                }
              >
                <Route index element={<TodosView status="all" />} />
                <Route path="active" element={<TodosView status="active" />} />
                <Route
                  path="completed"
                  element={<TodosView status="completed" />}
                />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        ) : (
          <main id="main" className="app-main login">
            <LogonForm onAuthenticated={handleAuthenticated} />
          </main>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
