import React, { Component } from "react";
import {
  TrendingIn,
  BestSellers,
  FooterNavi,
  HomeScreenCarousel,
  TodaysDeals,
} from "../Refactor/HomeScreenRefactor";
import "../css/home.css";

class Home extends Component {
  state = {};

  handleItemPage = (item) => {
    this.props.history.push(`/products/${item.id}`);
  };

  render() {
    return (
      <div className="home-container">
        <HomeScreenCarousel />
        <div className="contain">
          <TodaysDeals onClick={this.handleItemPage} />
          <BestSellers onClick={this.handleItemPage} />
          <TrendingIn />
        </div>
        <FooterNavi />
      </div>
    );
  }
}

export default Home;
