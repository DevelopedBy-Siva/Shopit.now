import React, { Component } from "react";
import { connect } from "react-redux";
import BtnContainer from "../../Components/Order Process/BtnContainer";
import Lottie from "lottie-react";
import loadingIcon from "../../animations/loading.json";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../State Management/MappingStates";
import Currency from "../Item Screen/Currency";

class OrderSuccess extends Component {
  state = {
    cart: [],
    loading: false,
    totalPayable: 0,
    serverLoading: false,
    serverError: false,
    serverSuccess: false,
  };

  componentDidMount() {
    const { setProgress } = this.props;
    setProgress(2);
    this.getCart();
  }

  componentDidUpdate(prevProps, prevState) {
    const { paymentBegan, orderCompleted, clearCart } = this.props;
    if (prevProps.paymentBegan !== paymentBegan) {
      const { serverLoading, serverError, serverSuccess, fromWhere } =
        paymentBegan;
      if (serverSuccess) {
        orderCompleted();
        if (fromWhere === "CART") {
          clearCart("CART");
        }
        this.props.history.replace("/order-placed");
      }
      this.setState({ serverError, serverLoading, serverSuccess });
    }
  }

  getCart = () => {
    const { paymentBegan } = this.props;
    const cart = paymentBegan.orders;
    let totalPayable = 0;
    cart.forEach((i) => (totalPayable += parseInt(i.totalPrice)));
    if (cart.length) this.setState({ cart, loading: true, totalPayable });
  };

  componentWillUnmount() {
    const { setProgress } = this.props;
    setProgress(1);
  }

  handleContinue = () => {
    const { orders, paymentMode, paymentAddress } = this.props.paymentBegan;
    const { addressDetails } = paymentAddress;
    const { houseNo, town, city, state, pincode } = addressDetails;
    const submitData = orders.map((i) => {
      const itemDetails = {
        productName: i.productName,
        productId: i.productId,
        itemCount: i.itemCount,
        totalPrice: i.totalPrice,
      };
      const modeOfPayment = {
        modeOfPayment: paymentMode,
      };
      const billingAddress = {
        address: `${houseNo}, ${town}, ${city}, ${state}, ${pincode}`,
      };
      return {
        itemDetails,
        modeOfPayment,
        billingAddress,
      };
    });
    this.props.submitOrders(submitData);
  };

  handleGoBack = () => {
    this.props.history.replace("/order-processing/payment");
  };
  render() {
    const { serverLoading, serverSuccess, cart, loading, totalPayable } =
      this.state;
    return (
      <div className="order-sucess-container">
        <h2>Order Confirmation</h2>
        {!loading ? (
          <Lottie animationData={loadingIcon} className="order-data-loading" />
        ) : (
          <div>
            <div className="order-sucess-item-details-wrapper">
              <table className="order-sucess-item-details-container">
                <tbody>
                  {cart.map((i, index) => (
                    <tr key={index} className="order-success-item-details">
                      <td>{i.productName.toLowerCase()}</td>
                      <td>
                        <span style={{ fontSize: "10px" }}>X</span>{" "}
                        {i.itemCount}
                      </td>
                      <td className="order-sucess-item-details-currency">
                        <Currency curr={i.totalPrice} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="amount-payable">
              <span className="amount-payable-label">Total Price:</span>
              <div className="amount-payable-currency">
                <Currency curr={totalPayable} />
              </div>
            </div>
            <BtnContainer
              disableBack={serverLoading || serverSuccess ? true : false}
              disable={serverLoading || serverSuccess ? true : false}
              disableBtn={
                serverLoading || serverSuccess ? "disable-continue-btn" : ""
              }
              load={true}
              handleContinue={this.handleContinue}
              handleGoBack={this.handleGoBack}
            />
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSuccess);
