import React from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { passwordPattern, passwordRule } from "../datas/passwordPattern";
import MainAccountContainer from "../Components/Account Screen/MainAccountContainer";
import AccountContainerInput from "../Components/Home/AccountContainerInput";
import { FaCamera, FaAngleRight, FaTimesCircle } from "react-icons/fa";
import APP_LOGO_WHITE from "../Icons/app-logo-white.svg";
import Lottie from "lottie-react";
import loading from "../animations/smallLoad.json";
import AccountError from "../Components/Account Screen/AccountError";
import "../css/account.css";

const validate = Yup.object().shape({
  current: Yup.string()
    .required("Enter the current password")
    .max(20)
    .label("Current Password")
    .trim(),
  password: Yup.string()
    .max(20)
    .matches(passwordPattern, passwordRule)
    .required("Enter the new password")
    .label("Password")
    .trim(),
  confirm: Yup.string()
    .required("Confirm the password")
    .oneOf([Yup.ref("password"), null], "Passwords doesn't match")
    .label("Confirm Password")
    .trim(),
});

class Account extends MainAccountContainer {
  render() {
    const {
      imageError,
      user,
      submissionStarted,
      confirmPassword,
      error,
      profileImage,
      account,
    } = this.state;
    return (
      <>
        {submissionStarted && (
          <div className="account-submission-cover">
            <Lottie
              className="account-submission-cover-icon"
              animationData={loading}
            />
          </div>
        )}
        <div className="account-container">
          <div className="account-left-container">
            <div className="user-container">
              <div className="user-image-container">
                {imageError && (
                  <h5 className="user-image-error">{imageError}</h5>
                )}
                <div className="user-image-cont1">
                  <img src={profileImage} alt="profile" />
                </div>
                <label className="camera-icon" htmlFor="image-logo">
                  <input
                    onChange={this.handleProfileImage}
                    id="image-logo"
                    accept="image/*"
                    type="file"
                  />
                  <FaCamera className="camera-icon-click" />
                </label>
              </div>
              <h3>{user.fullname}</h3>
              <h4>{user.sub}</h4>
            </div>
          </div>

          <div className="account-sub-container">
            <Link to="/" className="logo-container">
              <img src={APP_LOGO_WHITE} alt="account logo" />
            </Link>
            <h3>Manage Account</h3>
            <div className="account-links">
              {account.map((item, index) => (
                <Link key={index} to={item.to} className="user-options">
                  <span className="user-options-link">{item.name}</span>
                  <FaAngleRight />
                </Link>
              ))}
              <div
                onClick={() =>
                  this.handleChange(
                    "background-overlay-change",
                    "change-container"
                  )
                }
                className="user-options"
              >
                <span className="user-options-link">Change Password</span>
                <FaAngleRight />
              </div>
              <div
                onClick={() =>
                  this.handleChange(
                    "background-overlay-delete",
                    "delete-account-container"
                  )
                }
                className="user-options"
              >
                <span className="user-options-link">Delete Account</span>
                <FaAngleRight />
              </div>
              <div
                onClick={() =>
                  this.handleChange(
                    "background-overlay-logout",
                    "logout-container"
                  )
                }
                className="user-options-logout"
              >
                <span className="user-options-link-logout">Logout</span>
                <FaAngleRight />
              </div>
            </div>
          </div>
        </div>

        <div className="change-container">
          <h2>Change Password</h2>
          <Formik
            initialValues={{
              current: "",
              password: "",
              confirm: "",
            }}
            validationSchema={validate}
            onSubmit={this.handlePasswordChange}
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              setFieldTouched,
              touched,
            }) => (
              <form onSubmit={handleSubmit}>
                <AccountContainerInput
                  touched={touched.current}
                  errors={errors.current}
                  onChange={handleChange("current")}
                  onBlur={() => setFieldTouched("current")}
                  autoComplete="off"
                  spellCheck="false"
                  type="password"
                  name="Current Password"
                />
                {!errors.current && <AccountError error={error} />}
                <AccountContainerInput
                  touched={touched.password}
                  errors={errors.password}
                  onChange={handleChange("password")}
                  onBlur={() => setFieldTouched("password")}
                  autoComplete="off"
                  spellCheck="false"
                  type="password"
                  name="New Password"
                />
                <AccountContainerInput
                  touched={touched.confirm}
                  errors={errors.confirm}
                  onChange={handleChange("confirm")}
                  onBlur={() => setFieldTouched("confirm")}
                  autoComplete="off"
                  spellCheck="false"
                  type="password"
                  name="Re-enter Password"
                />
                <FaTimesCircle
                  onClick={() =>
                    this.closeChange(
                      "background-overlay-change",
                      "change-container"
                    )
                  }
                  className="close-btn"
                />
                <button type="submit" className="password-change-btn">
                  Change
                </button>
              </form>
            )}
          </Formik>
        </div>
        <div className="logout-container">
          <h4>Are you sure to you want to logout now?</h4>
          <div>
            <button onClick={this.handleLogout}>Logout</button>
            <button
              onClick={() =>
                this.closeChange(
                  "background-overlay-logout",
                  "logout-container"
                )
              }
            >
              No
            </button>
          </div>
        </div>
        <div className="delete-account-container">
          <h4>Are you sure to you want to delete the account?</h4>
          <AccountContainerInput
            onChange={this.handleDeleteConfirmation}
            value={confirmPassword}
            autoComplete="off"
            spellCheck="false"
            type="password"
            name="Confrim Password"
          />
          <AccountError error={error} />
          <div>
            <button onClick={this.handleAccountDelete}>Delete</button>
            <button
              onClick={() =>
                this.closeChange(
                  "background-overlay-delete",
                  "delete-account-container"
                )
              }
            >
              No
            </button>
          </div>
        </div>
        <div
          onClick={() =>
            this.closeChange("background-overlay-change", "change-container")
          }
          className="background-overlay-change"
        ></div>
        <div
          onClick={() =>
            this.closeChange("background-overlay-logout", "logout-container")
          }
          className="background-overlay-logout"
        ></div>
        <div
          onClick={() =>
            this.closeChange(
              "background-overlay-delete",
              "delete-account-container"
            )
          }
          className="background-overlay-delete"
        ></div>
      </>
    );
  }
}

export default Account;
