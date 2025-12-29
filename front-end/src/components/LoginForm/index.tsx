import { useState } from "react";

import { Input } from "../../components";

const LoginForm : React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire API login when backend is ready.
  };

  return (
    <div>
      <h2>Log in!</h2>
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Username/Email"
          name="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          errors={[]}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          errors={[]}
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
