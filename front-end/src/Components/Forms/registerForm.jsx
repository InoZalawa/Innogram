import { useState, useEffect } from "react";

import Input from "../Input";

const mailRegex = new RegExp(/@/); //TODO proper regex
//const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
const lenRegex = new RegExp(/^.{8,}$/);
const lowerUpperCaseRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z]).+$/);
const specialCharRegex = new RegExp(/^(?=.*[!@#$%^&*]).+$/);
const numberRegex = new RegExp(/^(?=.*\d).+$/);
/* at least 1 Upper/Lower case
 * at least 1 Special char
 * at least 1 number
 * at least 8 character long
 */

const passwordValidationArr = [
  { regex: lenRegex, message: "must be at least 8 character long" },
  {
    regex: lowerUpperCaseRegex,
    message: "must have at least 1 uppercase letter and 1 lowercase letter",
  },
  {
    regex: specialCharRegex,
    message: "must have at least 1 special character",
  },
  { regex: numberRegex, message: "must contain at least 1 digit " },
];

const usernameValidationArr = [
  { regex: lenRegex, message: "must be at least 8 character long" },
];

const mailValidationArr = [{ regex: mailRegex, message: "placeholder" }];

import axios from "axios";
const mailRegex = new RegExp(/@/); //TODO proper regex
//const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
const lenRegex = new RegExp(/^.{8,}$/);
const lowerUpperCaseRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z]).+$/);
const specialCharRegex = new RegExp(/^(?=.*[!@#$%^&*]).+$/);
const numberRegex = new RegExp(/^(?=.*\d).+$/);
/* at least 1 Upper/Lower case
 * at least 1 Special char
 * at least 1 number
 * at least 8 character long
 */

const passwordValidationArr = [
  { regex: lenRegex, message: "must be at least 8 character long" },
  {
    regex: lowerUpperCaseRegex,
    message: "must have at least 1 uppercase letter and 1 lowercase letter",
  },
  {
    regex: specialCharRegex,
    message: "must have at least 1 special character",
  },
  { regex: numberRegex, message: "must contain at least 1 digit " },
];

const usernameValidationArr = [
  { regex: lenRegex, message: "must be at least 8 character long" },
];

const mailValidationArr = [{ regex: mailRegex, message: "placeholder" }];

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setrepeatPassword] = useState("");
  const [mail, setMail] = useState("");

  const [passwordErrors, setPasswordError] = useState([]);
  const [repeatedPasswordError, setRepeatedPasswordError] = useState([]);
  const [usernameError, setUsernameError] = useState([]);
  const [mailError, setMailError] = useState([]);

  const handleRegex = (validationArr, validatedText) => {
    let errorMesArr = [];
    validationArr.forEach((criterion) => {
      if (!criterion.regex.test(validatedText)) {
        errorMesArr.push(criterion.message);
      }
    });
    return errorMesArr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setRepeatedPasswordError(["passwords must be identical"]);
    }
    setPasswordError(handleRegex(passwordValidationArr, password));
    setUsernameError(handleRegex(usernameValidationArr, username));
    setMailError(handleRegex(mailValidationArr, mail));

    const ANY_ERRORS =
      passwordErrors.length !== 0 ||
      repeatedPasswordError.length !== 0 ||
      usernameError.length !== 0 ||
      mailError.length !== 0;

    if (ANY_ERRORS) {
      return;
    }

    try {
      const response = await axios.post("/auth/signup", {
        password: password,
        username: username,
        email: mail,
      });
      console.log(response.data);
    } catch (err) {
      //setFormError(err)
    }
  };

  return (
    <div>
      <h2>Sign up!</h2>
      <form onSubmit={handleSubmit}>
        <Input
          inputName="Username"
          inputType="text"
          stateValue={username}
          setStateValue={setUsername}
          errorsArr={usernameError}
        />

        <Input
          inputName="Email"
          inputType="email"
          stateValue={mail}
          setStateValue={setMail}
          errorsArr={mailError}
        />

        <Input
          inputName="Password"
          inputType="password"
          stateValue={password}
          setStateValue={setPassword}
          errorsArr={passwordErrors}
        />

        <Input
          inputName="Repeat password"
          inputType="password"
          stateValue={repeatPassword}
          setStateValue={setrepeatPassword}
          errorsArr={repeatedPasswordError}
        />

        <button type="submit">Submit</button>
      </form>
      <div>
        <p>or just sign up with Google account!</p>
      </div>
      <p>
        Already have a account?
        <br />
        <a href="">Log in here</a>
      </p>
    </div>
  );
};
export default RegisterForm;
