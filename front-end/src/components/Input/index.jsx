import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      value = "",
      onChange,
      errors = [],
      helperText,
      required = false,
      placeholder,
      className = "",
    },
    ref,
  ) => {
    const fallbackId = label || name || "input";
    const inputId = fallbackId.toLowerCase().replace(/\s+/g, "-");
    const errorId = `${inputId}-errors`;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const hasErrors = errors.length > 0;
    const describedBy = [hasErrors ? errorId : null, helperId]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className={`form-field ${className}`.trim()}>
        {label && (
          <label htmlFor={inputId}>
            {label}
            {required ? " *" : ""}
          </label>
        )}
        <input
          id={inputId}
          name={name || inputId}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={hasErrors}
          aria-describedby={describedBy}
          placeholder={placeholder}
          ref={ref}
        />
        {helperText && (
          <p id={helperId} className="input-helper">
            {helperText}
          </p>
        )}
        {hasErrors && (
          <ul id={errorId} className="input-errors">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);

export default Input;
