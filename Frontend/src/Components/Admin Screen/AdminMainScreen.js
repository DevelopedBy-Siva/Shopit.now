import React, { Component } from "react";
import Admin from "../../Screens/Admin";
import Logout from "../Logout/Logout";
import { removeJwt } from "../../services/LoginReg";
import "../../css/admin-main-screen.css";

class AdminMainScreen extends Component {
  state = {
    dashboardToggle: false,
    smallScreenDashboard: false,
    selectedScreen: null,
    logoutDisplay: false,
  };

  handleDashboardToggle = () => {
    const { dashboardToggle } = this.state;
    if (dashboardToggle) this.setState({ dashboardToggle: false });
    else this.setState({ dashboardToggle: true });
  };

  handleSmallScreenDashboard = () => {
    const { smallScreenDashboard } = this.state;
    if (smallScreenDashboard) this.setState({ smallScreenDashboard: false });
    else this.setState({ smallScreenDashboard: true });
  };
  handleSelectedScreen = (theScreen) => {
    this.setState({ selectedScreen: theScreen });
  };

  handleLogout = () => {
    const { logoutDisplay } = this.state;
    if (logoutDisplay) this.setState({ logoutDisplay: false });
    else this.setState({ logoutDisplay: true });
  };
  loggingOut = () => {
    removeJwt();
  };
  handleUserSettings = () => {
    this.props.history.push("/admin/settings");
  };
  render() {
    const {
      dashboardToggle,
      logoutDisplay,
      smallScreenDashboard,
      selectedScreen,
    } = this.state;
    return (
      <div className="wrap-whole-admin">
        <Logout
          loggingOut={this.loggingOut}
          handleLogout={this.handleLogout}
          logoutDisplay={logoutDisplay}
        />
        <Admin
          dashboardToggle={dashboardToggle}
          smallScreenDashboard={smallScreenDashboard}
          selectedScreen={selectedScreen}
          handleDashboardToggle={this.handleDashboardToggle}
          handleSmallScreenDashboard={this.handleSmallScreenDashboard}
          handleSelectedScreen={this.handleSelectedScreen}
          handleLogout={this.handleLogout}
          handleUserSettings={this.handleUserSettings}
        />
      </div>
    );
  }
}

export default AdminMainScreen;
