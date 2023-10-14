import React, { Component } from "react";
import laptop from "../../Images/laptop.jpeg";
import apple from "../../Images/Laptop/apple.png";
import hp from "../../Images/Laptop/hp.png";
import asus from "../../Images/Laptop/asus.png";
import msi from "../../Images/Laptop/msi.png";
import lenovo from "../../Images/Laptop/lenovo.png";
import dell from "../../Images/Laptop/dell.png";
import acer from "../../Images/Laptop/acer.png";
import toshiba from "../../Images/Laptop/toshiba.png";

import "../../css/laptop.css";

const images = [apple, hp, dell, asus, msi, lenovo, acer, toshiba];

class Laptop extends Component {
  render() {
    return (
      <div className="laptop-container">
        <div className="laptop-cover">
          <img src={laptop} alt="laptop-cover" />
          <div>
            <h4>Macbook M1 Pro</h4>
            <h5>More power.</h5>
            <h5>More performance.</h5>
            <h5>More pro.</h5>
          </div>
        </div>
        <h2>Top Brands Available</h2>
        <div className="laptop-brand-container contain">
          {images.map((i, index) => (
            <div
              onClick={() => this.props.history.push("/search/laptops")}
              key={index}
              className="laptop-brand-sub-container"
            >
              <div>
                <img src={i} alt={i} />
              </div>
            </div>
          ))}
        </div>
        <footer style={{ height: "100px" }} />
      </div>
    );
  }
}

export default Laptop;
