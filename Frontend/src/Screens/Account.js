import React, { useEffect, useRef, useState } from "react";
import { FaTruck } from "react-icons/fa";
import { MdRemoveCircle, MdLocationOn, MdKey, MdClose } from "react-icons/md";
import { HiOutlinePlusSm, HiOutlineMinusSm } from "react-icons/hi";
import ReactFocusLock from "react-focus-lock";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { Formik } from "formik";
import axios from "axios";
import moment from "moment";
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
    comp: OrderDetails,
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

  const location = useLocation();
  useEffect(() => {
    if (!item.redirect) return;

    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("order")) setVisible(true);
  }, []);

  function toggle() {
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
      <AnimatePresence>
        {visible && (
          <item.comp
            toggle={toggle}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}

const modalContentVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

const modalExitTransition = { duration: 0.2 };

function FocusWrapper({ loading, toggle, children }) {
  return (
    <div style={{ position: "fixed", zIndex: 99999999 }}>
      <ReactFocusLock>
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={modalContentVariants}
          transition={modalExitTransition}
          className="account-screen-modal"
        >
          <motion.button
            className={`account-screen-modal-overlay ${
              loading && "account-screen-modal-disable"
            }`}
            onClick={toggle}
          ></motion.button>
          <div className="account-modal-content">{children}</div>
        </motion.div>
      </ReactFocusLock>
    </div>
  );
}

function OrderDetails({ toggle, loading, setLoading }) {
  const [api, setApi] = useState({
    loading: true,
    data: [],
    error: null,
  });

  useEffect(() => {
    async function getApi() {
      const user = getCurrentUser();

      await axios
        .get(`${URL(api_endpoints.userOrders)}/${user.id}`, {
          headers: {
            Authorization: getJwt(),
          },
        })
        .then(({ data }) => {
          setApi({ loading: false, error: null, data });
        })
        .catch(() => {
          setApi({ loading: false, error: "error", data: [] });
        });
    }
    getApi();
  }, []);

  return (
    <FocusWrapper loading={loading} toggle={toggle}>
      <div className="account-order-container">
        <ModalHeadingWrapper loading={loading} toggle={toggle}>
          Orders
        </ModalHeadingWrapper>
        <div className="account-order-container-content">
          {api.loading ? (
            <p className="account-order-api-msg">
              Fetching your recent orders. Please wait...
            </p>
          ) : api.error ? (
            <p className="account-order-api-msg">
              Something went wrong. Failed to get your orders
            </p>
          ) : api.data.length === 0 ? (
            <p className="account-order-api-msg">No orders found</p>
          ) : (
            <div className="account-order-box-container">
              {api.data.map((item, index) => (
                <UserOrderBox
                  key={index}
                  item={item}
                  setApi={setApi}
                  api={api}
                  setLoading={setLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </FocusWrapper>
  );
}

const contentVariants = {
  open: { height: "auto", opacity: 1 },
  closed: { height: 0, opacity: 0 },
};
const exitTransition = { duration: 0.2 };

function UserOrderBox({ item, api, setApi, setLoading }) {
  const [show, setShow] = useState(null);
  const [cancelProduct, setCancelProduct] = useState(null);
  const [selectedReason, setSelectedReason] = useState("mistake");

  function handleReasonChange(e) {
    setSelectedReason(e.target.value);
  }

  function handleShow(task) {
    if (show === task) {
      setShow(null);
      return;
    }
    setShow(task);
  }

  async function handleProductCancellation(cancelId) {
    const user = getCurrentUser();
    setCancelProduct(true);
    setLoading(true);
    await axios
      .put(
        `${URL(api_endpoints.userOrders)}/cancel/${user.id}/${cancelId}`,
        null,
        {
          headers: {
            Authorization: getJwt(),
          },
        }
      )
      .then(() => {
        setShow(null);
        const data = [...api.data];
        data.forEach((item) => {
          if (item.id === cancelId) {
            item.orderStatus.cancelled = true;
          }
        });
        setApi({ ...api, data });
        toast.info("Order cancelled successfully");
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
    setLoading(false);
    setCancelProduct(false);
  }

  const {
    billingAddress,
    deliveryDate,
    orderImage,
    itemDetails,
    modeOfPayment,
    orderDate,
    orderStatus,
  } = item;
  const { type, picByte } = orderImage;
  const { productName, totalPrice, itemCount } = itemDetails;
  const { dispatched, shipped, delivered, cancelled } = orderStatus;

  const status = (
    cancelled
      ? "Cancelled:#FF0000"
      : delivered
      ? "Delivered:#4CBB17"
      : shipped
      ? "Shipped:#3498db"
      : dispatched
      ? "Dispatched:#3498db"
      : "Waiting for dispatch:#ffc000"
  ).split(":");

  const imgUrl = `data:${type};base64,${picByte}`;
  const deliveryDay = moment(deliveryDate).format("dddd");
  const estimatedDelivery = moment(deliveryDate).format("LL");

  const orderStatusKeys = [
    {
      print: "Processed",
      fillIn: "#4cbb17",
    },
    {
      print: !dispatched ? "Dispatching" : "Dispatched",
      fillIn: dispatched && true,
    },
    {
      print: !dispatched ? "" : !shipped ? "Shipping" : "Shipped",
      fillIn: shipped && true,
    },
    {
      print: !shipped ? "" : "Delivered",
      fillIn: delivered && true,
    },
  ];
  return (
    <div className="account-order-box">
      <div className="account-order-box-top">
        <span style={{ backgroundColor: status[1] }}></span>
        <p>{status[0]}</p>
      </div>
      <div className="account-order-box-btm">
        <div className="account-order-box-btm-wrapper">
          <img alt="order" src={imgUrl} />
          <div className="account-order-box-desc">
            <p>{productName}</p>
            {!delivered && !cancelled && (
              <span>Estimated delivery: {estimatedDelivery}</span>
            )}
          </div>
        </div>
        <div className="account-order-box-btn-container">
          {!delivered && !cancelled && (
            <>
              <button
                disabled={cancelProduct}
                className={show === "TRACK" ? "account-order-box-active" : ""}
                onClick={() => handleShow("TRACK")}
              >
                Track Order
              </button>
              <button
                disabled={cancelProduct}
                className={
                  (!cancelProduct && show) === "CANCEL"
                    ? "account-order-box-active"
                    : ""
                }
                onClick={() => handleShow("CANCEL")}
              >
                Cancel Order
              </button>
            </>
          )}
          <button
            className={show === "DETAILS" ? "account-order-box-active" : ""}
            onClick={() => handleShow("DETAILS")}
            disabled={cancelProduct}
          >
            Order Details
          </button>
        </div>
      </div>
      <AnimatePresence>
        {show === "DETAILS" && (
          <motion.div
            className="account-order-toggle-container"
            key="details"
            initial="closed"
            animate="open"
            exit="closed"
            variants={contentVariants}
            transition={exitTransition}
          >
            <div className="account-order-toggle-container-wrapper">
              <h5>Order Details</h5>
              <div className="account-order-details-content"></div>
            </div>
          </motion.div>
        )}
        {show === "TRACK" && (
          <motion.div
            className="account-order-toggle-container"
            key="track"
            initial="closed"
            animate="open"
            exit="closed"
            variants={contentVariants}
            transition={exitTransition}
          >
            <div className="account-order-toggle-container-wrapper">
              <h5>Tracking details</h5>
              <div className="account-order-track-details-content">
                {orderStatusKeys.map((item, index) => {
                  return (
                    <div className={item.fillIn ? "fill-in" : ""} key={index}>
                      <span className="name">{item.print}</span>
                    </div>
                  );
                })}
                <span className="track-line" />
                <span
                  className={`track-line-fill ${
                    dispatched && "order-dispatched"
                  } ${shipped && "order-shipped"}`}
                />
              </div>
            </div>
          </motion.div>
        )}
        {show === "CANCEL" && (
          <motion.div
            className="account-order-toggle-container"
            key="cancel"
            initial="closed"
            animate="open"
            exit="closed"
            variants={contentVariants}
            transition={exitTransition}
          >
            <div className="account-order-toggle-container-wrapper">
              <h5>Cancel Order</h5>
              <div className="account-order-cancel-content">
                <div className="account-order-cancel-input">
                  <div>
                    <label>Select a reason for cancellation :</label>
                    <select
                      onChange={handleReasonChange}
                      value={selectedReason}
                      disabled={cancelProduct}
                      name="reason"
                      id="reason"
                    >
                      <option value="mistake">Order created by mistake</option>
                      <option value="high">Item price too high</option>
                      <option value="thrid-party">
                        Item sold by thrid party
                      </option>
                      <option value="time">
                        Item would not arrive on time
                      </option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label>Write a reason (optional):</label>
                    <textarea disabled={cancelProduct} maxLength={255} />
                  </div>
                </div>
                <div className="account-order-cancel-btn">
                  <button
                    disabled={cancelProduct}
                    onClick={() => handleProductCancellation(item.id)}
                  >
                    {cancelProduct ? (
                      <Loader style={{ width: "18px", height: "18px" }} />
                    ) : (
                      "Confirm cancellation"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    id: null,
  });

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

  const handleTask = (type, values = addressValues, id = null) => {
    setTodo({ type, values, id });
  };

  const goBack = () => setTodo({ type: null, values: addressValues });

  const btnInactive = (e) => e.target.classList.add("account-address-inactive");
  const btnRemoveInactive = (e) =>
    e.target.classList.remove("account-address-inactive");

  async function handleAddress(address) {
    setLoading(true);
    const user = getCurrentUser();
    if (todo.type === "EDIT") {
      await axios
        .put(
          `${URL(api_endpoints.userOperations)}/update-address/${user.id}/${
            todo.id
          }`,
          address,
          {
            headers: { Authorization: getJwt() },
          }
        )
        .then(() => {
          const data = [...api.data];
          data.forEach((item) => {
            if (item.id === todo.id) item.addressDetails = { ...address };
          });
          setApi({ ...api, data });
          goBack();
          toast.info("Address is updated");
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
      setLoading(false);
      return;
    }

    await axios
      .put(`${URL(api_endpoints.userOperations)}/address/${user.id}`, address, {
        headers: { Authorization: getJwt() },
      })
      .then(({ data }) => {
        setApi({ ...api, data: [...api.data, data] });
        goBack();
        toast.info("Address saved successfully");
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
    setLoading(false);
  }

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
        toast.info("Default address updated");
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
        toast.info("Saved address removed");
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
                              handleTask("EDIT", item.addressDetails, item.id)
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
          <AddressFormContainer
            loading={loading}
            goBack={goBack}
            todo={todo}
            handleAddress={handleAddress}
          />
        )}
      </div>
    </FocusWrapper>
  );
}

function AddressFormContainer({ loading, goBack, todo, handleAddress }) {
  const submitBtnRef = useRef(null);

  useEffect(() => {
    if (submitBtnRef.current && todo.type === "EDIT")
      submitBtnRef.current.classList.remove("account-change-password-btn-grey");
  }, [todo.type]);

  return (
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
        <span>{todo.type === "EDIT" ? "Edit address" : "Add new address"}</span>
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
                ref={submitBtnRef}
                type="submit"
                disabled={loading}
                className={
                  !isValid || !dirty ? "account-change-password-btn-grey" : ""
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
