import React, { Component } from "react";
import ProductStars from "./ProductStars";
import Currency from "./Currency";

class ProductDetails extends Component {
  render() {
    const { overallRating, product, ...rest } = this.props;

    let totalRaters = 0;
    if (product && product.productRatings && product.productRatings.userReviews)
      totalRaters = product.productRatings.userReviews.length;

    return (
      <>
        <div className="details-container">
          <h2>{product.title}</h2>
          <ProductStars
            rating={overallRating}
            totalReviews={totalRaters}
            numberOfStars={5}
            starRatedColor="orange"
            {...rest}
          />
          <div className="product-currency">
            <Currency curr={product.price} />
          </div>
        </div>
      </>
    );
  }
}

export default ProductDetails;
