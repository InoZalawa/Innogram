import {
  InputLabel,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { forwardRef } from "react";

interface InputProps {
  label?: string;
  name?: string;
  type?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: string[];
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
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
      placeholder = "",
      className = "",
    },
    ref,
  ) => {
    const fallbackId = label || name || "input";
    const inputId = fallbackId.toLowerCase().replace(/\s+/g, "-");
    const errorId = `${inputId}-errors`;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const hasErrors = errors.length > 0;
    const describedBy =
      [hasErrors ? errorId : null, helperId].filter(Boolean).join(" ") ||
      undefined;

    return (
      <Stack className={`form-field ${className}`.trim()}>
        {label && (
          <InputLabel htmlFor={inputId}>
            {label}
            {required ? " *" : ""}
          </InputLabel>
        )}
        <TextField
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
          <Typography id={helperId} className="input-helper">
            {helperText}
          </Typography>
        )}
        {hasErrors && (
          <List id={errorId} className="input-errors">
            {errors.map((error, index) => (
              <ListItem key={index}>{error}</ListItem>
            ))}
          </List>
        )}
      </Stack>
    );
  },
);

export default Input;
