import React, { Component } from "react";
import { Switch } from "react-router-dom";
import AddProducts from "./AddProduct/AddProducts";
import AdminContainer from "./Dashboard/AdminContainer";
import AdminProducts from "./AdminProduct/AdminProducts";
import AdminProtectedRoute from "../Route/AdminProtectedRoute";
import { FaUser } from "react-icons/fa";
import { FaBars } from "react-icons/fa";

import AdminAdvertisement from "./Advertisements/AdminAdvertisement";
import Settings from "./Settings/Settings";

class AdminContainerWrap extends Component {
  render() {
    const { handleSmallDashboard, handleSelectedScreen, handleUserSettings } =
      this.props;
    return (
      <div className="role-admin-right">
        <div className="role-admin-nav">
          <FaBars
            onClick={handleSmallDashboard}
            className="small-screen-dashboard"
          />
          <div className="role-admin-nav-right">
            <FaUser onClick={handleUserSettings} />
          </div>
        </div>
        <div className="role-admin-right-contain">
          <Switch>
            <AdminProtectedRoute
              handleSelectedScreen={handleSelectedScreen}
              path="/admin/add-product"
              Component={AddProducts}
            />
            <AdminProtectedRoute
              handleSelectedScreen={handleSelectedScreen}
              path="/admin/products"
              Component={AdminProducts}
            />
            <AdminProtectedRoute
              handleSelectedScreen={handleSelectedScreen}
              path="/admin/advertisement"
              Component={AdminAdvertisement}
            />
            <AdminProtectedRoute
              handleSelectedScreen={handleSelectedScreen}
              path="/admin/settings"
              Component={Settings}
            />
            <AdminProtectedRoute
              handleSelectedScreen={handleSelectedScreen}
              path="/admin"
              Component={AdminContainer}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default AdminContainerWrap;
