import React from "react";
import { FaTruck } from "react-icons/fa";
import { MdRemoveCircle, MdLocationOn, MdKey } from "react-icons/md";

import "../css/account.css";

const operations = [
  {
    title: "Orders",
    desc: "View your order status and history",
    ico: <FaTruck />,
  },
  {
    title: "Your Address",
    desc: "Add a new shipping address to your account",
    ico: <MdLocationOn />,
  },
  {
    title: "Change Password",
    desc: "Update your account password",
    ico: <MdKey />,
  },
  {
    title: "Delete Account",
    desc: "Permanently remove your account and data",
    ico: <MdRemoveCircle />,
  },
];

export default function Account() {
  return (
    <div className="user-account-container contain">
      <div className="account-header">
        <h1>Your Account</h1>
        <div className="account-logout">
          <button>Logout</button>
        </div>
      </div>
      <div className="operation-container">
        {operations.map((item, index) => (
          <div key={index} className="account-opr">
            {item.ico}
            <div className="account-opr-wrapper">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
