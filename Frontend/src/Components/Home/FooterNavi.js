import React, { Component } from "react";

import Logo from "../Logo";
import { FaTruck, FaBalanceScale } from "react-icons/fa";
import "../../css/footer-navi.css";

class FooterNavi extends Component {
  render() {
    return (
      <div className="footer-container">
        <div className="wrapper">
          <div className="left-navi">
            <Logo style={{ color: "white" }} />
            <p className="slogan">
              Discover. Shop. Smile.<br></br>Your One-Stop Destination for
              Everything!
            </p>
          </div>
          <div className="right-navi">
            <div>
              <span className="fontawsm-logo">
                <FaBalanceScale className="icon" />
                <h4>100% ORIGINAL</h4>
              </span>
              <h5>guarantee for all products at shopit.now</h5>
            </div>
            <div>
              <span className="fontawsm-logo">
                <FaTruck className="icon" />
                <h4>Return within 30days</h4>
              </span>
              <h5>of receiving your order</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FooterNavi;
