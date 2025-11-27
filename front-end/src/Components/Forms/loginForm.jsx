const LoginForm = () =>{
  return(
    <div>
      <h2>Log in!</h2>
    <form>
      <label>
        Username/Email:
        <input type="text"/>
      </label>
      <label>
        Password:
        <input type="password"/>
      </label>
      <button type="submit">Submit</button>
    </form>
    <div>
    <p>
      or log in with Google account!
    </p>
    <button></button>
    </div>
    <p>Don't have account yet?<br/><a href="">Sign up here</a></p>
    </div>
  )
}

export default LoginForm
