import React, { Component } from "react";
import StarRatings from "react-star-ratings";
import Currency from "../Item Screen/Currency";

class ProductDetails extends Component {
  render() {
    const { data, handleProduct } = this.props;
    const { thumbnail, name, id, rating, amount, raters, available, trending } =
      this.props.data;
    const imgUrl = `data:${thumbnail.type};base64,${thumbnail.picByte}`;
    return (
      <div onClick={() => handleProduct(id)} className="each-search">
        {trending && available && (
          <span className="product-is-trending">Trending</span>
        )}
        {!available && (
          <div className="not-available">
            <span>Out of Stock</span>
          </div>
        )}
        <div className="search-image">
          <img src={imgUrl} alt={name} />
        </div>
        <div className="each-search-details">
          <h5 className="each-search-name">{data.name}</h5>
          <div className="star-rating">
            <StarRatings
              starRatedColor="orange"
              rating={rating}
              numberOfStars={5}
              starDimension="15px"
              starSpacing="0px"
            />
            {raters !== 0 && <span>{raters}</span>}
          </div>
          <div className="each-search-currency">
            <Currency curr={amount} />
          </div>
        </div>
      </div>
    );
  }
}

export default ProductDetails;
