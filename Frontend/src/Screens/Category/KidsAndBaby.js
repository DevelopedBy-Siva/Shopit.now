import React, { Component } from "react";
import kidsimg from "../../Images/kids.jpg";
import ajio from "../../Images/Kids/Ajio-Logo.png";
import gini from "../../Images/Kids/gini.png";
import little from "../../Images/Kids/little.png";
import cucumber from "../../Images/Kids/cucumber.png";
import nautunati from "../../Images/Kids/nautunati.jpg";
import lilli from "../../Images/Kids/lilli.png";
import cn from "../../Images/Kids/cn.png";
import max from "../../Images/Kids/max.png";

import "../../css/kid.css";

const images = [ajio, cn, cucumber, gini, lilli, little, nautunati, max];

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

export default KidsAndBaby;
