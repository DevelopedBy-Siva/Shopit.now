import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactFocusLock from "react-focus-lock";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { BsSearch } from "react-icons/bs";
import { RiShoppingCartFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import LogoContainer from "../Logo";
import * as service from "../../services/LoginReg";

import "../../css/navbar-style.css";

const categories = [
  {
    name: "home",
    link: "",
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
  {
    name: "fashion",
    link: "fashions",
  },
  {
    name: "kids & babies",
    link: "kidsandbaby",
  },
];

const loggedIn = ["account", "wishlist"];
const notLogged = ["login", "register"];

export default function Navbar({ user }) {
  const history = useHistory();

  const [menuVisible, setMenuVisible] = useState(false);
  const [query, setQuery] = useState("");

  const menuVisibility = () => {
    setMenuVisible(!menuVisible);
  };

  const removeVisiblity = () => {
    setMenuVisible(false);
  };

  const handleSearchQuery = (e) => {
    setQuery(e.currentTarget.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.length > 0) history.push(`/search/${query}`);
    return;
  };

  const whatToshow = user ? loggedIn : notLogged;

  const userCart = useSelector((state) => state.CartOperations);
  const { cart, loading } = userCart;

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-wrapper contain">
          <div className="account-space">
            <LogoContainer />
            <div className="categories-space">
              {categories.map((data, index) => (
                <Link
                  onClick={removeVisiblity}
                  className="categories-link"
                  key={index}
                  to={`/${data.link}`}
                >
                  {data.name}
                </Link>
              ))}
            </div>
            <form className="searchbar" onSubmit={handleSearch}>
              <input
                onChange={handleSearchQuery}
                value={query}
                placeholder="Search..."
              />
              <button
                onClick={removeVisiblity}
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
                  onClick={removeVisiblity}
                  className="user-links"
                  to={`/${data}`}
                >
                  {data}
                </Link>
              ))}
              <Link to="/cart" onClick={removeVisiblity} className="cart-icon">
                <RiShoppingCartFill className="icon" />
                {!loading && <span>{cart.length}</span>}
              </Link>
            </div>
            <div onClick={menuVisibility} className="menu-toggle">
              <GiHamburgerMenu className="icon" />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {menuVisible && (
          <MenuContainer
            menuVisibility={menuVisibility}
            whatToshow={whatToshow}
            removeVisiblity={removeVisiblity}
            cartLen={cart.length}
            loading={loading}
            categories={categories}
            user={user}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MenuContainer({
  menuVisibility,
  whatToshow,
  removeVisiblity,
  cartLen,
  categories,
  user,
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  });

  return (
    <ReactFocusLock>
      <div className="nav-menu">
        <motion.div
          className="menu-cover"
          onClick={menuVisibility}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        >
          <IoClose className="icon" />
        </motion.div>
        <motion.div
          className="menuVisible"
          initial={{ x: "100%" }}
          animate={{
            x: 0,
          }}
          exit={{
            x: "100%",
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        >
          <div className="menu-user-details">
            {whatToshow.map((data, index) => (
              <span key={index}>
                <Link
                  onClick={removeVisiblity}
                  className="menu-user-links"
                  to={`/${data}`}
                >
                  {data}
                </Link>
              </span>
            ))}
            <Link to="/cart" onClick={removeVisiblity} className="cart-icon">
              <RiShoppingCartFill className="icon" />
              <span>{cartLen}</span>
            </Link>
          </div>
          <div className="menu-options-wrapper">
            <ul>
              <div className="menu-categories-head">Categories</div>
              {categories.map((data, index) => (
                <li className="menu-items" key={index}>
                  <Link
                    onClick={removeVisiblity}
                    className="menu-categories-links"
                    to={`/${data.link}`}
                  >
                    {data.name}
                  </Link>
                </li>
              ))}
            </ul>
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
          </div>
        </motion.div>
      </div>
    </ReactFocusLock>
  );
}
