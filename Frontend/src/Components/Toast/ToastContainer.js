import React from "react";
import { TiTick } from "react-icons/ti";
import { IoInformationSharp, IoClose } from "react-icons/io5";

import toast from ".";
import "../../css/toast.css";
import Loader from "../Loader";

export default function ToastContainer({
  allowClose = true,
  wait = false,
  type = "info",
  message = "...",
}) {
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
      case "info":
        return { icon: <IoInformationSharp />, bg: "#3C90AB" };
      default:
        return { bg: "#343434" };
    }
  }
  const { icon, bg } = getType();

  return (
    <div className="toast-container" style={{ background: bg }}>
      {allowClose && (
        <IoClose className="close" onClick={() => toast.remove()} />
      )}
      {wait ? (
        <Loader
          style={{ width: "22px", height: "22px", marginRight: "15px" }}
        />
      ) : (
        <div className="icon" style={{ color: bg }}>
          {icon}
        </div>
      )}
      <p className="message">{message}</p>
    </div>
  );
}
