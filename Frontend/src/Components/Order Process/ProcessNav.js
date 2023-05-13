import React, { Component } from "react";
import { FaShoppingCart, FaAddressBook, FaCheckSquare } from "react-icons/fa";
import logo from "../../Icons/logo-now";

class ProcessNav extends Component {
  render() {
    const { progress } = this.props;
    return (
      <div className="order-process-nav">
        <div className="order-process-nav-sub1">
          <h1>Shopit</h1>
          {logo}
        </div>
        <div className="order-process-nav-sub2">
          <div className="progress-bar">
            <div className="progress-bar" />
            <div
              className={`address-progress ${
                progress > 0 ? "progress-visible" : ""
              }`}
            />
            <div
              className={`delivery-progress ${
                progress > 1 ? "progress-visible" : ""
              }`}
            />
          </div>
          <FaAddressBook className={progress >= 0 ? "progress-color" : ""} />
          <FaShoppingCart className={progress >= 1 ? "progress-color" : ""} />
          <FaCheckSquare className={progress >= 2 ? "progress-color" : ""} />
        </div>
      </div>
    );
  }
}

export default ProcessNav;
