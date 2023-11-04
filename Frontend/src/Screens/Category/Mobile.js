import React, { Component } from "react";
import mobile from "../../Images/mobile.webp";
import apple from "../../Images/Mobile/apple.webp";
import samsung from "../../Images/Mobile/samsung.webp";
import google from "../../Images/Mobile/google.webp";
import oneplus from "../../Images/Mobile/oneplus.webp";
import moto from "../../Images/Mobile/moto.webp";
import sony from "../../Images/Mobile/sony.webp";

import "../../css/mobile.css";

const images = [apple, samsung, oneplus, google, moto, sony];

class Mobile extends Component {
  state = {};
  render() {
    return (
      <div className="mobile-container contain">
        <div className="mobile-cover">
          <img src={mobile} alt="mobile-cover" />
        </div>
        <h2>Top Brands Available</h2>
        <div className="top-brands">
          {images.map((i, index) => (
            <div
              onClick={() => this.props.history.push("/search/mobile")}
              key={index}
              style={
                index === 0 || index === 3
                  ? { width: "50px" }
                  : index === 4
                  ? { width: "100px" }
                  : {}
              }
            >
              <img src={i} alt={`mobiles-${i}`} />
            </div>
          ))}
        </div>
        <footer style={{ height: "100px" }} />
      </div>
    );
  }
}

export default Mobile;
