import React, { Component } from "react";

class OutOfStock extends Component {
  render() {
    const { handleOutOfStock, stock, loading } = this.props;
    return (
      <div className="out-of-stock-container filter-contain">
        <h5>Availability</h5>
        <input
          disabled={loading}
          checked={stock}
          onChange={handleOutOfStock}
          name="out-of-stock"
          type="checkbox"
        />
        <label htmlFor="out-of-stock">Include Out of Stock</label>
      </div>
    );
  }
}

export default OutOfStock;
