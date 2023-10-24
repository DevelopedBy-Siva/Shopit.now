import React, { Component } from "react";
import fashionimg from "../../Images/fashion.jpg";
import img1 from "../../Images/Fashion/1.webp";
import img2 from "../../Images/Fashion/2.webp";
import img3 from "../../Images/Fashion/3.webp";
import img4 from "../../Images/Fashion/4.webp";
import img5 from "../../Images/Fashion/5.webp";
import img6 from "../../Images/Fashion/6.webp";
import "../../css/fashion.css";

const images = [img1, img2, img3, img4, img5, img6];

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
          {images.map((i, index) => (
            <div
              onClick={() => this.props.history.push("/search/fashion")}
              key={index}
            >
              <img src={i} alt={`fashions-${index}`} />
            </div>
          ))}
        </div>
        <footer style={{ height: "100px" }} />
      </div>
    );
  }
}

export default Fashion;
