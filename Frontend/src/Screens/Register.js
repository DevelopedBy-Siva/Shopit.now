import React from "react";
import { Redirect, Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import InputContainer from "../Components/Home/InputContainer";
import { passwordPattern } from "../datas/passwordPattern";
import RegisterMain from "../Components/login-register/RegisterMain";
import { getCurrentUser } from "../services/LoginReg";
import { IoArrowBack } from "react-icons/io5";
import "../css/register.css";
import Loader from "../Components/Loader";

const validate = Yup.object().shape({
  name: Yup.string()
    .required("Enter the name")
    .min(3)
    .max(20)
    .label("Name")
    .trim(),
  email: Yup.string()
    .required("Enter the email")
    .max(25)
    .email("Invalid email")
    .label("Email")
    .trim(),
  mobile: Yup.string()
    .length(10, "Invalid Mobile no")
    .required("Enter the mobile no")
    .label("Mobile no")
    .trim(),
  password: Yup.string()
    .max(20)
    .matches(
      passwordPattern,
      "Password should have atleast one uppercase, lowercase, digit and special character(@$!%*?&)"
    )
    .required("Enter the password")
    .label("Password")
    .trim(),
  confirm: Yup.string()
    .required("Confirm the password")
    .oneOf([Yup.ref("password"), null], "Passwords doesn't match")
    .label("Confirm Password")
    .trim(),
});

class Register extends RegisterMain {
  render() {
    if (getCurrentUser()) return <Redirect to="/" />;
    const { registrationBegin } = this.state;
    return (
      <div className="register-container">
        <div className="right-container">
          <span className="skip-to-app">
            <Link to="/">
              <IoArrowBack className="icon" />
              Back to app
            </Link>
          </span>
          <h2>Create new account</h2>
          <h3>
            Already a member?{" "}
            <Link to="/login" className="signin-link">
              Sign in
            </Link>
          </h3>
          <Formik
            initialValues={{
              name: "",
              email: "",
              mobile: "",
              password: "",
              confirm: "",
            }}
            onSubmit={this.handleRegistration}
            validationSchema={validate}
          >
            {({
              handleSubmit,
              handleChange,
              errors,
              setFieldTouched,
              touched,
            }) => (
              <form onSubmit={handleSubmit}>
                <InputContainer
                  inputRef={this.nameref}
                  onBlur={() => setFieldTouched("name")}
                  touched={touched.name}
                  errors={errors.name}
                  onChange={handleChange("name")}
                  maxLength={20}
                  autoCapitalize="words"
                  autoComplete="off"
                  spellCheck="false"
                  type="text"
                  name="full name"
                  disabled={registrationBegin}
                />
                <InputContainer
                  inputRef={this.emailref}
                  onBlur={() => setFieldTouched("email")}
                  touched={touched.email}
                  errors={errors.email}
                  onChange={handleChange("email")}
                  maxLength={25}
                  autoCapitalize="off"
                  autoComplete="off"
                  spellCheck="false"
                  type="text"
                  name="email"
                  disabled={registrationBegin}
                />
                <InputContainer
                  inputRef={this.mobileref}
                  onBlur={() => setFieldTouched("mobile")}
                  touched={touched.mobile}
                  errors={errors.mobile}
                  onChange={handleChange("mobile")}
                  autoComplete="off"
                  spellCheck="false"
                  type="number"
                  name="mobile"
                  disabled={registrationBegin}
                />
                <InputContainer
                  inputRef={this.passwordref}
                  onBlur={() => setFieldTouched("password")}
                  touched={touched.password}
                  onChange={handleChange("password")}
                  errors={errors.password}
                  maxLength={20}
                  type="password"
                  name="password"
                  disabled={registrationBegin}
                />
                <InputContainer
                  inputRef={this.confirmref}
                  onBlur={() => setFieldTouched("confirm")}
                  touched={touched.confirm}
                  errors={errors.confirm}
                  onChange={handleChange("confirm")}
                  type="password"
                  name="re-enter password"
                  disabled={registrationBegin}
                />
                <button
                  disabled={registrationBegin}
                  ref={this.submitRef}
                  type="submit"
                  className="btn-container"
                >
                  {registrationBegin ? (
                    <Loader style={{ width: "18px", height: "18px" }} />
                  ) : (
                    "REGISTER"
                  )}
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

export default Register;
