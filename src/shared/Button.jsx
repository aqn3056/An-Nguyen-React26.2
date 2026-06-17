function Button({
  variant,
  size,
  iconOnly = false,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const classes = [
    'btn',
    variant && `btn--${variant}`,
    size === 'sm' && 'btn--sm',
    iconOnly && 'btn--icon',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
