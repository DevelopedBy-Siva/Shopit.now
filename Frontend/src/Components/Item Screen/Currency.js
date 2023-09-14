import React from "react";

export default function Currency({ curr = "" }) {
  const price = curr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <span>$</span>
      <h5 className="currency">{price}</h5>
      <span
        style={{
          display: "inline-block",
          height: "fit-content",
          marginTop: "auto",
        }}
      >
        .00
      </span>
    </>
  );
}
