import React from "react";
import InputContainer from "../Components/Home/InputContainer";
import { Formik } from "formik";
import * as Yup from "yup";
import "../css/login.css";
import { Link, Redirect } from "react-router-dom";
import LoginMain from "../Components/login-register/LoginMain";
import { getCurrentUser } from "../services/LoginReg";
import Loader from "../Components/Loader";

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
                  style={{ background: "none", maxWidth: "450px" }}
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
                  style={{ background: "none", maxWidth: "450px" }}
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
                <Link className="dont-have-account" to="/register">
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
