function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>
        Aurora Tasks · Built by{' '}
        <a
          href="https://github.com/aqn3056"
          target="_blank"
          rel="noopener noreferrer"
        >
          An Nguyen
        </a>{' '}
        · © {year}
      </p>
    </footer>
  );
}

export default Footer;
