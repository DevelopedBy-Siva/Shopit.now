import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import {
  mapStateToProps,
  mapDispatchToProps,
} from "../State Management/MappingStates";
import { Login, Register } from "../Refactor/AppContainerRefactor";
import * as service from "../services/LoginReg";
import ProtectedRoute from "../Components/Route/ProtectedRoute";
import RoleBasedRoute from "../Components/Route/RoleBasedRoute";
import OrderProcessing from "../Components/Place Order/OrderProcessing";
import AdminMainScreen from "../Components/Admin Screen/AdminMainScreen";

class AppContainer extends Component {
  state = {
    user: null,
    roles: [],
  };
  componentDidMount() {
    try {
      const currentUser = service.getCurrentUser();
      if (service.jwtExpirationChecker(currentUser.exp)) {
        this.props.fetch(); //User Cart Fetch
        this.props.fetchSaveLater(); //Save For Later
        this.setState({ user: currentUser, roles: currentUser.roles });
      } else {
        this.setState({ user: null });
        window.location = "/";
      }
    } catch (e) {}
  }

  render() {
    const { user } = this.state;
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        {service.rolesBasedAuth() && (
          <Route path="/admin" component={AdminMainScreen} />
        )}
        <ProtectedRoute path="/order-processing" Component={OrderProcessing} />
        <RoleBasedRoute path="/" user={user} />
      </Switch>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
