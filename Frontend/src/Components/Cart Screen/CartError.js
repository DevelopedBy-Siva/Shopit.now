import React, { Component } from "react";

class CartError extends Component {
  render() {
    return (
      <div className="cart-error-container">
        <h5>Sorry...Failed to get the cart right now...Try again later...</h5>
      </div>
    );
  }
}

export default CartError;
