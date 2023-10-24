import React, { Component } from "react";
import { Link } from "react-router-dom";
import img1 from "../../Images/Fashion/1.webp";
import img2 from "../../Images/Fashion/2.webp";
import img3 from "../../Images/Fashion/3.webp";
import img4 from "../../Images/Fashion/4.webp";
import img5 from "../../Images/Fashion/5.webp";
import img6 from "../../Images/Fashion/6.webp";
import img7 from "../../Images/Fashion/7.webp";
import img8 from "../../Images/Fashion/8.webp";

import "../../css/trending-in.css";

const images = [img1, img2, img3, img4, img5, img6, img7, img8];

class TrendingIn extends Component {
  render() {
    return (
      <div className="trending-in-container">
        <h2>Trending Brands in Fashion</h2>
        <div className="trending-in">
          {images.map((item, index) => (
            <div className="trending-home-container" key={index}>
              <Link to="/search/fashion">
                <img src={item} alt={item} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default TrendingIn;
