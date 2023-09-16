import React from "react";
import InputContainer from "../Components/Home/InputContainer";
import { Formik } from "formik";
import * as Yup from "yup";
import "../css/login.css";
import { Link, Redirect } from "react-router-dom";
import LoginMain from "../Components/login-register/LoginMain";
import { getCurrentUser } from "../services/LoginReg";
import Loader from "../Components/Loader";
import { IoArrowBack } from "react-icons/io5";

const validate = Yup.object().shape({
  email: Yup.string()
    .required("Enter the email")
    .max(25, "Stop playing around")
    .email("Invalid email")
    .label("Email")
    .trim(),
  password: Yup.string()
    .required("Enter the password")
    .label("Password")
    .trim(),
});

class Login extends LoginMain {
  render() {
    if (getCurrentUser()) return <Redirect to="/" />;
    const { loginBegan } = this.state;
    return (
      <div className="login-container">
        <div className="login-sub-container">
          <span className="skip-to-app">
            <Link
              onClick={(e) => this.disableBtn(e, loginBegan)}
              className={loginBegan ? "disable-link" : ""}
              to={this.redirectTo()}
            >
              <IoArrowBack className="icon" />
              Back to app
            </Link>
          </span>
          <h2>
            Hey, hello <span>&#128075;</span>
          </h2>
          <h3>Enter the information you entered while registering.</h3>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validate}
            onSubmit={this.handleLogin}
          >
            {({
              handleChange,
              handleSubmit,
              touched,
              errors,
              setFieldTouched,
            }) => (
              <form onSubmit={handleSubmit}>
                <InputContainer
                  disabled={loginBegan}
                  inputRef={this.userref}
                  spellCheck="false"
                  autoComplete="off"
                  type="text"
                  onBlur={() => setFieldTouched("email")}
                  onChange={handleChange("email")}
                  errors={errors.email}
                  touched={touched.email}
                  name="email"
                />
                <InputContainer
                  disabled={loginBegan}
                  inputRef={this.passref}
                  spellCheck="false"
                  type="password"
                  onBlur={() => setFieldTouched("password")}
                  onChange={handleChange("password")}
                  errors={errors.password}
                  touched={touched.password}
                  name="password"
                />
                <button
                  disabled={loginBegan}
                  ref={this.submitRef}
                  type="submit"
                >
                  {loginBegan ? (
                    <Loader style={{ width: "18px", height: "18px" }} />
                  ) : (
                    "LOGIN"
                  )}
                </button>
                <Link
                  onClick={(e) => this.disableBtn(e, loginBegan)}
                  className={`dont-have-account ${
                    loginBegan ? "disable-link" : ""
                  }`}
                  to="/register"
                >
                  Don't have an account?
                </Link>
              </form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

export default Login;
