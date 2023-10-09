import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import ProcessNav from "./ProcessNav";
import OrderDelivery from "../Place Order/OrderDelivery";
import OrderPayment from "../Place Order/OrderPayment";
import OrderSuccess from "../Place Order/OrderSuccess";
import "../../css/order-processing.css";

class Process extends Component {
  state = {
    progress: 0,
  };

  handleProgress = (progress) => {
    this.setState({ progress });
  };

  render() {
    const { progress } = this.state;
    return (
      <div className="order-process-container contain">
        <ProcessNav progress={progress} />
        <Switch>
          <Route
            path="/order-processing/success"
            render={(props) => (
              <OrderSuccess setProgress={this.handleProgress} {...props} />
            )}
          />
          <Route
            path="/order-processing/payment"
            render={(props) => (
              <OrderPayment setProgress={this.handleProgress} {...props} />
            )}
          />
          <Route
            path="/order-processing"
            render={(props) => (
              <OrderDelivery setProgress={this.handleProgress} {...props} />
            )}
          />
        </Switch>
        <footer style={{ height: "100px" }} />
      </div>
    );
  }
}

export default Process;
