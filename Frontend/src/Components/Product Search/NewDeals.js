import React, { Component } from "react";

class NewDeals extends Component {
  render() {
    const { handleTodaysDeal, deal, loading } = this.props;
    return (
      <div className="new-deals-container filter-contain">
        <h5>Deals</h5>
        <input
          disabled={loading}
          onChange={handleTodaysDeal}
          checked={deal}
          name="new-deals"
          type="checkbox"
        />
        <label htmlFor="new-deals">Today's Deals</label>
      </div>
    );
  }
}

export default NewDeals;
