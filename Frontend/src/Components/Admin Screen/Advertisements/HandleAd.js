import React, { Component } from "react";
import Lottie from "lottie-react";
import loadAnim from "../../../animations/smallLoad.json";
import empty from "../../../animations/empty-box.json";
import serverError from "../../../animations/server-error.json";

class HandleAd extends Component {
  render() {
    const { deleteLoading, deleteIndex, removeAd, loading, error, data } =
      this.props;
    return (
      <div className="ad-handle-container">
        {loading ? (
          <Lottie className="ad-handle-load-anim" animationData={loadAnim} />
        ) : error ? (
          <div className="ad-handle-server-anim">
            <Lottie loop={false} animationData={serverError} />
            <h5>Server error</h5>
          </div>
        ) : data.length < 1 ? (
          <div className="ad-handle-server-anim">
            <Lottie loop={false} animationData={empty} />
            <h5>No advertisement</h5>
          </div>
        ) : (
          data.map((i, index) => {
            const imgUrl = `data:${i.type};base64,${i.picByte}`;
            return (
              <div className="each-ad" key={index}>
                {deleteLoading && index === deleteIndex && (
                  <div className="each-ad-cover" />
                )}
                <div>
                  <img src={imgUrl} alt="advertisement" />
                  <h4>{i.productName}</h4>
                </div>
                <span>
                  <button
                    disabled={deleteLoading ? true : false}
                    onClick={() => removeAd(i.productId, index)}
                  >
                    Remove
                  </button>
                </span>
              </div>
            );
          })
        )}
      </div>
    );
  }
}

export default HandleAd;
