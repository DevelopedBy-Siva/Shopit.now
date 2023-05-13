import React from "react";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NextArrow(props) {
  const { style, onClick } = props;
  return (
    <button
      className={`btn-right ${onClick ? "" : "remove-btn"}`}
      style={style}
      onClick={onClick}
    >
      <FontAwesomeIcon className="btn-lr-icons" size="3x" icon={faCaretRight} />
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
      <FontAwesomeIcon className="btn-lr-icons" size="3x" icon={faCaretLeft} />
    </button>
  );
}

export { NextArrow, PrevArrow };
