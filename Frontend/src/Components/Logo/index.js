import React from "react";
import { Link } from "react-router-dom";

import "../../css/logo.css";

export default function index({ style }) {
  return (
    <Link to="/" className="app-logo-container">
      <span style={style}>Shopit</span>
      <span>.now</span>
    </Link>
  );
}
