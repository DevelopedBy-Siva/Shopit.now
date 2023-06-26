import React, { Component } from "react";
import { Link } from "react-router-dom";

class DashBoardOptions extends Component {
  state = {};
  render() {
    const { name, url, selectedScreen, handleSmallDashboard, children } =
      this.props;
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
          <h5>{name}</h5>
        </div>
      </Link>
    );
  }
}

export default DashBoardOptions;
