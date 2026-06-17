function EmptyState({ icon, title, children }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export default EmptyState;
