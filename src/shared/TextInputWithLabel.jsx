function TextInputWithLabel({
  id,
  label,
  value,
  onChange,
  ref,
  type = 'text',
  error,
  hideLabel = false,
  ...props
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="field-group">
      <label htmlFor={id} className={hideLabel ? 'sr-only' : undefined}>
        {label}
      </label>
      <input
        className="field-input"
        id={id}
        type={type}
        ref={ref}
        value={value}
        onChange={onChange}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        {...props}
      />
      {error && (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}

export default TextInputWithLabel;
