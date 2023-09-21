import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Account, Orders } from "../Refactor/AppContainerRefactor";

class AccountContainer extends Component {
  render() {
    return (
      <Switch>
        <Route path="/account/orders" component={Orders} />
        <Route path="/account" component={Account} />
      </Switch>
    );
  }
}

export default AccountContainer;
