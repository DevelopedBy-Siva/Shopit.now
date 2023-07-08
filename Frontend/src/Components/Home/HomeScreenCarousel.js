import React, { Component } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "../../css/carousel.css";
import axios from "axios";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";
import SkeletonLoader from "../Loader/SkeletonLoader";

class HomeScreenCarousel extends Component {
  state = {
    loading: true,
    carouselData: [],
    error: false,
  };
  componentDidMount() {
    this.getAdvertisments();
  }

  async getAdvertisments() {
    this.setState({ loading: true, error: false });
    await axios
      .get(`${URL(API_ENDPOINT.productApi)}/view/advertisements`)
      .then(({ data }) => {
        this.setState({ carouselData: data, loading: false });
      })
      .catch(() => {
        this.setState({ error: true, loading: false });
      });
  }

  render() {
    const { carouselData, error, loading } = this.state;
    let settings = {
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      arrows: false,
      autoplaySpeed: 5000,
    };
    return (
      <div className="carousel-container">
        {loading ? (
          <SkeletonLoader size={1} />
        ) : error ? (
          <div className="ad-error">Couldn't load advertisements</div>
        ) : (
          <Slider {...settings}>
            {carouselData.map((item) => {
              const imgUrl = `data:${item.type};base64,${item.picByte}`;
              return (
                <div key={item.productId} className="carousel">
                  <Link to={`/products/${item.productId}`}>
                    <img src={imgUrl} alt="carousel" />
                  </Link>
                </div>
              );
            })}
          </Slider>
        )}
      </div>
    );
  }
}

export default HomeScreenCarousel;
