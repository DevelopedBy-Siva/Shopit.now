import React, { Component } from "react";
import ReactFocusLock from "react-focus-lock";

class Logout extends Component {
  render() {
    const { loggingOut, handleLogout } = this.props;
    return (
      <ReactFocusLock>
        <div className="admin-logout-now-container">
          <div className="logout-btns">
            <h5>Are you sure you want to logout?</h5>
            <div>
              <button onClick={loggingOut}>Logout</button>
              <button onClick={handleLogout}>Cancel</button>
            </div>
          </div>
        </div>
      </ReactFocusLock>
    );
  }
}

export default Logout;
