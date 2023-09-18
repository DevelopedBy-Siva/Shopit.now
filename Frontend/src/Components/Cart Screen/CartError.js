import React, { Component } from "react";

class CartError extends Component {
  render() {
    return (
      <div className="cart-error-container">
        <h5>
          Sorry, we couldn't retrieve the cart at the moment. Please try again
          later.
        </h5>
      </div>
    );
  }
}

export default CartError;
