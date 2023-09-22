import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Lottie from "lottie-react";
import successAnim from "../../animations/success.json";
import trackingAnim from "../../animations/tracking.json";
import shopAnim from "../../animations/shopmore.json";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../State Management/MappingStates";
import "../../css/order-placed.css";

class OrderPlacedMsg extends Component {
  componentWillUnmount() {
    const { paymentSuccessEnd } = this.props;
    paymentSuccessEnd();
  }

  handleForwardToOrder = () => {
    this.props.history.push("/account/orders?order=_");
  };

  handleForwardToShoping = () => {
    this.props.history.push("/");
  };

  render() {
    const { success } = this.props.paymentBegan;
    if (!success) return <Redirect to="/" />;
    return (
      <div className="order-placed-success-msg">
        <Lottie
          loop={false}
          className="order-placed-success-anim"
          animationData={successAnim}
        />
        <h5>Order Successfully Placed</h5>
        <div className="order-placed-sub">
          <div
            onClick={this.handleForwardToOrder}
            className="forward-container"
          >
            <div>
              <Lottie
                loop={true}
                className="forward-anim"
                animationData={trackingAnim}
              />
            </div>
            <h4>Track Order</h4>
          </div>
          <div
            onClick={this.handleForwardToShoping}
            className="forward-container"
          >
            <div>
              <Lottie
                loop={true}
                className="forward-anim"
                animationData={shopAnim}
              />
            </div>
            <h4>Continue Shopping</h4>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPlacedMsg);
