import React, { Component } from "react";
import * as service from "../../services/LoginReg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  mapDispatchToProps,
  mapStateToProps,
} from "../../State Management/MappingStates";
import Warning from "../../utils/Warning";
import LogoContainer from "../Logo";
import "../../css/navbar-style.css";
import { BsSearch } from "react-icons/bs";
import { RiShoppingCartFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";

const categories = [
  {
    name: "home",
    link: "",
  },
  {
    name: "kids & baby",
    link: "kidsandbaby",
  },
  {
    name: "fashion",
    link: "fashions",
  },
  {
    name: "mobiles",
    link: "mobiles",
  },
  {
    name: "laptops",
    link: "laptops",
  },
  {
    name: "appliances",
    link: "appliances",
  },
];

const loggedIn = ["account", "wishlist"];
const notLogged = ["login", "register"];

class Navbar extends Component {
  state = {
    menuVisible: false,
    query: "",
  };

  cartLen = this.props.userCart.length;

  menuVisibility = () => {
    const { menuVisible } = this.state;
    if (menuVisible) this.setState({ menuVisible: false });
    else this.setState({ menuVisible: true });
  };

  removeVisiblity = () => {
    this.setState({ menuVisible: false });
  };

  handleSearchQuery = (e) => {
    this.setState({ query: e.currentTarget.value });
  };

  handleSearch = (e) => {
    e.preventDefault();
    const { query } = this.state;
    if (query.length > 0) this.props.history.push(`/search/${query}`);
    return;
  };

  render() {
    const { menuVisible, query } = this.state;
    const { user, cartFetch } = this.props;
    const whatToshow = user ? loggedIn : notLogged;
    return (
      <>
        <div className="navbar-container">
          <div className="account-space">
            <LogoContainer />
            <div className="categories-space">
              {categories.map((data, index) => (
                <Link
                  onClick={this.removeVisiblity}
                  className="categories-link"
                  key={index}
                  to={`/${data.link}`}
                >
                  {data.name}
                </Link>
              ))}
            </div>
            <form className="searchbar" onSubmit={this.handleSearch}>
              <input
                onChange={this.handleSearchQuery}
                value={query}
                placeholder="Search..."
              />
              <button
                onClick={this.removeVisiblity}
                className="search-icon"
                type="submit"
              >
                <BsSearch className="icon" />
              </button>
            </form>
            <div className="user-details">
              {whatToshow.map((data, index) => (
                <Link
                  key={index}
                  onClick={this.removeVisiblity}
                  className="user-links"
                  to={`/${data}`}
                >
                  {data}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={this.removeVisiblity}
                className="cart-icon"
              >
                <RiShoppingCartFill className="icon" />
                {!cartFetch.error ? <span>{this.cartLen}</span> : <Warning />}
              </Link>
            </div>
            <div onClick={this.menuVisibility} className="menu-toggle">
              <GiHamburgerMenu />
            </div>
          </div>
        </div>
        <div className={menuVisible ? "menuVisible" : "menu-container"}>
          <div className="menu-user-details">
            {whatToshow.map((data, index) => (
              <span key={index}>
                <Link
                  onClick={this.removeVisiblity}
                  className="menu-user-links"
                  to={`/${data}`}
                >
                  {data}
                </Link>
              </span>
            ))}
            <Link
              to="/cart"
              onClick={this.removeVisiblity}
              className="cart-icon"
            >
              <RiShoppingCartFill className="icon" />
              {!cartFetch.error ? <span>{this.cartLen}</span> : <Warning />}
            </Link>
          </div>
          <ul>
            <div className="menu-categories-head">Categories</div>
            {categories.map((data, index) => (
              <li className="menu-items" key={index}>
                <Link
                  onClick={this.removeVisiblity}
                  className="menu-categories-links"
                  to={`/${data.link}`}
                >
                  {data.name}
                </Link>
              </li>
            ))}
            {user && (
              <div className="logout">
                <Link
                  className="menu-logout-links"
                  to=""
                  onClick={service.removeJwt}
                >
                  Logout
                </Link>
              </div>
            )}
          </ul>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));
