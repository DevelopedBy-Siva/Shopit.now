import React, { Component } from "react";
import StarRatings from "react-star-ratings";

class ProductStars extends Component {
  total_reviews = this.props.totalReviews;
  show_number_of_raters = this.props.showRaters;

  render() {
    const { ...rest } = this.props;
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <StarRatings name="rating" {...rest} />
        {this.show_number_of_raters && (
          <div
            style={{
              display: "block",
              fontSize: "13px",
              marginLeft: "5px",
              marginTop: "0px",
            }}
          >{` (${this.total_reviews})`}</div>
        )}
      </div>
    );
  }
}

export default ProductStars;
