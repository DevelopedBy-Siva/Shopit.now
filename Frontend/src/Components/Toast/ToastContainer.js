import React from "react";
import { TiTick } from "react-icons/ti";
import { IoInformationSharp, IoClose } from "react-icons/io5";

import toast from ".";
import "../../css/toast.css";

export default function ToastContainer({ type = "info", message = "..." }) {
  function getType() {
    switch (type) {
      case "success":
        return {
          icon: <TiTick />,
          bg: "#2d9d41",
        };
      case "error":
        return {
          icon: <IoClose />,
          bg: "#FF2B20",
        };
      default:
        return { icon: <IoInformationSharp />, bg: "#3C90AB" };
    }
  }
  const { icon, bg } = getType();

  return (
    <div className="toast-container" style={{ background: bg }}>
      <IoClose className="close" onClick={() => toast.remove()} />
      <div className="icon" style={{ color: bg }}>
        {icon}
      </div>
      <p className="message">{message}</p>
    </div>
  );
}
