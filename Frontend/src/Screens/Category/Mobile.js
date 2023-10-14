import React, { Component } from "react";
import mobile from "../../Images/mobile.jpeg";
import iphone from "../../Images/Mobile/iphone.webp";
import samsung from "../../Images/Mobile/samsung.webp";
import pixel from "../../Images/Mobile/pixel.webp";
import oneplus from "../../Images/Mobile/oneplus.webp";
import nothing from "../../Images/Mobile/nothing.webp";

import "../../css/mobile.css";

const brands = ["iPhone", "Samsung", "Google", "OnePlus", "Nothing"];

const images = [iphone, samsung, pixel, oneplus, nothing];

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
        <footer style={{ height: "100px" }} />
      </div>
    );
  }
}

export default Mobile;
