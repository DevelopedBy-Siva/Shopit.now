import { useEffect, useState } from "react";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";
import axios from "axios";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import SkeletonLoader from "../Loader/SkeletonLoader";
import useCarouselNavigate from "../Hooks/useCarouselNavigation";
import "../../css/todaysdeal.css";

function TodaysDeals() {
  const [api, setApi] = useState({
    loading: true,
    data: [],
    error: false,
  });

  const { scrollRef, itemRef, btnActive, handleScrollLeft, handleScrollRight } =
    useCarouselNavigate(api.data);

  useEffect(() => {
    setApi({ data: [], loading: true, error: false });
    axios
      .get(`${URL(API_ENDPOINT.productApi)}/view/new-deals`)
      .then(({ data }) => {
        setApi({ data, loading: false });
      })
      .catch(() => {
        setApi({ data: [], loading: false, error: true });
      });
  }, []);

  const { data, loading, error } = api;
  return (
    <div className="todays-deal-container">
      <div className="todays-deal-header">
        <h2>Today's Deals</h2>
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
      <div className="todays-deal-sub-container">
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <span className="todays-deal-error">Couldn't load today's deals</span>
        ) : (
          <div ref={scrollRef} className="todaysdeal-container">
            {data.map((item) => {
              const { id, title, thumbnail, price } = item;
              const fraudPrice = price * 2;
              const imgUrl = `data:${thumbnail.type};base64,${thumbnail.picByte}`;
              return (
                <div className="item-container" ref={itemRef} key={id}>
                  <img src={imgUrl} alt="todays-deals" />
                  <div className="todaysdeals-details">
                    <h4>{title}</h4>
                    <h5>${price}</h5>
                    <h6>${fraudPrice}</h6>
                  </div>
                  <span className="todaysdeal-discount">-50%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TodaysDeals;
