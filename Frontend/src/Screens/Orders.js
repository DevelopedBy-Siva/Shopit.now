import React, { Component } from "react";
import { FaCircle } from "react-icons/fa";
import axios from "axios";
import * as service from "../services/LoginReg";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../api/api";
import Lottie from "lottie-react";
import empty from "../animations/empty.json";
import serverAnim from "../animations/server-error.json";
import loadingAnim from "../animations/loading.json";
import cancelLoadingAnim from "../animations/dataload.json";
import "../css/orders.css";
import Cancellation from "../Components/Home/Cancellation";

const allStatus = [
  "Cancelled",
  "Processing",
  "Dispatched",
  "Shipped",
  "Delivered",
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
class Orders extends Component {
  state = {
    loading: true,
    orders: [],
    error: false,
    orderDetails: false,
    visibleIndex: null,
    trackVisible: false,
    trackVisibleIndex: null,
    cancelOrder: false,
    cancelLoading: false,
    cancelError: false,
    cancelId: null,
  };

  componentDidMount() {
    this.getProducts();
  }

  getProducts = async () => {
    const { id } = service.getCurrentUser();
    this.setState({ error: false });
    await axios
      .get(`${URL(API_ENDPOINT.userOrders)}/${id}`, {
        headers: {
          Authorization: service.getJwt(),
        },
      })
      .then(({ data }) => {
        this.setState({ orders: data, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  };

  statusGen = ({ cancelled, delivered, dispatched, shipped }) => {
    if (cancelled) return 0;
    else if (!cancelled && !dispatched) return 1;
    else if (delivered) return 4;
    else if (shipped) return 3;
    else return 2;
  };

  getOrderDates = (theDate) => {
    return `${new Date(theDate).getDate()} ${
      monthNames[new Date(theDate).getMonth()]
    } ${new Date(theDate).getFullYear()}`;
  };

  orderDetailsToggle = (index) => {
    const { orderDetails, visibleIndex, trackVisibleIndex } = this.state;
    if (trackVisibleIndex !== index) this.setState({ trackVisible: false });
    if (orderDetails && index === visibleIndex)
      this.setState({ orderDetails: false, visibleIndex: index });
    else this.setState({ orderDetails: true, visibleIndex: index });
  };

  trackToggle = (index) => {
    const { trackVisible, trackVisibleIndex, visibleIndex } = this.state;
    if (visibleIndex !== index) this.setState({ orderDetails: false });
    if (trackVisible && index === trackVisibleIndex)
      this.setState({ trackVisible: false, trackVisibleIndex: index });
    else this.setState({ trackVisible: true, trackVisibleIndex: index });
  };

  handleCancellation = (id) => {
    const { cancelOrder } = this.state;
    if (cancelOrder)
      this.setState({ cancelOrder: false, cancelError: false, cancelId: id });
    else this.setState({ cancelOrder: true, cancelId: id });
  };

  cancelOrder = async () => {
    const { cancelId } = this.state;
    this.setState({ cancelLoading: true, cancelError: false });
    const { id } = service.getCurrentUser();
    await axios
      .put(`${URL(API_ENDPOINT.userOrders)}/cancel/${id}/${cancelId}`, null, {
        headers: {
          Authorization: service.getJwt(),
        },
      })
      .then(() => {
        this.updateOrders(cancelId);
      })
      .catch(() => {
        this.setState({ cancelLoading: false, cancelError: true });
      });
  };

  updateOrders = (orderid) => {
    const { orders } = this.state;
    const newOrders = orders.map((i) => {
      if (i.id === orderid) {
        i.orderStatus.cancelled = true;
      }
      return i;
    });
    this.setState({
      orders: newOrders,
      cancelOrder: false,
      cancelLoading: false,
      cancelId: null,
      trackVisible: false,
      trackVisibleIndex: null,
    });
  };

  render() {
    const {
      cancelOrder,
      cancelId,
      cancelError,
      cancelLoading,
      loading,
      error,
      orders,
      orderDetails,
      visibleIndex,
      trackVisible,
      trackVisibleIndex,
    } = this.state;
    return (
      <div className="orders-container">
        <div className="order-container-head">
          <h2>Order Details</h2>
        </div>
        {loading ? (
          <div className="orders-loading">
            <Lottie
              className="server-loading-anim"
              animationData={loadingAnim}
            />
          </div>
        ) : error ? (
          <div className="display-error-page">
            <Lottie
              className="display-server-anim"
              animationData={serverAnim}
            />
            <p>
              <button onClick={this.getProducts}>
                Try Again <span>?</span>
              </button>
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="nothing-in-here">
            <Lottie className="empty-anim" animationData={empty} />
            <h2>Nothing in here to track...</h2>
            <p>
              <button onClick={() => this.props.history.push("/")}>
                Go Shopping
              </button>
            </p>
          </div>
        ) : (
          <div className="order-details">
            {orders.map((i, index) => {
              const {
                id,
                billingAddress,
                deliveryDate,
                orderImage,
                itemDetails,
                modeOfPayment,
                orderDate,
                orderStatus,
              } = i;
              const { type, picByte, name } = orderImage;
              const statusCode = this.statusGen(orderStatus);
              const { productName, totalPrice, itemCount } = itemDetails;
              const price = parseInt(totalPrice) / itemCount;
              const oDate = this.getOrderDates(orderDate);
              const dDate = this.getOrderDates(deliveryDate);
              const imgUrl = `data:${type};base64,${picByte}`;
              return (
                <div className="order-details-sub-container" key={index}>
                  <div className="order-details-sub-container-header">
                    <h5>
                      <span>Order id: </span>SORSHOP{id}
                    </h5>
                    <h5>
                      <span>Status: </span>
                      {allStatus[statusCode]}
                    </h5>
                  </div>
                  <div className="each-order-container">
                    <div>
                      <img src={imgUrl} alt={name} />
                    </div>
                    <div>
                      <span>Product:</span>
                      <h5>{productName.toLowerCase()}</h5>
                      <h5>
                        <span>Qty: </span>
                        {itemCount}
                      </h5>
                    </div>
                    <div>
                      <span>Billing Address:</span>
                      <h5>{billingAddress.address.toLowerCase()}</h5>
                    </div>
                    <div>
                      <button onClick={() => this.orderDetailsToggle(index)}>
                        Order Details
                      </button>
                      {statusCode !== 0 && (
                        <button onClick={() => this.trackToggle(index)}>
                          Track Order
                        </button>
                      )}
                      {statusCode !== 4 && statusCode !== 0 && (
                        <button onClick={() => this.handleCancellation(id)}>
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                  <div
                    id={`details${index}`}
                    className={`each-order-details ${
                      orderDetails && visibleIndex === index
                        ? "each-order-details-visible"
                        : ""
                    }`}
                  >
                    <div>
                      <span className="order-head">Order summary:</span>
                      <h5>
                        <span className="order-head-light">Item price: </span>
                        <span className="order-details">${price}.00</span>
                      </h5>
                      <h5>
                        <span className="order-head-light">Quantity: </span>
                        <span className="order-details">{itemCount}</span>
                      </h5>
                      <h5>
                        <span className="order-head-light order-head-bold">
                          Grand Total:{" "}
                        </span>
                        <span className="order-details order-head-bold">
                          ${price * itemCount}.00
                        </span>
                      </h5>
                    </div>
                    <div>
                      <h5>
                        <span className="order-head">Order Date:</span>
                        <span className="order-details">{oDate}</span>
                      </h5>
                      <h5>
                        <span className="order-head">Delivery Date:</span>
                        <span className="order-details">{dDate}</span>
                      </h5>
                    </div>
                    <div>
                      <h5>
                        <span className="order-head">Payment method:</span>
                        <span className="order-details">
                          {modeOfPayment.modeOfPayment}
                        </span>
                      </h5>
                    </div>
                  </div>
                  <div
                    id={`track${index}`}
                    className={`each-order-tracking ${
                      trackVisible && trackVisibleIndex === index
                        ? "tracking-visible"
                        : ""
                    }`}
                  >
                    <ul>
                      <li>
                        <p
                          className={`${
                            statusCode >= 1 ? "track-color-visible" : ""
                          }`}
                        >
                          Processing
                        </p>
                        <FaCircle
                          className={`faCircle ${
                            statusCode >= 1 ? "track-color-visible" : ""
                          }`}
                        />
                        {statusCode > 1 && <span />}
                      </li>
                      <li>
                        <p
                          className={`${
                            statusCode >= 2 ? "track-color-visible" : ""
                          }`}
                        >
                          Dispatched
                        </p>
                        <FaCircle
                          className={`faCircle ${
                            statusCode >= 2 ? "track-color-visible" : ""
                          }`}
                        />
                        {statusCode > 2 && <span />}
                      </li>
                      <li>
                        <p
                          className={`${
                            statusCode >= 3 ? "track-color-visible" : ""
                          }`}
                        >
                          Shipped
                        </p>
                        <FaCircle
                          className={`faCircle ${
                            statusCode >= 3 ? "track-color-visible" : ""
                          }`}
                        />
                        {statusCode > 3 && <span />}
                      </li>
                      <li>
                        <p
                          className={`${
                            statusCode === 4 ? "track-color-visible" : ""
                          }`}
                        >
                          Delivered
                        </p>
                        <FaCircle
                          className={`faCircle ${
                            statusCode === 4 ? "track-color-visible" : ""
                          }`}
                        />
                      </li>
                    </ul>
                  </div>
                  <div
                    className={`cancellation-handle ${
                      cancelOrder && cancelId === id
                        ? "cancellation-display"
                        : ""
                    }`}
                  >
                    <div
                      className={`cancellation-error ${
                        cancelError ? "cancellation-error-display" : ""
                      }`}
                    >
                      Sorry...Server Error occurred. Try after some time
                    </div>
                    <div className="cancellation-sub-container">
                      {cancelLoading && (
                        <Lottie
                          className="cancel-loading-anim"
                          animationData={cancelLoadingAnim}
                        />
                      )}
                      {cancelLoading && (
                        <div className="cancel-loading-cover" />
                      )}
                      <Cancellation />
                      <div className="cancel-btn-container">
                        <button
                          disabled={cancelLoading ? true : false}
                          className={
                            cancelLoading ? "cancellation-btn-disable" : ""
                          }
                          onClick={this.cancelOrder}
                        >
                          Cancel Order
                        </button>
                        <button
                          disabled={cancelLoading ? true : false}
                          className={
                            cancelLoading ? "cancellation-btn-disable" : ""
                          }
                          onClick={() => this.handleCancellation(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default Orders;
