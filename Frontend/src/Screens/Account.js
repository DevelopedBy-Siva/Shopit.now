import React, { useState } from "react";
import { FaTruck } from "react-icons/fa";
import { MdRemoveCircle, MdLocationOn, MdKey, MdClose } from "react-icons/md";
import ReactFocusLock from "react-focus-lock";

import "../css/account.css";
import { removeJwt } from "../services/LoginReg";

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
          <ButtonWrapper key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

function ButtonWrapper({ item }) {
  const [visible, setVisible] = useState(false);

  function toggle() {
    if (!item.redirect) setVisible(!visible);
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
      {visible && <item.comp toggle={toggle} />}
    </>
  );
}

function FocusWrapper({ toggle, children }) {
  return (
    <ReactFocusLock>
      <div className="account-screen-modal">
        <div className="account-screen-modal-overlay" onClick={toggle}></div>
        <div className="account-modal-content">{children}</div>
      </div>
    </ReactFocusLock>
  );
}

function ChangePassword({ toggle }) {
  return (
    <FocusWrapper toggle={toggle}>
      <div className="account-change-password">
        <ModalHeadingWrapper toggle={toggle}>
          Change Password
        </ModalHeadingWrapper>
      </div>
    </FocusWrapper>
  );
}

function DeleteAccount({ toggle }) {
  return (
    <FocusWrapper toggle={toggle}>
      <div className="account-delete-account">
        <ModalHeadingWrapper toggle={toggle}>
          Delete Account
        </ModalHeadingWrapper>
      </div>
    </FocusWrapper>
  );
}

function AddAddress({ toggle }) {
  return (
    <FocusWrapper toggle={toggle}>
      <div className="account-add-address">
        <ModalHeadingWrapper toggle={toggle}>Your Address</ModalHeadingWrapper>
      </div>
    </FocusWrapper>
  );
}

function ModalHeadingWrapper({ toggle, children }) {
  return (
    <div className="account-screen-modal-header">
      <h2>{children}</h2>
      <button onClick={toggle} className="account-screen-modal-close">
        <MdClose />
      </button>
    </div>
  );
}
