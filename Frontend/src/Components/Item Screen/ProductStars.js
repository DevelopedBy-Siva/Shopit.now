import React from "react";
import StarRatings from "react-star-ratings";

function ProductStars({ totalReviews, showRaters, ...rest }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <StarRatings name="rating" {...rest} />
      {showRaters && (
        <div
          style={{
            display: "block",
            fontSize: "13px",
            marginLeft: "5px",
            marginTop: "0px",
          }}
        >{` (${totalReviews})`}</div>
      )}
    </div>
  );
}

export default ProductStars;
