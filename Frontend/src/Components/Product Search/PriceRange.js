import React, { Component } from "react";
import Currency from "../Item Screen/Currency";

class PriceRange extends Component {
  state = {};
  render() {
    const { priceRange, handlePriceRange, loading } = this.props;

    return (
      <div className="price-range filter-contain">
        <h5>Price</h5>
        <div className="price-range-display">
          <Currency curr={priceRange} />
        </div>
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
            step="100"
            min="0"
            max="10000"
          />
        </div>
        <div className="price-range-values">
          <div className="price-range-values-label">
            <Currency curr={0} />
          </div>
          <div className="price-range-values-label">
            <Currency curr={10000} />
          </div>
        </div>
      </div>
    );
  }
}

export default PriceRange;
