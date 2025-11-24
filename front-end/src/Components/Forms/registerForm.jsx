import { useState } from 'react'
const RegisterForm = () =>{
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setrepeatPassword] = useState("")
  const [mail, setMail] = useState("")

  const [passwordErrors,setFormError] = useState([])
  const [repeatedPasswordError, setRepeatedPasswordError] = useState(false)
  const [usernameError, setUsernameError] = useState(false)
  const [mailError, setMailError] = useState(false)
  
  const mailRegex = new RegExp(/@/) //TODO proper regex
  const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
  //const lenRegex = new RegExp(/^.{8,}$/);
  const lowerUpperCaseRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z]).+$/);
  const specialCharRegex = new RegExp(/^(?=.*[!@#$%^&*]).+$/);
  const numberRegex = new RegExp(/^(?=.*\d).+$/);
  /* at least 1 Upper/Lower case
   * at least 1 Special char
   * at least 1 number
   * at least 8 character long
   */
  const handleSubmit = (e) =>{
    e.preventDefault()
    if(password !== repeatPassword){
      setRepeatedPasswordError(true)
    }
    const errors = []
    if (password.length < 8) {
      setUsernameError(true)
    }
    if (mailRegex.test()) {
      setMailError(true)
    }

    if (!passwordRegex.test(password)) {
      if (password.length < 8) {
        errors.push("Password must be at least 8 characters long")
      }
      if (!lowerUpperCaseRegex.test(password)) {
        errors.push("Password must have at least 1 lowercase and 1 uppercase letter")
      }
      if (!specialCharRegex.test(password)) {
        errors.push("Password must contain at least 1 special character")
      }
      if (!numberRegex.test(password)) {
        errors.push("Password must contain at least 1 digit")
      }
      setFormError(errors)
      return 0
    }
    try
    {
    fetch("/auth/signup",{
      method: "POST",
      body: JSON.stringify({
        password: password,
        username: username,
        email: mail
      }),
      headers: {"Content-Type": "application/json"}
    })
  }catch(err){
    setFormError(err)
  }
  }
  return(
    <div>
      <h2>Sign up!</h2>
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username"
         onChange={(e) => setUsername(e.target.value)} value={username}/>
      </label>
      {usernameError && <div><p>Username must at least 8 character long</p><br/></div>}
      <br/>
      <label>
        Email:
        <input type="email" name="email"
         onChange={(e) => setMail(e.target.value)} value={mail}/> {/*TODO regex*/}
      </label>
      <br/>
      {mailError && <div><p>Email is not valid</p><br/></div>}
      <label>
        Password:
        <input type="password" name="password"
         onChange={(e) => setPassword(e.target.value)} value={password}/> {/*TODO regex*/}
      </label>
      <br/>
        {passwordErrors.length > 0 && (
          <div>
            <ul>
              {passwordErrors.map((error, index) => (
                <li key={index} className="error-item">{error}</li>
              ))}
            </ul>
          </div>
        )}
      <label>
        Repeat password:
        <input type="password" name="repeatPassword"
         onChange={(e) => setrepeatPassword(e.target.value)} value={repeatPassword}/>
      </label>
      <br/>
      {repeatedPasswordError && <div><p>Passwords are not the same</p><br/></div>}
      <button type="submit">Submit</button>
    </form>
    <div>
    <p>
      or just sign up with Google account!
    </p>
       
    </div>
    <p>Already have a account?<br/><a href="">Log in here</a></p>
    </div>
  )
}
export default RegisterForm
