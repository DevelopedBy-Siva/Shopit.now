import React, { Component } from "react";
import { connect } from "react-redux";
import * as services from "../../services/LoginReg";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../State Management/MappingStates";
import { FaShoppingCart, FaCaretSquareRight } from "react-icons/fa";
import Lottie from "lottie-react";
import loadIcon from "../../animations/smallLoad.json";

class AddNowBtn extends Component {
  state = {
    success: false,
    proceed: false,
    productServer: {
      loading: false,
      error: false,
    },
    hideSuccess: false,
    outOfStock: false,
  };

  componentDidMount() {
    const user = services.getCurrentUser();
    const { cartFetch } = this.props;
    const fetchSuccess = cartFetch.error ? false : true;
    if (fetchSuccess) this.setState({ proceed: true });
    const success = user && fetchSuccess ? true : false;
    const { cartServer } = this.props;
    this.stockCheck();
    this.props.paymentOver();
    this.setState({ success, productServer: cartServer });
  }

  componentDidUpdate(prevProps, prevState) {
    const productServer = this.props.cartServer;
    if (prevProps.cartServer !== productServer) {
      const { error } = productServer;
      if (error) {
        this.setState({ hideSuccess: true });
        setTimeout(() => {
          this.setState({ hideSuccess: false });
        }, 2000);
      }
      this.stockCheck();
      this.setState({ productServer });
    }
    if (prevProps.userCart !== this.props.userCart) {
      this.stockCheck();
    }
  }

  handleAdd = () => {
    const { product, addItem } = this.props;
    if (!this.state.outOfStock) {
      if (this.state.success) {
        const data = {
          id: 1,
          productId: product.id,
          productName: product.title,
          totalPrice: product.price,
          itemCount: 1,
        };
        this.setState({ proceed: true });
        addItem(data);
      } else if (!services.getCurrentUser()) this.redirectToThePage();
      else if (!this.props.cartFetch.error) this.setState({ proceed: true });
      else return "";
    } else return "";
  };

  redirectToThePage = () => {
    this.props.handleLogin();
  };

  stockCheck = () => {
    const cart = this.props.userCart;
    const { id, inStock } = this.props.product;
    const found = cart.find((i) => i.productId === id);
    let available = 0;
    if (found) {
      const { itemCount } = found;
      available = inStock - itemCount;
    } else {
      available = inStock;
    }
    if (available > 0) this.setState({ outOfStock: false });
    else this.setState({ outOfStock: true });
  };

  handleBuy = () => {
    const { handleBuyNow, product } = this.props;
    if (!services.getCurrentUser()) this.redirectToThePage();
    else {
      const data = [
        {
          itemCount: 1,
          productId: product.id,
          productName: product.title,
          totalPrice: product.price,
        },
      ];
      this.props.paymentStarted(data, "PRODUCT");
      handleBuyNow();
    }
  };

  render() {
    const { proceed, hideSuccess, productServer, outOfStock } = this.state;
    const { loading } = productServer;
    return (
      <div className="item-btn-container">
        <div
          className={
            !proceed
              ? "disable-order"
              : outOfStock
              ? "out-of-stock-btn-disable"
              : loading
              ? "disable-order"
              : ""
          }
          onClick={this.handleAdd}
        >
          <FaShoppingCart className="btn-icons" />
          <button>Add to Cart</button>
          {loading ? (
            <Lottie className="item-btn-loading" animationData={loadIcon} />
          ) : hideSuccess ? (
            <span>Cannot add product right now</span>
          ) : (
            ""
          )}
          {!proceed && <h5>Cannot add product right now..try again later</h5>}
        </div>
        <div
          className={outOfStock ? "out-of-stock-btn-disable" : ""}
          onClick={this.handleBuy}
        >
          <FaCaretSquareRight className="btn-icons-buy" />
          <button>Buy Now</button>
        </div>
        {outOfStock && <h4>Out Of Stock</h4>}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNowBtn);
