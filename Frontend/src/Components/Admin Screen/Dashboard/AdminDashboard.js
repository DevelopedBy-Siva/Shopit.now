import React, { Component } from "react";
import APP_LOGO_WHITE from "../../../Icons/app-logo-white.svg";
import logo from "../../../Icons/logo-now";
import {
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaPlusCircle,
  FaListAlt,
  FaBullhorn,
} from "react-icons/fa";
import DashBoardOptions from "./DashBoardOptions";

class AdminDashboard extends Component {
  render() {
    const {
      handleLogout,
      dashboardToggle,
      selectedScreen,
      handleSmallDashboard,
    } = this.props;
    return (
      <div className={`dashboard`}>
        <div>
          <div className="admin-logo-container">
            <span className={`${!dashboardToggle ? "" : "hide-it"}`}>
              <img src={APP_LOGO_WHITE} alt="admin screen logo" />
            </span>
            <span
              className={`${!dashboardToggle ? "now-logo-hide" : "now-logo"}`}
            >
              {logo}
            </span>
          </div>
          <div className="dashboard-admin-options">
            <DashBoardOptions
              handleSmallDashboard={handleSmallDashboard}
              selectedScreen={selectedScreen}
              url="/"
              dashboardToggle={dashboardToggle}
              name="Dashboard"
            >
              <FaHome className={!dashboardToggle ? "" : "scale-svg"} />
            </DashBoardOptions>
            <DashBoardOptions
              handleSmallDashboard={handleSmallDashboard}
              selectedScreen={selectedScreen}
              url="/admin/products"
              dashboardToggle={dashboardToggle}
              name="Products"
            >
              <FaListAlt className={!dashboardToggle ? "" : "scale-svg"} />
            </DashBoardOptions>
            <DashBoardOptions
              handleSmallDashboard={handleSmallDashboard}
              selectedScreen={selectedScreen}
              url="/admin/add-product"
              dashboardToggle={dashboardToggle}
              name="Add Product"
            >
              <FaPlusCircle className={!dashboardToggle ? "" : "scale-svg"} />
            </DashBoardOptions>
            <DashBoardOptions
              handleSmallDashboard={handleSmallDashboard}
              selectedScreen={selectedScreen}
              url="/admin/advertisement"
              dashboardToggle={dashboardToggle}
              name="Advertisement"
            >
              <FaBullhorn className={!dashboardToggle ? "" : "scale-svg"} />
            </DashBoardOptions>
          </div>
        </div>
        <div className="nav-btn">
          <DashBoardOptions
            handleSmallDashboard={handleSmallDashboard}
            selectedScreen={selectedScreen}
            url="/admin/settings"
            dashboardToggle={dashboardToggle}
            name="Settings"
          >
            <FaCog className={!dashboardToggle ? "" : "scale-svg"} />
          </DashBoardOptions>
          <div onClick={handleLogout} className={`dashboard-each-option`}>
            <div>
              <FaSignOutAlt className={!dashboardToggle ? "" : "scale-svg"} />
              <h5 className={!dashboardToggle ? "" : "hide-it"}>Logout</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
