import React from "react";
import { FaTruck } from "react-icons/fa";
import { MdRemoveCircle, MdLocationOn, MdKey } from "react-icons/md";

import "../css/account.css";

const operations = [
  {
    title: "Orders",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    ico: <FaTruck />,
  },
  {
    title: "Your Address",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    ico: <MdLocationOn />,
  },
  {
    title: "Change Password",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    ico: <MdKey />,
  },
  {
    title: "Delete Account",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
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
