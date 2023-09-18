import React, { useEffect, useState } from "react";
import { formUrl as URL, api_endpoints } from "../api/api";
import { getCurrentUser, getJwt } from "../services/LoginReg";
import axios from "axios";
import loadingAnim from "../animations/loading.json";
import emptyAnim from "../animations/empty-box.json";
import Lottie from "lottie-react";
import Loader from "../Components/Loader";
import toast from "../Components/Toast";
import Currency from "../Components/Item Screen/Currency";
import { Link } from "react-router-dom";

import "../css/wishlist.css";

export default function Wishlist() {
  const [api, setApi] = useState({
    loading: true,
    error: null,
    data: [],
  });

  useEffect(() => {
    async function getData() {
      const user = getCurrentUser();
      await axios
        .get(`${URL(api_endpoints.userOperations)}/wishlist/${user.id}`, {
          headers: {
            Authorization: getJwt(),
          },
        })
        .then(({ data }) => {
          setApi({ loading: false, error: null, data });
        })
        .catch(() => {
          setApi({ loading: false, error: "error", data: [] });
        });
    }
    getData();
  }, []);

  return (
    <div className="user-wishlist-container contain">
      <div className="user-wishlist-header">
        <h1>Your Wishlist</h1>
      </div>
      <div className="user-wishlists">
        {api.loading ? (
          <Lottie
            className="wishlist-loading-anim"
            animationData={loadingAnim}
          />
        ) : api.error ? (
          <div className="user-wishlist-error">
            Sorry, we couldn't retrieve the wishlist at the moment. Please try
            again later.
          </div>
        ) : api.data.length === 0 ? (
          <div className="user-wishlist-empty">
            <Lottie loop={false} animationData={emptyAnim} />
            <p>Nothing is in the wishlist</p>
          </div>
        ) : (
          <div className="user-wishlist-box-container">
            {api.data.map((item, index) => (
              <BoxDetails key={index} item={item} api={api} setApi={setApi} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BoxDetails({ item, api, setApi }) {
  const [remove, setRemove] = useState(false);

  const handleWishList = async (wid) => {
    const user = getCurrentUser();
    setRemove(true);

    await axios
      .delete(
        `${URL(api_endpoints.userOperations)}/wishlist/${user.id}/${wid}`,
        {
          headers: {
            Authorization: getJwt(),
          },
        }
      )
      .then(() => {
        const newData = api.data.filter((item) => item.wid !== wid);
        setApi({ ...api, data: newData });
        toast.info("Item removed from wishlist");
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
    setRemove(false);
  };

  const { wid, pid, name, thumbnail, price } = item;
  const imgUrl = `data:${thumbnail.type};base64,${thumbnail.picByte}`;
  return (
    <div className="user-wishlist-box">
      {!remove && (
        <Link to={`/products/${pid}`} className="user-wishlist-overlay" />
      )}
      <img src={imgUrl} alt="user-wishlist" />
      <div className="user-wishlist-details">
        <h4>{name}</h4>
        <div className="user-wishlist-currency">
          <Currency curr={price} />
        </div>
        <div className="user-wishlist-button-container">
          <button disabled={remove} onClick={() => handleWishList(wid)}>
            {remove ? (
              <Loader style={{ width: "16px", height: "16px" }} />
            ) : (
              "Remove from wishlist"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
