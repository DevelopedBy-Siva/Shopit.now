import React, { Component } from "react";

class PriceRange extends Component {
  state = {};
  render() {
    const { priceRange, handlePriceRange, loading } = this.props;

    return (
      <div className="price-range filter-contain">
        <h5>Price</h5>
        <h2>
          <span>$ </span>
          {priceRange}
        </h2>
        <div
          className={`price-range-input ${
            loading ? "price-range-input-wait" : ""
          }`}
        >
          <input
            style={loading ? { pointerEvents: "none" } : {}}
            disabled={loading}
            onChange={(e) => handlePriceRange(e.target.value)}
            value={priceRange}
            type="range"
            step="500"
            min="500"
            max="10000"
          />
        </div>
        <div className="price-range-values">
          <h4>
            <span>$ </span>100
          </h4>
          <h4>
            <span>$ </span>10000
          </h4>
        </div>
      </div>
    );
  }
}

export default PriceRange;
