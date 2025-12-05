const Input = ({
  errorsArr,
  inputType,
  inputName,
  stateValue,
  setStateValue,
}) => {
  return (
    <>
      <label>
        {inputName}:
        <input
          onChange={(e) => setStateValue(e.target.value)}
          value={stateValue}
          type={inputType}
          name={inputName}
        />
      </label>

      <br />

      {errorsArr.length > 1 ? (
        <ul>
          {errorsArr.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      ) : (
        errorsArr && (
          <div>
            <p>{errorsArr[0]}</p>
          </div>
        )
      )}
    </>
  );
};

export default InputComponent;
