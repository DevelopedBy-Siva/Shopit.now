import React, { Component } from "react";
import { FaCircle } from "react-icons/fa";

class UserOrderData extends Component {
  getOrderDate = (d) => {
    const date = new Date(d);
    const preview =
      date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
    return preview;
  };

  pendingStyle = {
    color: "rgb(255, 174, 0)",
    backgroundColor: "rgb(255, 234, 197)",
  };

  shippedStyle = {
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgb(0, 130, 11)",
    pointerEvents: "none",
  };

  dispatchedStyle = {
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgb(255, 81, 0)",
  };

  approveStyle = {
    backgroundColor: "rgb(0, 132, 255)",
  };

  shipStyle = {
    backgroundColor: "rgb(128, 0, 255)",
  };

  render() {
    const { adminSubmit, order, approveOrder, shipOrder } = this.props;
    const {
      id,
      itemDetails,
      modeOfPayment,
      orderDate,
      deliveryDate,
      orderStatus,
    } = order;
    const { productName, itemCount, totalPrice } = itemDetails;
    const { dispatched, shipped } = orderStatus;
    const { modeOfPayment: mode } = modeOfPayment;
    return (
      <>
        <td>{id}</td>
        <td>{productName}</td>
        <td>{itemCount}</td>
        <td>
          <span>$</span> {totalPrice}
        </td>
        <td>{this.getOrderDate(orderDate)}</td>
        <td>{this.getOrderDate(deliveryDate)}</td>
        <td>{mode}</td>
        <td>
          {!dispatched ? (
            <span style={this.pendingStyle}>Pending</span>
          ) : shipped ? (
            <span style={this.shippedStyle}>Shipped</span>
          ) : (
            <span style={this.dispatchedStyle}>Dispatched</span>
          )}
        </td>
        <td>
          {!dispatched ? (
            <span
              className={`${adminSubmit ? "disable-admin-btn" : ""}`}
              onClick={() => approveOrder(id)}
              style={this.approveStyle}
            >
              Approve
            </span>
          ) : !shipped ? (
            <span
              className={`${adminSubmit ? "disable-admin-btn" : ""}`}
              onClick={() => shipOrder(id)}
              style={this.shipStyle}
            >
              Ship
            </span>
          ) : (
            <FaCircle />
          )}
        </td>
      </>
    );
  }
}

export default UserOrderData;
