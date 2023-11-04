import React, { Component } from "react";
import appliances from "../../Images/appliances.webp";
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
      <div className="appliances-container contain">
        <div className="appliances-cover">
          <img src={appliances} alt="appliances-cover" />
        </div>
        <h2>Top Brands Available</h2>
        <div className="appliance-brand-container">
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
