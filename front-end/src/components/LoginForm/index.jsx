import { useState } from "react";

import { Input } from "../../components";

const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire API login when backend is ready.
  };

  return (
    <div>
      <h2>Log in!</h2>
      <form onSubmit={handleSubmit} noValidate>
        <Input
          inputName="Username/Email"
          inputType="text"
          stateValue={identifier}
          setStateValue={setIdentifier}
          errorsArr={[]}
          required
        />
        <Input
          inputName="Password"
          inputType="password"
          stateValue={password}
          setStateValue={setPassword}
          errorsArr={[]}
          required
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <p>or log in with Google account!</p>
        <button></button>
      </div>
      <p>
        Don't have account yet?
        <br />
        <a href="">Sign up here</a>
      </p>
    </div>
  );
};

export default LoginForm;
