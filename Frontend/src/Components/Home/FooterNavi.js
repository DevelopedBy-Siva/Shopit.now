import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import "../../css/footer-navi.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faBalanceScale } from "@fortawesome/free-solid-svg-icons";

const leftNavi = ["Contact Us", "FAQ", "T&C", "Terms Of Use", "Track Orders"];
const naviMid = [
  "Shipping",
  "Cancellation",
  "Returns",
  "Privacy policy",
  "Site Map",
];

class FooterNavi extends Component {
  render() {
    return (
      <div className="footer-container">
        <div className="left-navi">
          {leftNavi.map((item, index) => (
            <Link className="footer-navi-link" to="" key={index}>
              {item}
            </Link>
          ))}
        </div>
        <div className="mid-navi">
          {naviMid.map((item, index) => (
            <Link className="footer-navi-link" to="" key={index}>
              {item}
            </Link>
          ))}
        </div>
        <Logo style={{ color: "white" }} />
        <div className="right-navi">
          <div>
            <span className="fontawsm-logo">
              <FontAwesomeIcon icon={faBalanceScale} className="fontawsm" />
              <h4>100% ORIGINAL</h4>
            </span>
            <h5>guarantee for all products at shopit.now</h5>
          </div>
          <div>
            <span className="fontawsm-logo">
              <FontAwesomeIcon icon={faTruck} className="fontawsm" />
              <h4>Return within 30days</h4>
            </span>
            <h5>of receiving your order</h5>
          </div>
        </div>
      </div>
    );
  }
}

export default FooterNavi;
