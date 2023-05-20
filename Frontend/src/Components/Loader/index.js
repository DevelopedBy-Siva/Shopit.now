import React from "react";
import "../../css/loading-ring.css";

export default function Loader({ style = {} }) {
  return <span style={style} class="loader"></span>;
}
