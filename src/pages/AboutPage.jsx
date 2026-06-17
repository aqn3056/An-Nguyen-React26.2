function AboutPage() {
  return (
    <div>
      <h2>About This App</h2>
      <p>
        This is a todo application that lets you create, edit, complete, sort,
        and filter your tasks.
      </p>
      <section>
        <h3>Features</h3>
        <ul>
          <li>Add, edit, and complete todos</li>
          <li>Sort todos by title or creation date</li>
          <li>Filter todos by search term and status</li>
          <li>Multi-page navigation with protected routes</li>
          <li>User authentication with a profile page</li>
        </ul>
      </section>
      <section>
        <h3>Technologies Used</h3>
        <ul>
          <li>React</li>
          <li>React Router</li>
          <li>Vite</li>
        </ul>
      </section>
    </div>
  );
}

export default AboutPage;
