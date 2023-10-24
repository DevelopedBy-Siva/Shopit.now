import React, { Component } from "react";
import appliances from "../../Images/appliances.jpeg";
import samsung from "../../Images/appliances/samsung.webp";
import smeg from "../../Images/appliances/smeg.webp";
import lg from "../../Images/appliances/lg.webp";
import frigidaire from "../../Images/appliances/kitchenaid.webp";
import gag from "../../Images/appliances/gag.webp";

import "../../css/appliances.css";

const images = [samsung, smeg, lg, frigidaire, gag];

class Appliances extends Component {
  state = {};
  render() {
    return (
      <div className="appliances-container">
        <div className="appliances-cover">
          <img src={appliances} alt="appliances-cover" />
          <div>
            <h4>Whirlpool</h4>
            <h5>
              <span>Why Convert,</span> When You Can Adapt
            </h5>
          </div>
        </div>
        <h2>Top Brands Available</h2>
        <div className="appliance-brand-container contain">
          {images.map((i, index) => (
            <div
              onClick={() => this.props.history.push("/search/appliance")}
              key={index}
              className="appliance-brand-sub-container"
            >
              <div>
                <img src={i} alt={`appliances-${index}`} />
              </div>
            </div>
          ))}
        </div>
        <footer style={{ height: "100px" }} />
      </div>
    );
  }
}

export default Appliances;
