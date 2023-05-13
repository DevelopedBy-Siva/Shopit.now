import React, { Component } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Lottie from "lottie-react";
import loadingAnim from "../../animations/dataload.json";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";
import { getCurrentUser, getJwt } from "../../services/LoginReg";
import axios from "axios";

class WishListBtn extends Component {
  state = {
    loading: false,
    error: null,
    wishlisted: false,
    serverError: false,
  };

  componentDidMount() {
    this.getWishlisted();
  }

  getWishlisted = async () => {
    const productId = this.props.productId;
    if (getCurrentUser() && productId) {
      clearTimeout(this.errorTimer);
      const { id } = getCurrentUser();
      this.setState({ error: null, loading: true, serverError: false });
      await axios
        .get(
          `${URL(
            API_ENDPOINT.userOperations
          )}/wishlist/check/${id}/${productId}`,
          {
            headers: {
              Authorization: getJwt(),
            },
          }
        )
        .then(({ data }) => {
          this.setState({ wishlisted: data, loading: false });
        })
        .catch(() => {
          this.setState({ serverError: true });
          this.errorhandle("Couldn't fetch wishlist", 20000);
        });
    }
  };

  errorhandle = (error, time) => {
    this.setState({ error, loading: false });
    this.errorTimer = setTimeout(() => this.setState({ error: null }), time);
  };

  closeError = () => {
    this.setState({ error: null });
    clearTimeout(this.errorTimer);
  };

  handleWishlist = () => {
    const user = getCurrentUser();
    if (!user) return this.props.handleLogin();
    this.handleWishListOperation(user.id);
  };

  componentWillUnmount() {
    clearTimeout(this.errorTimer);
  }

  handleWishListOperation = async (id) => {
    const productId = this.props.productId;
    if (productId) {
      clearTimeout(this.errorTimer);
      this.setState({ loading: true, error: null });
      await axios
        .post(
          `${URL(API_ENDPOINT.userOperations)}/wishlist/${id}/${productId}`,
          null,
          {
            headers: {
              Authorization: getJwt(),
            },
          }
        )
        .then(({ data }) => {
          this.setState({ wishlisted: data, loading: false });
        })
        .catch(() => {
          this.errorhandle("Error occured. Try after sometime.", 6000);
        });
    }
  };

  render() {
    const { wishlisted, loading, error, serverError } = this.state;
    return (
      <>
        <button
          disabled={loading ? true : serverError ? true : false}
          onClick={this.handleWishlist}
          className="wishlist-btn"
        >
          {loading && (
            <>
              <Lottie
                animationData={loadingAnim}
                className="wishlist-btn-loading"
              />
              <div className="wishlist-btn-loading-c" />
            </>
          )}
          {wishlisted ? <AiFillHeart /> : <AiOutlineHeart />}
          <span>Wishlist{wishlisted && "ed"}</span>
          {serverError && <h4>Cannot use it right now, try again later.</h4>}
        </button>
        {error && (
          <div className={`wishlist-error`}>
            <button onClick={this.closeError}>X</button>
            <h5>{error}</h5>
          </div>
        )}
      </>
    );
  }
}
export default WishListBtn;
