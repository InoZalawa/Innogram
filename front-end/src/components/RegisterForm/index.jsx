import { useState } from "react";
import axios from "axios";

import { Input } from "../../components";

// Simple-but-sane email check (no backtracking heavy regexes needed here).
const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const lenRegex = /^.{8,}$/;
const lowerUpperCaseRegex = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
const specialCharRegex = /^(?=.*[!@#$%^&*]).+$/;
const numberRegex = /^(?=.*\d).+$/;

const passwordValidationArr = [
  { regex: lenRegex, message: "Must be at least 8 characters long" },
  {
    regex: lowerUpperCaseRegex,
    message: "Needs at least 1 uppercase and 1 lowercase letter",
  },
  { regex: specialCharRegex, message: "Add at least 1 special character" },
  { regex: numberRegex, message: "Include at least 1 digit" },
];

const usernameValidationArr = [
  { regex: lenRegex, message: "Must be at least 8 characters long" },
];

const mailValidationArr = [
  { regex: mailRegex, message: "Use a valid email like user@example.com" },
];

// Reusable helper so we always validate with fresh values (avoids stale state).
const validateAgainstRules = (validationArr, value) =>
  validationArr
    .filter((criterion) => !criterion.regex.test(value))
    .map((criterion) => criterion.message);

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [mail, setMail] = useState("");

  const [passwordErrors, setPasswordError] = useState([]);
  const [repeatedPasswordError, setRepeatedPasswordError] = useState([]);
  const [usernameError, setUsernameError] = useState([]);
  const [mailError, setMailError] = useState([]);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Trim to avoid trailing spaces being treated as part of credentials.
    const trimmedUsername = username.trim();
    const trimmedMail = mail.trim();

    const passwordValidation = validateAgainstRules(
      passwordValidationArr,
      password,
    );
    const usernameValidation = validateAgainstRules(
      usernameValidationArr,
      trimmedUsername,
    );
    const mailValidation = validateAgainstRules(mailValidationArr, trimmedMail);
    const repeatPasswordValidation =
      password !== repeatPassword ? ["Passwords must match"] : [];

    setPasswordError(passwordValidation);
    setUsernameError(usernameValidation);
    setMailError(mailValidation);
    setRepeatedPasswordError(repeatPasswordValidation);

    const hasErrors =
      passwordValidation.length !== 0 ||
      repeatPasswordValidation.length !== 0 ||
      usernameValidation.length !== 0 ||
      mailValidation.length !== 0;

    if (hasErrors) return;

    try {
      const response = await axios.post("/auth/signup", {
        password,
        username: trimmedUsername,
        email: trimmedMail,
      });
      console.log(response.data);
    } catch (err) {
      setFormError("Sign-up failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Sign up!</h2>
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          errors={usernameError}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          errors={mailError}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          errors={passwordErrors}
          required
        />

        <Input
          label="Repeat password"
          name="repeat-password"
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          errors={repeatedPasswordError}
          required
        />

        <button type="submit">Submit</button>
      </form>
      {formError && <p>{formError}</p>}
      <div>
        <p>or just sign up with Google account!</p>
      </div>
      <p>
        Already have an account?
        <br />
        <a href="">Log in here</a>
      </p>
    </div>
  );
};
export default RegisterForm;
