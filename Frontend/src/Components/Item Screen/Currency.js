import React from "react";

export default function Currency({ curr = "" }) {
  const price = curr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <span
        style={{
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        }}
      >
        $
      </span>
      <h5 className="currency">{price}</h5>
    </>
  );
}
