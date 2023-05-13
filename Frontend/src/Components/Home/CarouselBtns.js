import React from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

function NextArrow(props) {
  const { style, onClick } = props;
  return (
    <button
      className={`btn-right ${onClick ? "" : "remove-btn"}`}
      style={style}
      onClick={onClick}
    >
      <FaCaretRight className="btn-lr-icons" />
    </button>
  );
}

function PrevArrow(props) {
  const { style, onClick } = props;
  return (
    <button
      className={`btn-left ${onClick ? "" : "remove-btn"}`}
      style={style}
      onClick={onClick}
    >
      <FaCaretLeft className="btn-lr-icons" />
    </button>
  );
}

export { NextArrow, PrevArrow };
