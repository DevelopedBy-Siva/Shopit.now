import React, { Component } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

class LoginRegError extends Component {
  render() {
    const { error } = this.props;
    return (
      <div className="registration-login-error">
        <FaExclamationTriangle className="registration-login-error-icon" />
        <h5>{error}</h5>
      </div>
    );
  }
}

export default LoginRegError;
