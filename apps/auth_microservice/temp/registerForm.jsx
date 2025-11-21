import { useState } from 'react'
const registerForm = () =>{
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [repeatPassword, setrepeatPassword] = useState()
  const [mail, setMail] = useState()

  const [formError,setFormError] = useState("")

  
  const mailRegex = new RegExp()
  const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
  
  /* at least 1 Upper/Lower case
   * at least 1 Special char
   * at least 1 number
   * at least 8 character long
   */
  const handleSubmit = (e) =>{
    if(password !== repeatPassword){
      setFormError("PASSWORDS ARE NOT THE SAME")
      return 0
    }
    if(!passwordRegex.test(password)){
      setFormError("PASSWORD DID NOT FULFILLED CRITERIA") //TODO enlist not fulfilled criteria
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
      {formError?<p>{formError}</p>:null} {/*TODO password are not matching/regex not fulfilled etc.*/}
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username" onChange={(e) => setUsername(e.target.value)}/>
      </label>
      <label>
        Email:
        <input type="email" name="email" onChange={(e) => setMail(e.target.value)}/> {/*TODO regex*/}
      </label>
      <label>
        Password:
        <input type="password" name="password" onChange={(e) => setPassword(e.target.value)}/> {/*TODO regex*/}
      </label>
      <label>
        Repeat password:
        <input type="password" name="repeatPassword" onChange={(e) => setrepeatPassword(e.target.value)}/>
      </label>
      <button type="submit">Submit</button>
    </form>
    <div>
    <p>
      or sign up with Google account!
    </p>
    <button></button>
    </div>
    <p>Already have a account?<br/><a href="">Log in here</a></p>
    </div>
  )
}