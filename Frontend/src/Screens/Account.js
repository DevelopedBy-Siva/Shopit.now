import React, { useState } from "react";
import { FaTruck } from "react-icons/fa";
import { MdRemoveCircle, MdLocationOn, MdKey, MdClose } from "react-icons/md";
import ReactFocusLock from "react-focus-lock";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import { passwordPattern } from "../datas/passwordPattern";
import {
  getCurrentUser,
  getJwt,
  removeJwt,
  setJwt,
} from "../services/LoginReg";
import Loader from "../Components/Loader";
import toast from "../Components/Toast";
import { formUrl as URL, api_endpoints } from "../api/api";

import "../css/account.css";

const operations = [
  {
    title: "Orders",
    desc: "View your order status and history",
    ico: <FaTruck />,
    redirect: true,
  },
  {
    title: "Your Address",
    desc: "Add a new shipping address to your account",
    ico: <MdLocationOn />,
    comp: AddAddress,
  },
  {
    title: "Change Password",
    desc: "Update your account password",
    ico: <MdKey />,
    comp: ChangePassword,
  },
  {
    title: "Delete Account",
    desc: "Permanently remove your account and data",
    ico: <MdRemoveCircle />,
    comp: DeleteAccount,
  },
];

const validatePaasword = Yup.object().shape({
  current: Yup.string()
    .max(20)
    .matches(
      passwordPattern,
      "Password should have atleast one uppercase, lowercase, digit and special character(@$!%*?&)"
    )
    .required("Enter the current password")
    .label("Current Password")
    .trim(),
  newPswd: Yup.string()
    .max(20)
    .matches(
      passwordPattern,
      "Password should have atleast one uppercase, lowercase, digit and special character(@$!%*?&)"
    )
    .required("Enter the new password")
    .label("New Password")
    .trim(),
  confirmPswd: Yup.string()
    .required("Confirm the password")
    .oneOf([Yup.ref("newPswd"), null], "Passwords doesn't match")
    .label("Confirm Password")
    .trim(),
});

export default function Account() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="user-account-container contain">
      <div className="account-header">
        <h1>Your Account</h1>
        <div className="account-logout">
          <button onClick={removeJwt}>Logout</button>
        </div>
      </div>
      <div className="operation-container">
        {operations.map((item, index) => (
          <ButtonWrapper
            loading={loading}
            setLoading={setLoading}
            key={index}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}

function ButtonWrapper({ item, loading, setLoading }) {
  const [visible, setVisible] = useState(false);

  const history = useHistory();

  function toggle() {
    if (item.redirect) return history.push("/account/orders");
    if (!loading) return setVisible(!visible);
  }

  return (
    <>
      <div onClick={toggle} className="account-opr">
        {item.ico}
        <div className="account-opr-wrapper">
          <h4>{item.title}</h4>
          <p>{item.desc}</p>
        </div>
      </div>
      {visible && (
        <item.comp toggle={toggle} loading={loading} setLoading={setLoading} />
      )}
    </>
  );
}

function FocusWrapper({ loading, toggle, children }) {
  return (
    <ReactFocusLock>
      <div className="account-screen-modal">
        <button
          className={`account-screen-modal-overlay ${
            loading && "account-screen-modal-disable"
          }`}
          onClick={toggle}
        ></button>
        <div className="account-modal-content">{children}</div>
      </div>
    </ReactFocusLock>
  );
}

function ChangePassword({ toggle, loading, setLoading }) {
  const handleChangePassword = async ({ current, newPswd }) => {
    setLoading(true);
    const user = getCurrentUser();

    await axios
      .put(
        `${URL(api_endpoints.userOperations)}/update-password/${user.id}`,
        {},
        {
          headers: {
            Authorization: getJwt(),
            "current-password": current,
            "new-password": newPswd,
          },
        }
      )
      .then(({ data }) => {
        setJwt(data);
        toggle();
        setLoading(false);
        toast.success("Password updated successfully");
      })
      .catch(({ response }) => {
        setLoading(false);
        if (response.status === 401) {
          toast.error("Oops! Incorrect password");
          return;
        }
        toast.error("Something went wrong");
      });
  };

  return (
    <FocusWrapper loading={loading} toggle={toggle}>
      <div className="account-change-password">
        <ModalHeadingWrapper loading={loading} toggle={toggle}>
          Change Password
        </ModalHeadingWrapper>
        <div className="account-change-password-content">
          <Formik
            initialValues={{
              current: "",
              newPswd: "",
              confirmPswd: "",
            }}
            onSubmit={handleChangePassword}
            validationSchema={validatePaasword}
          >
            {({
              handleSubmit,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              isValid,
              dirty,
            }) => {
              return (
                <form
                  onSubmit={handleSubmit}
                  className="account-change-password-content-form"
                >
                  <div>
                    <label name="current-pswd">
                      Enter the current password:
                    </label>
                    <input
                      name="current-pswd"
                      onChange={handleChange("current")}
                      disabled={loading}
                      maxLength={20}
                      type="password"
                      onBlur={() => setFieldTouched("current")}
                    />
                    {errors.current && touched.current && (
                      <span className="account-change-password-input-error">
                        {errors.current}
                      </span>
                    )}
                  </div>
                  <div>
                    <label name="new-pswd">Enter the new password:</label>
                    <input
                      name="new-pswd"
                      onChange={handleChange("newPswd")}
                      disabled={loading}
                      maxLength={20}
                      type="password"
                      onBlur={() => setFieldTouched("newPswd")}
                    />
                    {errors.newPswd && touched.newPswd && (
                      <span className="account-change-password-input-error">
                        {errors.newPswd}
                      </span>
                    )}
                  </div>
                  <div>
                    <label name="confirm-pswd">Confirm password:</label>
                    <input
                      name="confirm-pswd"
                      onChange={handleChange("confirmPswd")}
                      disabled={loading}
                      maxLength={20}
                      type="password"
                      onBlur={() => setFieldTouched("confirmPswd")}
                    />
                    {errors.confirmPswd && touched.confirmPswd && (
                      <span className="account-change-password-input-error">
                        {errors.confirmPswd}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={
                      !isValid || !dirty
                        ? "account-change-password-btn-grey"
                        : ""
                    }
                  >
                    {loading ? (
                      <Loader style={{ width: "18px", height: "18px" }} />
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </FocusWrapper>
  );
}

function DeleteAccount({ toggle, loading, setLoading }) {
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (passwordValidation()) return;
    setLoading(true);
    const user = getCurrentUser();
    await axios
      .post(
        `${URL(api_endpoints.userOperations)}/delete-user/${user.id}`,
        {},
        {
          headers: {
            Authorization: getJwt(),
            "user-password": password,
          },
        }
      )
      .then(() => {
        removeJwt();
      })
      .catch(({ response }) => {
        setLoading(false);
        if (response.status === 401) {
          toast.error("Oops! Incorrect password");
          return;
        }
        toast.error("Something went wrong");
      });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const passwordValidation = () => {
    return password.length === 0;
  };

  return (
    <FocusWrapper loading={loading} toggle={toggle}>
      <div className="account-delete-account">
        <ModalHeadingWrapper loading={loading} toggle={toggle}>
          Delete Account
        </ModalHeadingWrapper>
        <div className="account-delete-account-content">
          <p>
            Are you sure you want to do this? Once deleted, there is no way to
            retrieve the account.
          </p>
          <div className="account-delete-account-content-form">
            <label>Enter your password:</label>
            <input
              onChange={handleInputChange}
              disabled={loading}
              type="password"
            />
            <button
              onClick={handleSubmit}
              disabled={passwordValidation() || loading}
              className={passwordValidation() ? "account-delete-btn-grey" : ""}
            >
              {loading ? (
                <Loader style={{ width: "18px", height: "18px" }} />
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>
      </div>
    </FocusWrapper>
  );
}

function AddAddress({ toggle, loading, setLoading }) {
  return (
    <FocusWrapper toggle={toggle}>
      <div className="account-add-address">
        <ModalHeadingWrapper loading={loading} toggle={toggle}>
          Your Address
        </ModalHeadingWrapper>
      </div>
    </FocusWrapper>
  );
}

function ModalHeadingWrapper({ loading, toggle, children }) {
  return (
    <div className="account-screen-modal-header">
      <h2>{children}</h2>
      <button
        onClick={toggle}
        disabled={loading}
        className="account-screen-modal-close"
      >
        <MdClose />
      </button>
    </div>
  );
}
