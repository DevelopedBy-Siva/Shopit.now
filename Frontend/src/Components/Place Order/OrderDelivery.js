import axios from "axios";
import React, { Component } from "react";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";
import * as service from "../../services/LoginReg";
import Lottie from "lottie-react";
import loadingIcon from "../../animations/loading.json";
import OrderDeliveryAddress from "./OrderDeliveryAddress";
import { connect } from "react-redux";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../State Management/MappingStates";
import toast from "../Toast";

class OrderDelivery extends Component {
  constructor(props) {
    super(props);
    this.btnRef = React.createRef();
  }

  state = {
    addresses: [],
    loading: false,
    error: false,
    selectedAddress: null,
    onSubmission: false,
    onSubmissionError: false,
    serverErrorVisible: false,
  };

  componentDidMount() {
    this.getAddress();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.error !== this.state.error) {
      if (this.state.error) {
        this.setState({ serverErrorVisible: true });
        setTimeout(() => this.setState({ serverErrorVisible: false }), 4000);
      }
    }
    if (this.state.onSubmissionError) {
      setTimeout(() => this.setState({ onSubmissionError: false }), 4000);
    }
  }

  getAddress = async () => {
    const { id } = service.getCurrentUser();
    this.setState({ loading: true, error: false });
    await axios
      .get(`${URL(API_ENDPOINT.userOperations)}/address/${id}`, {
        headers: {
          Authorization: service.getJwt(),
        },
      })
      .then(({ data }) => {
        this.setAddress(data);
      })
      .catch(() => {
        this.setState({ loading: false });
        toast.error("Something went wrong. Failed to get address");
      });
  };

  setAddress = (data) => {
    let addresses = [];
    if (data) {
      addresses = data.map((i) => {
        if (i.defaultAddress) {
          this.setState({ selectedAddress: i });
        }
        return i;
      });
      const { paymentAddress } = this.props.paymentBegan;
      if (paymentAddress) {
        this.setState({ selectedAddress: paymentAddress });
      }
    }
    this.setState({ addresses, loading: false });
  };

  addAddress = (values) => {
    this.btnRef.current.blur();
    this.addAddressToServer(values);
  };

  addAddressToServer = async (address) => {
    const { id } = service.getCurrentUser();
    this.setState({ onSubmission: true, onSubmissionError: false });
    await axios
      .put(`${URL(API_ENDPOINT.userOperations)}/address/${id}`, address, {
        headers: { Authorization: service.getJwt() },
      })
      .then(({ data }) => {
        this.setState({ onSubmission: false, addresses: [{ ...data }] });
        toast.info("Address added successfully");
      })
      .catch(() => {
        this.setState({ onSubmission: false, onSubmissionError: true });
        toast.error("Something went wrong. Failed to add address");
      });
  };

  handleContinue = () => {
    this.props.paymentAddress(this.state.selectedAddress);
    this.props.history.push("/order-processing/payment");
  };

  handleSelection = (i) => {
    this.setState({ selectedAddress: i });
  };

  render() {
    const { selectedAddress, loading, addresses, onSubmission } = this.state;
    return (
      <div className="order-delivery-container">
        {addresses.length > 0 && <h2>Select Delivery Address</h2>}
        {loading ? (
          <Lottie
            animationData={loadingIcon}
            className="address-data-loading"
          />
        ) : addresses.length === 0 ? (
          <div className="no-address">
            <h5>Add address to continue</h5>
            <OrderDeliveryAddress
              btnRef={this.btnRef}
              addAddress={this.addAddress}
              onSubmission={onSubmission}
            />
          </div>
        ) : (
          <div className="order-delivery-sub-container">
            {addresses.map((i, index) => (
              <div
                onClick={() => this.handleSelection(i)}
                className={`each-address ${
                  selectedAddress
                    ? selectedAddress.id === i.id
                      ? "selected-address"
                      : ""
                    : ""
                }`}
                key={index}
              >
                {i.addressDetails.houseNo}, {i.addressDetails.town},{" "}
                {i.addressDetails.city}, {i.addressDetails.state},{" "}
                {i.addressDetails.pincode}
              </div>
            ))}
          </div>
        )}
        <p>
          <button
            disabled={!selectedAddress ? true : false}
            onClick={this.handleContinue}
            className={`continue-btn ${
              !selectedAddress ? "disable-continue-btn" : ""
            }`}
          >
            Continue
          </button>
        </p>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDelivery);
