import React, { Component } from "react";

class AdProducts extends Component {
  state = {};
  render() {
    const { handleAdInitiate } = this.props;
    const { productName, thumbnail, productId } = this.props.product;
    const imgUrl = `data:${thumbnail.type};base64,${thumbnail.picByte}`;

    return (
      <div className="ad-product-sub-container">
        <div className="ad-product-sub-container-details">
          <img src={imgUrl} alt="advertisements" />
          <h5>{productName}</h5>
        </div>
        <div className="ad-product-sub-container-btn">
          <button onClick={() => handleAdInitiate(productId)}>Advertise</button>
        </div>
      </div>
    );
  }
}

export default AdProducts;
