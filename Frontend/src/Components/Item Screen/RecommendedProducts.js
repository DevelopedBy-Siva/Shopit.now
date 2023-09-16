import React, { useEffect, useState } from "react";
import axios from "axios";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import SkeletonLoader from "../Loader/SkeletonLoader";
import useCarouselNavigate from "../Hooks/useCarouselNavigation";
import { Link, useParams } from "react-router-dom";
import "../../css/recommended-products.css";
import Currency from "./Currency";

function RecommendedProducts({ productId }) {
  const [api, setApi] = useState({
    loading: true,
    data: [],
    error: false,
  });

  const params = useParams();

  const { scrollRef, itemRef, btnActive, handleScrollLeft, handleScrollRight } =
    useCarouselNavigate(api.data);

  useEffect(() => {
    let id = productId;
    if (!id && params["item"]) id = params["item"];
    setApi({ data: [], loading: true, error: false });
    axios
      .get(`${URL(API_ENDPOINT.productApi)}/view/category/${id}`)
      .then(({ data }) => {
        setApi({ data, loading: false });
      })
      .catch(() => {
        setApi({ data: [], loading: false, error: true });
      });
  }, [params, productId]);

  const { data, error, loading } = api;
  return (
    <div className="recommended-products-main-container">
      <div className="recommended-products-main-header">
        <h2>Recommended Products</h2>
        {!loading && !error && data.length > 0 && (
          <div className="home-corousel-btns">
            <button onClick={handleScrollLeft} disabled={btnActive.left}>
              <BiChevronLeft />
            </button>
            <button onClick={handleScrollRight} disabled={btnActive.right}>
              <BiChevronRight />
            </button>
          </div>
        )}
      </div>

      <div className="recommended-products-main-sub-container">
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <span className="recommended-products-error">
            Couldn't load the products.
          </span>
        ) : (
          <div className="recommended-products-container" ref={scrollRef}>
            {data.map((item) => {
              const { id, title, thumbnail, price } = item;
              const imgUrl = `data:${thumbnail.type};base64,${thumbnail.picByte}`;
              return (
                <Link
                  to={`/products/${id}`}
                  ref={itemRef}
                  key={id}
                  className="recommended-products-item-container"
                >
                  <img src={imgUrl} alt="recommended-productss" />
                  <div className="recommended-products-details">
                    <h4>{title}</h4>
                    <div className="recommended-products-currency">
                      <Currency curr={price} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommendedProducts;
