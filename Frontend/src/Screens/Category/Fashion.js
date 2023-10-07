import React, { Component } from "react";
import fashionimg from "../../Images/fashion.jpg";
import van from "../../Images/Fashion/united.jpeg";
import nike from "../../Images/Fashion/nike.jpeg";
import roadster from "../../Images/Fashion/roadster.jpeg";
import wrogn from "../../Images/Fashion/wrogn.jpeg";
import hrx from "../../Images/Fashion/hrx.jpg";
import allen from "../../Images/Fashion/allen.jpg";
import hm from "../../Images/Fashion/hm.jpg";
import invictus from "../../Images/Fashion/invictus.jpg";
import "../../css/fashion.css";

const brands = [
  "Nike",
  "Van Heusen",
  "Roadster",
  "Wrogn",
  "HRX",
  "Allen Solly",
  "H&M",
  "The Invictus",
];
const images = [nike, van, roadster, wrogn, hrx, allen, hm, invictus];

class Fashion extends Component {
  state = {};
  render() {
    return (
      <div className="fashion-container">
        <div className="fashion-cover">
          <img src={fashionimg} alt="fashion-cover" />
          <div>
            <h4>PERMAPRESS</h4>
            <h5>
              A premium wrinkle-free collection, designed to keep you uncrushed
              all day long
            </h5>
          </div>
        </div>
        <h2>Top Brands Available</h2>
        <div className="top-brands contain">
          {brands.map((i, index) => (
            <div
              onClick={() => this.props.history.push("/search/fashion")}
              key={index}
            >
              <img src={images[index]} index={i} alt="fashions" />
              <h5>{i}</h5>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Fashion;
