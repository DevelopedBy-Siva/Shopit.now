import React, { Component } from "react";
import BtnContainer from "../../Components/Order Process/BtnContainer";
import PaymentInput from "../../Components/Order Process/PaymentInput";
import paymentImg from "../../Images/card_logo.webp";
import { connect } from "react-redux";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../State Management/MappingStates";

class OrderPayment extends Component {
  state = {
    paymentMode: null,
    savedCard: null,
  };

  componentDidMount() {
    const { setProgress, paymentBegan } = this.props;
    if (paymentBegan.savedCard) {
      this.setState({ savedCard: paymentBegan.savedCard });
    }
    if (paymentBegan.paymentMode !== "") {
      this.setState({ paymentMode: paymentBegan.paymentMode });
    }
    setProgress(1);
  }

  componentWillUnmount() {
    const { setProgress } = this.props;
    setProgress(0);
  }

  handleContinue = () => {
    const { paymentMode, savedCard } = this.state;
    this.props.paymentMode(savedCard, paymentMode);
    this.props.history.push("/order-processing/success");
  };

  handleGoBack = () => {
    this.props.history.replace("/order-processing");
  };

  paymentModeHandle = (e) => {
    this.setState({ paymentMode: e.target.value });
  };

  handleCard = (value) => {
    this.setState({ savedCard: value });
  };

  render() {
    const { paymentMode, savedCard } = this.state;
    return (
      <div className="payment-mode-container">
        <h2>Select a payment method</h2>
        <div className="payment-mode">
          <div>
            <input
              onChange={this.paymentModeHandle}
              type="radio"
              name="payment"
              value="CARD"
              checked={paymentMode === "CARD" ? true : false}
            />
            <label htmlFor="payment">Add Debit/Credit/ATM Card</label>
          </div>
          {paymentMode === "CARD" ? (
            <div className="card-payment">
              <img src={paymentImg} alt="card-payment" />
              <div className="payment-input">
                <PaymentInput
                  savedCard={savedCard}
                  handleCard={this.handleCard}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div>
            <input
              onChange={this.paymentModeHandle}
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMode === "COD" ? true : false}
            />
            <label htmlFor="payment">Pay on Delivery</label>
          </div>
        </div>
        <BtnContainer
          disable={
            !paymentMode
              ? true
              : paymentMode === "COD"
              ? false
              : paymentMode === "CARD" && savedCard
              ? false
              : true
          }
          disableBtn={
            !paymentMode
              ? "disable-continue-btn"
              : paymentMode === "COD"
              ? ""
              : paymentMode === "CARD" && savedCard
              ? ""
              : "disable-continue-btn"
          }
          handleContinue={this.handleContinue}
          handleGoBack={this.handleGoBack}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPayment);
