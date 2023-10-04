import React, { Component, useState } from "react";
import Lottie from "lottie-react";
import loadAnim from "../../../animations/smallLoad.json";
import empty from "../../../animations/empty-box.json";
import serverError from "../../../animations/server-error.json";
import Loader from "../../Loader";
import toast from "../../Toast";
import { formUrl as URL, api_endpoints } from "../../../api/api";
import { getJwt } from "../../../services/LoginReg";
import axios from "axios";

class HandleAd extends Component {
  render() {
    const { loading, error, data, handleAdData } = this.props;
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
              <EachAd
                imgUrl={imgUrl}
                item={i}
                key={index}
                handleAdData={handleAdData}
              />
            );
          })
        )}
      </div>
    );
  }
}

export default HandleAd;

function EachAd({ item, imgUrl, handleAdData }) {
  const [loading, setLoading] = useState(false);

  const handleRemoveAd = async (productId) => {
    setLoading(true);
    await axios
      .delete(`${URL(api_endpoints.productApi)}/mark/marks/${productId}`, {
        headers: {
          Authorization: getJwt(),
        },
      })
      .then(() => {
        handleAdData(productId);
        toast.info("Advertisement removed");
      })
      .catch(() => {
        toast.error("Something went wrong");
      });

    setLoading(false);
  };

  return (
    <div className="each-ad">
      <div>
        <img src={imgUrl} alt="advertisement" />
        <h4>{item.productName}</h4>
      </div>
      <div className="each-ad-btn">
        <button
          disabled={loading}
          style={loading ? { background: "red" } : {}}
          onClick={() => handleRemoveAd(item.productId)}
        >
          {loading ? (
            <Loader style={{ width: "18px", height: "18px" }} />
          ) : (
            "Remove"
          )}
        </button>
      </div>
    </div>
  );
}
