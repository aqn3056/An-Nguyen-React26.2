function Header({ email }) {
  return (
    <header>
      <h1>Todo List</h1>
      {email && <p>Logged in as {email}</p>}
    </header>
  );
}

export default Header;
