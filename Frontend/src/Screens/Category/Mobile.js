import React, { Component } from "react";
import mobile from "../../Images/mobile.jpeg";
import iphone from "../../Images/Mobile/iphone.png";
import samsung from "../../Images/Mobile/samsung.png";
import pixel from "../../Images/Mobile/pixel.png";
import oneplus from "../../Images/Mobile/oneplus.png";
import realme from "../../Images/Mobile/realme.png";
import redmi from "../../Images/Mobile/redmi.png";
import oppo from "../../Images/Mobile/oppo.png";
import vivo from "../../Images/Mobile/vivo.png";
import asus from "../../Images/Mobile/asus.png";
import sony from "../../Images/Mobile/sony.png";
import nokia from "../../Images/Mobile/nokia.png";

import "../../css/mobile.css";

const brands = [
  "iPhone",
  "Samsung",
  "Google",
  "OnePlus",
  "Realme",
  "Xiaomi",
  "Oppo",
  "Vivo",
  "Asus",
  "Sony",
  "Nokia",
];
const images = [
  iphone,
  samsung,
  pixel,
  oneplus,
  realme,
  redmi,
  oppo,
  vivo,
  asus,
  sony,
  nokia,
];

class Mobile extends Component {
  state = {};
  render() {
    return (
      <div className="mobile-container">
        <div className="mobile-cover">
          <img src={mobile} alt="mobile-cover" />
          <div>
            <h4>iPhone</h4>
            <h5>Life is easier on iPhone.</h5>
            <span>And that starts as soon as you turn it on.</span>
          </div>
        </div>
        <h2>Top Brands Available</h2>
        <div className="top-brands contain">
          {brands.map((i, index) => (
            <div
              onClick={() => this.props.history.push("/search/mobile")}
              key={index}
            >
              <img src={images[index]} alt={i} index={i} />
              <h5>{i}</h5>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Mobile;
