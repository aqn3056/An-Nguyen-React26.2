import Button from '../shared/Button.jsx';
import { LogoIcon, LogOutIcon } from '../shared/icons.jsx';

function Header({ user, onLogout }) {
  return (
    <header className="site-header glass">
      <div className="site-header__brand">
        <span className="site-header__mark">
          <LogoIcon />
        </span>
        <div>
          <h1 className="site-header__title">Aurora Tasks</h1>
          <p className="site-header__tagline">Stay on top of your day</p>
        </div>
      </div>
      {user && (
        <div className="site-header__user">
          <p className="site-header__username">
            <span>Signed in as</span>
            {user}
          </p>
          <Button size="sm" onClick={onLogout}>
            <LogOutIcon />
            Log out
          </Button>
        </div>
      )}
    </header>
  );
}

export default Header;
