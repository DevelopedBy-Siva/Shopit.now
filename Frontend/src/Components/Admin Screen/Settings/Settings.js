import React, { Component } from "react";
import PasswordChange from "./PasswordChange";
import DeleteAccount from "./DeleteAccount";
import "../../../css/settings.css";

class Settings extends Component {
  state = {};

  componentDidMount() {
    this.props.handleSelectedScreen("Settings");
  }

  render() {
    return (
      <div className="admin-settings-container">
        <div className="admin-settings-sub-container">
          <PasswordChange />
          <DeleteAccount />
        </div>
      </div>
    );
  }
}

export default Settings;
