import React, { Component } from "react";
import axios from "axios";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import SkeletonLoader from "../Loader/SkeletonLoader";
import "../../css/bestseller.css";

class BestSellers extends Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
  }

  state = {
    loading: true,
    data: [],
    error: false,
  };
  componentDidMount() {
    this.getProducts();
  }

  getProducts = async () => {
    this.setState({ loading: true, error: false });
    await axios
      .get(`${URL(API_ENDPOINT.productApi)}/view/bestsellers`)
      .then(({ data }) => {
        this.setState({ data, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  };

  handleScrollLeft = () => {
    this.scrollRef.current.scrollLeft -= 400;
  };

  handleScrollRight = () => {
    this.scrollRef.current.scrollLeft += 400;
  };

  render() {
    const { data, error, loading } = this.state;
    const { onClick } = this.props;
    return (
      <div className="bestseller-main-container">
        <div className="bestseller-main-header">
          <h2>Best sellers in Mobiles, Laptops & Accessories</h2>
          {!loading && !error && data.length > 0 && (
            <div className="home-corousel-btns">
              <button disabled>
                <BiChevronLeft />
              </button>
              <button>
                <BiChevronRight />
              </button>
            </div>
          )}
        </div>

        <div className="bestseller-main-sub-container">
          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <span className="bestseller-error">
              Couldn't load the products.
            </span>
          ) : (
            <>
              <div ref={this.scrollRef} className="bestseller-container">
                {data.map((item) => {
                  const { id, title, thumbnail, price } = item;
                  console.log(item);
                  const imgUrl = `data:${thumbnail.type};base64,${thumbnail.picByte}`;
                  return (
                    <div
                      onClick={() => onClick(item)}
                      key={id}
                      className="best-seller-item-container"
                    >
                      <img src={imgUrl} alt="bestsellers" />
                      <div className="bestseller-details">
                        <h4>{title}</h4>
                        <h5>${price}</h5>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default BestSellers;
