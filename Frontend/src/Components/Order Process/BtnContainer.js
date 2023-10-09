import React, { Component } from "react";
import Loader from "../Loader";

class BtnContainer extends Component {
  state = {};
  render() {
    const {
      handleGoBack,
      handleContinue,
      disableBtn,
      disable,
      disableBack,
      load = false,
    } = this.props;

    return (
      <div className="order-process-btn-container">
        <button
          className={disableBack ? disableBtn : ""}
          disabled={disableBack}
          onClick={handleGoBack}
        >
          Back
        </button>
        <button
          disabled={disable}
          className={disableBtn}
          onClick={handleContinue}
        >
          {load && disable ? (
            <Loader style={{ width: "17px", height: "17px" }} />
          ) : (
            "Continue"
          )}
        </button>
      </div>
    );
  }
}

export default BtnContainer;
