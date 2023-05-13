import React, { Component } from "react";
import AdminDashboard from "./AdminDashboard";
import { FaTimes } from "react-icons/fa";

class Navigation extends Component {
  state = {
    screen: null,
  };

  componentDidMount() {
    this.setState({ screen: this.props.selectedScreen });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedScreen !== this.props.selectedScreen) {
      this.setState({ screen: this.props.selectedScreen });
    }
  }

  render() {
    const {
      handleLogout,
      dashboardToggle,
      smallDashboard,
      handleSmallDashboard,
    } = this.props;
    const { screen } = this.state;
    return (
      <>
        <div
          className={`role-admin-l-cont l-cont-large ${
            dashboardToggle ? "display-half" : ""
          }`}
        >
          <AdminDashboard
            handleLogout={handleLogout}
            selectedScreen={screen}
            dashboardToggle={dashboardToggle}
          />
        </div>
        <div
          className={`role-admin-l-cont small-l ${
            smallDashboard ? "display-dashboard" : ""
          }`}
        >
          <AdminDashboard
            handleLogout={handleLogout}
            handleSmallDashboard={handleSmallDashboard}
            selectedScreen={screen}
          />
        </div>
        <div
          className={`l-cont-cover ${
            smallDashboard ? "l-cont-cover-disp" : ""
          }`}
        >
          <FaTimes onClick={handleSmallDashboard} />
        </div>
      </>
    );
  }
}

export default Navigation;
