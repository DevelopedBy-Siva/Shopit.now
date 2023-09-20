import axios from "axios";
import { Component } from "react";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";
import { getCurrentUser } from "../../services/LoginReg";

class MainProductContainer extends Component {
  state = {
    product: {
      id: null,
      title: "",
      price: "",
      category: "",
      description: "",
      inStock: 0,
      trending: false,
      thumbnail: {},
      productimage: [],
      productRatings: {
        overallRating: 0,
        usersReviews: [],
      },
      wishListed: false,
    },
    user: {},
    rating: 0,
    review: "",
    overallRating: 0,
    loadedReview: [],
    reviewSubmit: false,
    displayReviewError: false,
    loading: false,
    initialUrl: null,
  };

  currentUser = getCurrentUser();

  componentDidMount() {
    this.setState({ user: this.currentUser });
    this.itemCheck();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname)
      this.itemCheck();
  }

  itemCheck = async () => {
    this.setState({ loading: true });
    const { item } = this.props.match.params;
    await axios
      .get(
        `${URL(API_ENDPOINT.productApi)}/view/get-product/${item}?userId=${
          this.currentUser ? this.currentUser.id : ""
        }`
      )
      .then(({ data: found }) => {
        this.successfullSubmission(found);
      })
      .catch(() => (window.location = "/not-found"));
  };

  successfullSubmission = (found) => {
    const initialImg = found.productimage[0];
    const initialUrl = `data:${initialImg.type};base64,${initialImg.picByte}`;
    const loadedReview = found.productRatings.usersReviews.filter(
      (i, index) => index < 3
    );
    const overallRating =
      Math.round(found.productRatings.overallRating * 10) / 10;
    this.setState({
      product: found,
      loading: false,
      loadedReview,
      overallRating,
      initialUrl,
    });
  };

  checkSubmission = (user) => {
    const { product } = this.state;
    const check = product.productRatings.usersReviews.find(
      (i) => i.email === user
    );
    if (check) return true;
    return false;
  };

  refactorTheChanges = (product, newReview, loadedReview) => {
    const userReview = [newReview, ...product.productRatings.usersReviews];
    const updatedProduct = { ...product };
    updatedProduct.productRatings.usersReviews = userReview;
    const updatedLoadedReview = [newReview, ...loadedReview];
    let newOverallRating = 0;
    const numberOfReviews = product.productRatings.usersReviews.length;
    for (let i = 0; i < numberOfReviews; i++) {
      newOverallRating += product.productRatings.usersReviews[i].rating;
    }
    const total = Math.round((newOverallRating / numberOfReviews) * 10) / 10;
    this.setState({
      product: updatedProduct,
      loadedReview: updatedLoadedReview,
      review: "",
      rating: 0,
      overallRating: total,
    });
  };

  handleLoadMore = () => {
    const { product, loadedReview } = this.state;
    const len = product.productRatings.usersReviews.length;
    const size = loadedReview.length;
    const reviews = product.productRatings.usersReviews.filter(
      (i, index) => index <= size
    );
    const container = document.querySelector(".review-load-more");
    if (len <= size) container.classList.add("remove-review-load-more");
    else container.classList.remove("remove-review-load-more");
    this.setState({ loadedReview: reviews });
  };

  handleImageSelect = (e) => {
    const targetContainer = document.querySelector(".full-image img");
    const currentTarget = document.querySelectorAll(".image-container");
    for (let current of currentTarget)
      current.classList.remove("selected-image");
    const imageUrl = e.target.src;
    targetContainer.src = imageUrl;
    e.target.parentElement.classList.add("selected-image");
  };

  handleRelatedItemClick = (item) => {
    window.location = `/products/${item}`;
  };

  changeRating = (rating) => {
    const starRating = document.querySelector(
      ".star-rating-container .star-rating-error"
    );
    starRating.classList.remove("star-rating-error-display");
    this.setState({ rating });
  };

  handleReviewOnChange = (event) => {
    const value = event.target.value;
    if (value.trim().length >= 10) {
      const submitBtn = document.querySelector(".review-btn-container span");
      submitBtn.classList.remove("display-submit-error");
    }
    this.setState({ review: value });
  };
  handleLogin = () => {
    return this.props.history.push({
      pathname: "/login",
      state: {
        from: this.props.location,
      },
    });
  };
  handleBuyNow = () => {
    this.props.history.push("/order-processing");
  };

  toggleWishlist = () => {
    this.setState((prevState) => ({
      product: {
        ...prevState.product,
        wishListed: !prevState.product.wishListed,
      },
    }));
  };

  handleOutOfStock = () => {
    this.setState((prevState) => ({
      product: {
        ...prevState.product,
        inStock: 0,
      },
    }));
  };
}

export default MainProductContainer;
