import React, { Component } from "react";
import Logo from "../../Logo";
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
    const { handleLogout, selectedScreen, handleSmallDashboard } = this.props;
    return (
      <div className={`dashboard`}>
        <div>
          <div className="admin-logo-container">
            <Logo style={{ color: "#fff" }} />
          </div>
          <div className="dashboard-admin-options">
            <DashBoardOptions
              handleSmallDashboard={handleSmallDashboard}
              selectedScreen={selectedScreen}
              url="/"
              name="Dashboard"
            >
              <FaHome />
            </DashBoardOptions>
            <DashBoardOptions
              handleSmallDashboard={handleSmallDashboard}
              selectedScreen={selectedScreen}
              url="/admin/products"
              name="Products"
            >
              <FaListAlt />
            </DashBoardOptions>
            <DashBoardOptions
              handleSmallDashboard={handleSmallDashboard}
              selectedScreen={selectedScreen}
              url="/admin/add-product"
              name="Add Product"
            >
              <FaPlusCircle />
            </DashBoardOptions>
            <DashBoardOptions
              handleSmallDashboard={handleSmallDashboard}
              selectedScreen={selectedScreen}
              url="/admin/advertisement"
              name="Advertisement"
            >
              <FaBullhorn />
            </DashBoardOptions>
          </div>
        </div>
        <div className="nav-btn">
          <DashBoardOptions
            handleSmallDashboard={handleSmallDashboard}
            selectedScreen={selectedScreen}
            url="/admin/settings"
            name="Settings"
          >
            <FaCog />
          </DashBoardOptions>
          <div onClick={handleLogout} className={`dashboard-each-option`}>
            <div>
              <FaSignOutAlt />
              <h5>Logout</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
