import React, { Component } from "react";
import cart from "../../Icons/cart";
import menu from "../../Icons/menu-toggle";
import * as service from "../../services/LoginReg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  mapDispatchToProps,
  mapStateToProps,
} from "../../State Management/MappingStates";
import Warning from "../../utils/Warning";
import "../../css/navbar-style.css";

const categoriesLink = [
  "",
  "kidsandbaby",
  "fashions",
  "mobiles",
  "laptops",
  "appliances",
];

class Navbar extends Component {
  state = {
    loggedIn: [],
    notLogged: [],
    categories: [],
    menuVisible: false,
    cartLen: 0,
    query: "",
  };

  componentDidMount() {
    const loggedIn = ["account", "wishlist"];
    const notLogged = ["login", "register"];
    const categories = [
      "HOME",
      "KIDS & BABY",
      "FASHION",
      "MOBILES",
      "LAPTOPS",
      "APPLIANCES",
    ];
    let cartLen = 0;
    const userCart = this.props.userCart;
    if (service.getCurrentUser() && userCart) cartLen = userCart.length;
    this.setState({ cartLen, loggedIn, notLogged, categories });
  }

  componentDidUpdate(prevProps, _) {
    const userCart = this.props.userCart;
    if (prevProps.userCart !== userCart)
      this.setState({ cartLen: userCart.length });
  }

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

  handleSearch = () => {
    const { query } = this.state;
    // if (query.length > 0) `/search/${query}`
    return;
  };

  render() {
    const { menuVisible, loggedIn, notLogged, cartLen, categories, query } =
      this.state;
    const { user, cartFetch } = this.props;
    const whatToshow = user ? loggedIn : notLogged;
    return (
      <>
        <div className="navbar-container">
          <div className="account-space">
            <Link
              to="/"
              onClick={this.removeVisiblity}
              className="logo-container"
            >
              Shopit.now
            </Link>
            <div className="categories-space">
              {categories.map((data, index) => (
                <Link
                  onClick={this.removeVisiblity}
                  className="categories-link"
                  key={index}
                  to={`/${categoriesLink[index]}`}
                >
                  {data}
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
                to={this.handleSearch}
                className="search-icon"
                type="submit"
              >
                <i class="fa fa-search fa-xs" aria-hidden="true"></i>
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
                <i class="fa fa-shopping-bag" aria-hidden="true"></i>
                {!cartFetch.error ? <span>{cartLen}</span> : <Warning />}
              </Link>
            </div>
            <div onClick={this.menuVisibility} className="menu-toggle">
              {menu}
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
              {cart}
              {!cartFetch.error ? <span>{cartLen}</span> : <Warning />}
            </Link>
          </div>
          <ul>
            <div className="menu-categories-head">Categories</div>
            {categories.map((data, index) => (
              <li className="menu-items" key={index}>
                <Link
                  onClick={this.removeVisiblity}
                  className="menu-categories-links"
                  to={`/${categoriesLink[index]}`}
                >
                  {data}
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

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
