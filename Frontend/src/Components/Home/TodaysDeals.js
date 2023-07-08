import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";
import axios from "axios";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import SkeletonLoader from "../Loader/SkeletonLoader";
import CarouselNavigate from "./CarouselNavigate";
import "../../css/todaysdeal.css";

class TodaysDeals extends CarouselNavigate {
  state = {
    data: [],
    loading: true,
    error: false,
  };
  async componentDidMount() {
    this.setState({ loading: true, error: false });
    await axios
      .get(`${URL(API_ENDPOINT.productApi)}/view/new-deals`)
      .then(({ data }) => {
        this.setState({ data, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  }

  render() {
    const { data, loading, error } = this.state;
    const { onClick } = this.props;

    return (
      <div className="todays-deal-container">
        <div className="todays-deal-header">
          <h2>Today's Deals</h2>
          {!loading && !error && data.length > 0 && (
            <div className="home-corousel-btns">
              <button onClick={this.handleScrollLeft}>
                <BiChevronLeft />
              </button>
              <button onClick={this.handleScrollRight}>
                <BiChevronRight />
              </button>
            </div>
          )}
        </div>
        <div className="todays-deal-sub-container">
          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <span className="todays-deal-error">
              Couldn't load today's deals
            </span>
          ) : (
            <div ref={this.scrollRef} className="todaysdeal-container">
              {data.map((item) => {
                const { id, title, thumbnail, price } = item;
                const fraudPrice = price * 2;
                const imgUrl = `data:${thumbnail.type};base64,${thumbnail.picByte}`;
                return (
                  <div
                    onClick={() => onClick(item)}
                    className="item-container"
                    ref={this.itemRef}
                    key={id}
                  >
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
}

export default TodaysDeals;
