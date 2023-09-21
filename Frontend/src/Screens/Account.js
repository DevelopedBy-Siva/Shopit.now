import React, { useEffect, useState } from "react";
import { FaTruck } from "react-icons/fa";
import { MdRemoveCircle, MdLocationOn, MdKey, MdClose } from "react-icons/md";
import { HiOutlinePlusSm, HiOutlineMinusSm } from "react-icons/hi";
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

const validateAddress = Yup.object().shape({
  houseNo: Yup.string()
    .required("Enter the house no/street")
    .min(3)
    .max(20)
    .label("House No")
    .trim(),
  town: Yup.string().required("Enter the town").max(25).label("Town").trim(),
  city: Yup.string().required("Enter the city").label("City").trim(),
  state: Yup.string().max(20).required("Enter the State").label("State").trim(),
  pincode: Yup.string()
    .min(5, "Invalid pincode")
    .max(10, "Invalid pincode")
    .required("Enter the pincode")
    .label("Pincode"),
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

const addressValues = {
  houseNo: "",
  town: "",
  city: "",
  state: "",
  pincode: "",
};

function AddAddress({ toggle, loading, setLoading }) {
  const [api, setApi] = useState({
    loading: true,
    data: [],
    error: null,
  });
  const [todo, setTodo] = useState({
    type: null,
    values: addressValues,
  });

  async function handleAddress() {
    setLoading(true);
  }

  useEffect(() => {
    async function getApi() {
      const user = getCurrentUser();
      await axios
        .get(`${URL(api_endpoints.userOperations)}/address/${user.id}`, {
          headers: {
            Authorization: getJwt(),
          },
        })
        .then(({ data }) => {
          setApi({ loading: false, error: null, data });
        })
        .catch(() => {
          setApi({ data: [], loading: false, error: "error" });
        });
    }
    getApi();
  }, []);

  const handleTask = (type, values = addressValues) => {
    setTodo({ type, values });
  };

  const goBack = () => setTodo({ type: null, values: addressValues });

  const btnInactive = (e) => e.target.classList.add("account-address-inactive");
  const btnRemoveInactive = (e) =>
    e.target.classList.remove("account-address-inactive");

  const handleDefault = async (e, addressId) => {
    const user = getCurrentUser();
    setLoading(true);
    btnInactive(e);
    await axios
      .put(
        `${URL(api_endpoints.userOperations)}/update-default-address/${
          user.id
        }/${addressId}`,
        null,
        {
          headers: { Authorization: getJwt() },
        }
      )
      .then(() => {
        const data = [...api.data];
        data.forEach((item) => {
          if (item.id === addressId) item.defaultAddress = true;
          else item.defaultAddress = false;
        });
        setApi({ ...api, data });
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
    setLoading(false);
    btnRemoveInactive(e);
  };

  const handleRemove = async (e, addressId) => {
    const user = getCurrentUser();
    setLoading(true);
    btnInactive(e);
    await axios
      .delete(
        `${URL(api_endpoints.userOperations)}/delete-address/${
          user.id
        }/${addressId}`,
        { headers: { Authorization: getJwt() } }
      )
      .then(() => {
        const data = [...api.data].filter((item) => item.id !== addressId);
        setApi({ ...api, data });
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
    setLoading(false);
    btnRemoveInactive(e);
  };

  return (
    <FocusWrapper toggle={toggle}>
      <div className="account-add-address">
        <ModalHeadingWrapper loading={loading} toggle={toggle}>
          Your Address
        </ModalHeadingWrapper>
        {todo.type === null ? (
          <div className="account-user-address account-address-wrapper">
            <div className="add-new-address-button-container">
              <HiOutlinePlusSm />
              <button disabled={loading} onClick={() => handleTask("ADD")}>
                Add new address
              </button>
            </div>
            <div className="address-sub-heading">
              <HiOutlineMinusSm />
              <span>Saved addresses</span>
            </div>
            <div className="account-saved-address-content">
              {api.loading ? (
                <p>Fetching saved addresses. Please wait...</p>
              ) : api.error ? (
                <p>Something went wrong. Failed to get saved addresses</p>
              ) : api.data.length === 0 ? (
                <p>No saved addresses found</p>
              ) : (
                <div className="address-box-container">
                  {api.data.map((item, index) => {
                    const { city, houseNo, pincode, state, town } =
                      item.addressDetails;
                    return (
                      <div className="address-box" key={index}>
                        <span>{`${houseNo}, ${town}, ${city}, ${state}, ${pincode}`}</span>
                        <div className="address-btn-container">
                          <button
                            disabled={loading}
                            onClick={() =>
                              handleTask("EDIT", item.addressDetails)
                            }
                          >
                            Edit
                          </button>

                          <span>|</span>
                          <button
                            onClick={(e) => handleRemove(e, item.id)}
                            disabled={loading}
                          >
                            Remove
                          </button>
                          {!item.defaultAddress && (
                            <>
                              <span>|</span>
                              <button
                                disabled={loading}
                                onClick={(e) => handleDefault(e, item.id)}
                              >
                                Set as default
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="account-address-content account-address-wrapper">
            <button
              disabled={loading}
              onClick={goBack}
              className="account-address-go-back"
            >
              Back
            </button>
            <div className="address-sub-heading">
              <HiOutlinePlusSm />
              <span>
                {todo.type === "EDIT" ? "Edit address" : "Add new address"}
              </span>
            </div>
            <Formik
              initialValues={{ ...todo.values }}
              onSubmit={handleAddress}
              validationSchema={validateAddress}
            >
              {({
                handleSubmit,
                handleChange,
                errors,
                setFieldTouched,
                touched,
                isValid,
                dirty,
                values,
              }) => {
                return (
                  <form
                    onSubmit={handleSubmit}
                    className="account-change-password-content-form"
                  >
                    <div>
                      <label name="houseNo">House No/Street:</label>
                      <input
                        name="houseNo"
                        onChange={handleChange("houseNo")}
                        disabled={loading}
                        maxLength={10}
                        type="text"
                        value={values.houseNo}
                        onBlur={() => setFieldTouched("houseNo")}
                      />
                      {errors.houseNo && touched.houseNo && (
                        <span className="account-change-password-input-error">
                          {errors.houseNo}
                        </span>
                      )}
                    </div>
                    <div>
                      <label name="town">Town:</label>
                      <input
                        name="town"
                        onChange={handleChange("town")}
                        disabled={loading}
                        maxLength={20}
                        type="text"
                        value={values.town}
                        onBlur={() => setFieldTouched("town")}
                      />
                      {errors.town && touched.town && (
                        <span className="account-change-password-input-error">
                          {errors.town}
                        </span>
                      )}
                    </div>
                    <div>
                      <label name="city">City:</label>
                      <input
                        name="city"
                        onChange={handleChange("city")}
                        disabled={loading}
                        maxLength={20}
                        type="text"
                        value={values.city}
                        onBlur={() => setFieldTouched("city")}
                      />
                      {errors.city && touched.city && (
                        <span className="account-change-password-input-error">
                          {errors.city}
                        </span>
                      )}
                    </div>
                    <div>
                      <label name="state">State:</label>
                      <input
                        name="state"
                        onChange={handleChange("state")}
                        disabled={loading}
                        maxLength={20}
                        type="text"
                        value={values.state}
                        onBlur={() => setFieldTouched("state")}
                      />
                      {errors.state && touched.state && (
                        <span className="account-change-password-input-error">
                          {errors.state}
                        </span>
                      )}
                    </div>
                    <div>
                      <label name="pincode">Pincode:</label>
                      <input
                        name="pincode"
                        onChange={handleChange("pincode")}
                        disabled={loading}
                        maxLength={10}
                        type="text"
                        value={values.pincode}
                        onBlur={() => setFieldTouched("pincode")}
                      />
                      {errors.pincode && touched.pincode && (
                        <span className="account-change-password-input-error">
                          {errors.pincode}
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
                      ) : todo.type === "EDIT" ? (
                        "Edit Address"
                      ) : (
                        "Add Address"
                      )}
                    </button>
                  </form>
                );
              }}
            </Formik>
          </div>
        )}
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
