import React, { Component } from "react";
import { Link } from "react-router-dom";

class DashBoardOptions extends Component {
  state = {};
  render() {
    const {
      name,
      dashboardToggle,
      url,
      selectedScreen,
      handleSmallDashboard,
      children,
    } = this.props;
    return (
      <Link
        to={url}
        onClick={handleSmallDashboard}
        className={`dashboard-each-option ${
          selectedScreen === name && name !== "Logout" ? "selected-screen" : ""
        }`}
      >
        <div>
          {children}
          <h5 className={!dashboardToggle ? "" : "hide-it"}>{name}</h5>
        </div>
      </Link>
    );
  }
}

export default DashBoardOptions;
