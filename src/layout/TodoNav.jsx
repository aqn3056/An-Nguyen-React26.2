import { NavLink } from 'react-router-dom';

function navClass({ isActive }) {
  return isActive ? 'tab is-active' : 'tab';
}

function TodoNav({ counts }) {
  return (
    <nav className="tabs glass" aria-label="Filter tasks by status">
      <NavLink to="/" end className={navClass}>
        All <span className="badge">{counts.all}</span>
      </NavLink>
      <NavLink to="/active" className={navClass}>
        Active <span className="badge">{counts.active}</span>
      </NavLink>
      <NavLink to="/completed" className={navClass}>
        Completed <span className="badge">{counts.completed}</span>
      </NavLink>
    </nav>
  );
}

export default TodoNav;
