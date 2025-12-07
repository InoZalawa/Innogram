const Input = ({
  errorsArr = [],
  inputType,
  inputName,
  stateValue,
  setStateValue,
  required = false,
}) => {
  const inputId = inputName.toLowerCase().replace(/\s+/g, "-");
  const hasErrors = errorsArr.length > 0;

  return (
    <>
      <label htmlFor={inputId}>
        {inputName}:
        <input
          id={inputId}
          onChange={(e) => setStateValue(e.target.value)}
          value={stateValue}
          type={inputType}
          name={inputName}
          required={required}
          aria-invalid={hasErrors}
        />
      </label>

      <br />

      {hasErrors && (
        <ul>
          {errorsArr.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Input;
