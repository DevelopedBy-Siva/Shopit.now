import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../api/api";
import { getJwt } from "../services/LoginReg";
import CartEmpty from "../Components/Cart Screen/CartEmpty";
import CartItems from "../Components/Cart Screen/CartItems";
import ProceedOrder from "../Components/Cart Screen/ProceedOrder";
import SaveForLater from "../Components/Cart Screen/SaveForLater";
import CartError from "../Components/Cart Screen/CartError";
import CartLoadin from "../Components/Cart Screen/CartLoadin";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../State Management/MappingStates";
import "../css/cart.css";

class Cart extends Component {
  state = {
    len: 0,
    loading: false,
    error: false,
    orderConfirmation: true,
    cart: [],
    proceedLoading: false,
    unavailable: [],
  };

  componentDidMount() {
    const { cartFetch, userCart } = this.props;
    const { loading, error } = cartFetch;
    this.props.paymentOver();
    this.setState({ loading, error, cart: userCart, len: userCart.length });
  }

  componentDidUpdate(prevProps, prevState) {
    const { userCart, cartFetch } = this.props;
    const { loading, error } = cartFetch;
    if (prevProps.userCart !== userCart) {
      this.setState({ cart: userCart, len: userCart.length });
    }
    if (prevProps.cartFetch !== cartFetch) {
      this.setState({ loading, error });
    }
  }

  proceedOrder = () => {
    const { cart } = this.state;
    this.checkStock(cart);
  };
  checkStock = (cart) => {
    const { unavailable } = this.state;
    let newUnavailable = [...unavailable];
    this.setState({ proceedLoading: true });
    const size = cart.length;
    let count = 0;
    cart.forEach(async (i) => {
      const { productId, itemCount } = i;
      await axios
        .get(
          `${URL(API_ENDPOINT.userCart)}/check-stock/${productId}/${itemCount}`,
          {
            headers: {
              Authorization: getJwt(),
            },
          }
        )
        .then(({ data }) => {
          if (!data) newUnavailable = [...newUnavailable, i.productId];
          count++;
        })
        .catch(() => {
          count++;
          newUnavailable = [...newUnavailable, i.productId];
        });
      if (count === size) {
        this.setState({ unavailable: newUnavailable, proceedLoading: false });
        if (newUnavailable.length === 0) {
          this.orderScreen(cart);
        }
      }
    });
  };

  removeOutofStock = (id) => {
    const { unavailable } = this.state;
    const updated = unavailable.filter((i) => i !== id);
    this.setState({ unavailable: updated });
  };

  orderScreen = (cart) => {
    this.props.paymentStarted(cart, "CART");
    this.props.history.push("/order-processing");
  };

  render() {
    const { len, loading, error, unavailable, proceedLoading } = this.state;
    return (
      <>
        <div className="cart-container">
          <div className="cart-left-container">
            <h2>Shopping Cart</h2>
            {loading ? (
              <CartLoadin />
            ) : error ? (
              <CartError />
            ) : len < 1 ? (
              <CartEmpty />
            ) : (
              <CartItems
                removeOutofStock={this.removeOutofStock}
                unavailable={unavailable}
              />
            )}
          </div>
          {len > 0 && (
            <ProceedOrder
              proceedLoading={proceedLoading}
              unavailable={unavailable}
              proceedOrder={this.proceedOrder}
            />
          )}
        </div>
        <SaveForLater />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
