import React, { Component } from "react";
import axios from "axios";
import { FaExclamationCircle, FaBell } from "react-icons/fa";
import { getJwt } from "../../../../services/LoginReg";
import {
  api_endpoints as API_ENDPOINT,
  formUrl as URL,
} from "../../../../api/api";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../../../State Management/MappingStates";
import { connect } from "react-redux";

class Notifications extends Component {
  state = {
    notifications: [],
    notificationError: false,
    notificationToggle: false,
    notificationCount: 0,
  };

  handleNotification = () => {
    const notification = this.state.notificationToggle;
    if (notification) this.setState({ notificationToggle: false });
    else {
      const count = this.state.notificationCount;
      this.setState({ notificationToggle: true, notificationCount: 0 });
      this.viewNotifications(count);
    }
  };

  componentDidMount() {
    this.getNotifications();
    this.interval = setInterval(this.getNotifications, 1000);
  }

  getNotifications = async () => {
    await axios
      .get(`${URL(API_ENDPOINT.userOrders)}/notification`, {
        headers: {
          Authorization: getJwt(),
        },
      })
      .then(({ data }) => {
        this.storeAllNotification(data);
      })
      .catch(() => {
        this.setState({ notificationError: true });
      });
  };

  storeAllNotification = (data) => {
    const { notifications } = this.state;
    let updatedData = notifications;
    data.forEach((i) => {
      const found = notifications.some((j) => j.id === i.id);
      if (!found) {
        updatedData = [i, ...updatedData];
      }
    });
    this.setState({
      notifications: updatedData,
      notificationCount: data.length,
      notificationError: false,
    });
  };

  viewNotifications = async (count) => {
    await axios
      .put(`${URL(API_ENDPOINT.userOrders)}/notification/seen`, null, {
        headers: {
          Authorization: getJwt(),
        },
      })
      .then(() => {
        this.setState({ notificationError: false });
      })
      .catch(() => {
        this.setState({ notificationError: true, notificationCount: count });
      });
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  refreshOrders = () => {
    this.handleNotification();
    this.props.fetchOrders();
  };

  render() {
    const {
      notificationToggle,
      notifications,
      notificationError,
      notificationCount,
    } = this.state;
    return (
      <div className="notification-container">
        {notificationCount > 0 && <h3>{notificationCount}</h3>}
        <FaBell onClick={this.handleNotification} />
        <div
          className={`notifications-display ${
            notificationToggle ? "notifications-display-visible" : ""
          }`}
        >
          {notificationError ? (
            <div className="notification-error">
              <FaExclamationCircle />
              <h4>Server error occured. Try after sometime...</h4>
            </div>
          ) : notifications.length === 0 ? (
            <div className="no-notification">No notification...</div>
          ) : (
            notifications.map((i, index) => (
              <div
                onClick={this.refreshOrders}
                key={index}
                className="notification-display-sub"
              >
                <h2>New Order Placed..</h2>
                <h5>
                  Order id: <span>{i.id}</span>
                </h5>
                <h5>
                  Order: <span>{i.productName}</span>
                </h5>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
