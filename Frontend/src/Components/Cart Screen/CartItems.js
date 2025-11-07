import React, { Component } from "react";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../State Management/MappingStates";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { BiMinus, BiPlus } from "react-icons/bi";
import Currency from "../Item Screen/Currency";

class CartItems extends Component {
  state = {
    userCart: [],
    cartServer: {
      loading: false,
      error: false,
      success: false,
    },
    loadingIndex: null,
    errorIndex: null,
    openGreenerOptions: [],
  };

  componentDidMount() {
    const { userCart, cartServer } = this.props;
    this.setState({ userCart, cartServer });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userCart !== this.props.userCart) {
      this.setState({ userCart: this.props.userCart });
    }
    if (prevProps.cartServer !== this.props.cartServer) {
      if (!this.props.cartServer.loading) this.setState({ loadingIndex: null });
      if (this.props.cartServer.success) this.setState({ errorIndex: null });
      this.setState({ cartServer: this.props.cartServer });
    }
  }

  handleIncrement = (item, index, e) => {
    e.currentTarget.blur();
    this.setState({ loadingIndex: index, errorIndex: index });
    this.props.incrementitem(item);
  };
  handleDecrement = (item, index, e) => {
    e.currentTarget.blur();
    this.setState({ loadingIndex: index, errorIndex: index });
    this.props.decrementitem(item);
  };
  handleDelete = (id, index, e) => {
    if (e) e.currentTarget.blur();
    if (index >= 0) this.setState({ loadingIndex: index, errorIndex: index });
    this.props.removeItem(id);
  };

  handleSaveForLater = (item, index, e) => {
    if (e) e.currentTarget.blur();
    this.props.removeOutofStock();
    this.setState({ loadingIndex: index, errorIndex: index });
    this.props.moveToSaveLater(item);
  };

  checkUnavailable = (id) => {
    const check = this.props.unavailable.includes(id);
    return check;
  };

  toggleGreenerOption = (index) => {
    this.setState((prev) => {
      const isOpen = prev.openGreenerOptions.includes(index);
      return {
        openGreenerOptions: isOpen
          ? prev.openGreenerOptions.filter((i) => i !== index)
          : [...prev.openGreenerOptions, index],
      };
    });
  };

  render() {
    const { userCart, cartServer, errorIndex, loadingIndex } = this.state;
    const { insight } = this.props;
    const { loading, error } = cartServer;
    return (
      <>
        {userCart.map((item, index) => {
          const recommendations =
            insight && insight.recommendations ? insight.recommendations : [];

          const suggestion = recommendations.find(
            (rec_item) => rec_item?.original?.id === item?.productId
          )?.suggested;

          return (
            <div className="cart-item-main-container" key={index}>
              {loading && loadingIndex === index ? (
                <div className="cover-item-operation" />
              ) : (
                ""
              )}
              <div className="purchase-item-container">
                <div className="purchase-item-sub-container">
                  <div className="purchase-container">
                    <h3>
                      <Link
                        className="purchase-product-redirect-link"
                        to={`/products/${item.productId}`}
                      >
                        {item.productName.toLowerCase()}
                      </Link>
                    </h3>
                    <h4>
                      No of items: <span>{item.itemCount}</span>
                    </h4>
                  </div>
                  <div className="item-increase-container">
                    <button
                      disabled={
                        this.checkUnavailable(item.productId)
                          ? true
                          : item.available
                          ? false
                          : true
                      }
                      className={loading ? "disable-btn-loading" : ""}
                      onClick={(e) => this.handleIncrement(item, index, e)}
                    >
                      <BiPlus className="icon" />
                    </button>
                    <button
                      disabled={loading}
                      className={loading ? "disable-btn-loading" : ""}
                      onClick={(e) => this.handleDecrement(item, index, e)}
                    >
                      <BiMinus className="icon" />
                    </button>
                  </div>
                  <div className="item-price">
                    <Currency curr={item.totalPrice} />
                  </div>
                </div>
                <div className="item-operations">
                  <button
                    onClick={(e) => this.handleSaveForLater(item, index, e)}
                  >
                    Save for later
                  </button>
                  <button
                    onClick={(e) => this.handleDelete(item.productId, index, e)}
                  >
                    Delete
                  </button>
                </div>
                {error && errorIndex === index ? (
                  <h5>Server error occured.Try again later</h5>
                ) : (
                  ""
                )}
                {(this.checkUnavailable(item.productId) || !item.available) && (
                  <span className="out-of-stock">Out of Stock</span>
                )}
                {suggestion && suggestion.co2_saved_kg > 0 && (
                  <div className="greener-options-container">
                    <button onClick={() => this.toggleGreenerOption(index)}>
                      🌿 View Greener Option
                    </button>
                    <ul
                      className={`content ${
                        this.state.openGreenerOptions.includes(index)
                          ? "open"
                          : ""
                      }`}
                    >
                      <li>◼</li>
                      <li>
                        <b style={{ textTransform: "capitalize" }}>
                          {suggestion.title}
                        </b>{" "}
                        reduces your footprint by{" "}
                        <b>{suggestion.co2_saved_kg} kg</b> CO₂ and enjoy a
                        greener option with an eco score of{" "}
                        <b>{suggestion.eco_score}/10</b>
                        {". ( "}
                        <Link to={`/products/${suggestion.id}`}>
                          Explore this swap
                        </Link>
                        {" )"}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItems);
