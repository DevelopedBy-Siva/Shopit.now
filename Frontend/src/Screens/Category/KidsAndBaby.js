import React, { Component } from "react";
import kidsimg from "../../Images/kids.jpg";
import barbie from "../../Images/Kids/barbie.webp";
import hm from "../../Images/Kids/h&m.webp";
import hanna from "../../Images/Kids/hanna.webp";
import lego from "../../Images/Kids/lego.webp";
import puma from "../../Images/Kids/puma.webp";

import "../../css/kid.css";

const images = [barbie, hm, hanna, lego, puma];

class KidsAndBaby extends Component {
  render() {
    return (
      <div className="kids-container">
        <div className="kids-cover">
          <img src={kidsimg} alt="kids-cover" />
          <div>
            <h4>Spring</h4>
            <h5>Take A Sneak Peek into Everything New</h5>
          </div>
        </div>
        <h2>Top Brands Available</h2>
        <div className="kids-brand-container contain">
          {images.map((i, index) => (
            <div
              onClick={() => this.props.history.push("/search/kids")}
              key={index}
              className="kids-sub-container"
              style={
                index === 0
                  ? { width: "90px" }
                  : index === 2
                  ? { width: "190px" }
                  : {}
              }
            >
              <div>
                <img src={i} alt={`kids-${index}`} />
              </div>
            </div>
          ))}
        </div>
        <footer style={{ height: "100px" }} />
      </div>
    );
  }
}

export default KidsAndBaby;
