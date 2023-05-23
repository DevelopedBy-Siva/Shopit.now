import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/not-found.css";

class NotFound extends Component {
  state = {};
  render() {
    return (
      <>
        <div className="not-found-container">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>Uh oh, we can't seem to find the page you're looking for.</p>
          <Link className="go-home" to="/">
            Go Home
          </Link>
        </div>
      </>
    );
  }
}

export default NotFound;
