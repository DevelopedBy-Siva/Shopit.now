import React, { Component } from "react";
import axios from "axios";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Lottie from "lottie-react";
import loadAnim from "../../animations/dataload.json";
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
        <h2>Best sellers in Mobiles, Laptops & Accessories</h2>
        {loading ? (
          <Lottie animationData={loadAnim} className="bestseller-loading" />
        ) : error ? (
          <div className="bestseller-error">Couldn't load the products.</div>
        ) : (
          <>
            <div ref={this.scrollRef} className="bestseller-container">
              {data.map((item) => {
                const { id, title, thumbnail } = item;
                const imgUrl = `data:${thumbnail.type};base64,${thumbnail.picByte}`;
                return (
                  <div
                    onClick={() => onClick(item)}
                    key={id}
                    className="best-seller-item-container"
                  >
                    <img src={imgUrl} alt="bestsellers" />
                    <h4>{title}</h4>
                  </div>
                );
              })}
            </div>
            <button onClick={this.handleScrollLeft} id="bestseller-btn-l">
              <FaChevronLeft />
            </button>
            <button onClick={this.handleScrollRight} id="bestseller-btn-r">
              <FaChevronRight />
            </button>
          </>
        )}
      </div>
    );
  }
}

export default BestSellers;
