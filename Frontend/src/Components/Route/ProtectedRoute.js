import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentUser, rolesBasedAuth } from "../../services/LoginReg";

class ProtectedRoute extends Component {
  render() {
    const user = getCurrentUser();
    const { path, Component } = this.props;
    if (rolesBasedAuth()) return <Redirect to="/" />;
    return (
      <Route
        path={path}
        render={(props) => {
          if (!user)
            return (
              <Redirect
                to={{
                  pathname: "/login",
                  state: {
                    from: props.location,
                  },
                }}
              />
            );
          return <Component {...props} />;
        }}
      />
    );
  }
}

export default ProtectedRoute;
