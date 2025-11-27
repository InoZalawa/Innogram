const InputComponent = ({errorsArr, inputType, inputName, stateValue,setStateValue}) =>{
  return (
  <div>
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
          <li key={index}>
            {error}
          </li>
        ))}
      </ul>
    ) : (
      errorsArr && (
        <div>
          <p>{errorsArr[0]}</p>
        </div>
      )
    )}
  </div>
) ;
}

export default InputComponent

