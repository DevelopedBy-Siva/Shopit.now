import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Loader from "../../Components/Loader";
import ProductStars from "./ProductStars";
import { formUrl as URL, api_endpoints } from "../../api/api";
import { getJwt } from "../../services/LoginReg";
import toast from "../../Components/Toast";

function ProductReviewContainer({
  user,
  overallRating,
  userReview,
  productId,
  updateOverallRating,
}) {
  const [loading, setLoading] = useState(false);
  const [myReview, setMyReview] = useState({
    text: "",
    rating: 0,
  });
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [show, setShow] = useState(false);

  const history = useHistory();

  const redirect = () => history.push("/login", { redirect: history.location });

  function changeRating(rating) {
    if (!user) return redirect();
    setError(null);
    setMyReview({ ...myReview, rating });
  }

  function changeReview(e) {
    setError(null);
    setMyReview({ ...myReview, text: e.target.value });
  }

  async function submitReview() {
    if (!user) return redirect();

    if (myReview.text.trim().length < 3)
      return setError(
        "Please enter a review that is between 3 and 255 characters in length"
      );
    if (myReview.rating === 0)
      return setError("Please provide your rating out of 5");
    setLoading(true);

    const request = {
      name: user.fullname,
      email: user.sub,
      rating: myReview.rating,
      review: myReview.text,
    };
    await axios
      .post(
        `${URL(api_endpoints.productApi)}/add-product-review/${productId}`,
        request,
        {
          headers: { Authorization: getJwt() },
        }
      )
      .then(({ status }) => {
        setMyReview({ text: "", rating: 0 });
        if (status === 204)
          return toast.info("Sorry, you have already submitted the review");
        const usersReviews = [...allReviews];
        usersReviews.unshift({ ...request });
        setAllReviews(usersReviews);
        let rating = 0;
        for (let index = 0; index < usersReviews.length; index++)
          rating += usersReviews[index].rating;
        const overall = Math.round((rating / usersReviews.length) * 10) / 10;
        updateOverallRating(overall);
      })
      .catch(() => {
        toast.error("Oops, something went wrong");
      });
    setLoading(false);
  }

  useEffect(() => {
    if (!user || !userReview || !Array.isArray(userReview.usersReviews)) return;

    let found = allReviews.some((item) => item.email === user.sub);
    if (found) setAlreadySubmitted(true);
  }, [user, userReview, allReviews]);

  useEffect(() => {
    if (!userReview || !Array.isArray(userReview.usersReviews)) return;
    if (!user) return setAllReviews([...userReview.usersReviews]);

    const filteredReviews = userReview.usersReviews.filter(
      (item) => item.email !== user.sub
    );
    const currentUserReview = userReview.usersReviews.find(
      (item) => item.email === user.sub
    );
    if (currentUserReview) filteredReviews.unshift(currentUserReview);
    setAllReviews([...filteredReviews]);
  }, [user, userReview]);
  return (
    <>
      <h2>Customer Reviews</h2>
      <div className="reviews-sub-container">
        <div className="reviews-sub-container-rating">
          <h3>
            {overallRating} <span>out of 5</span>
          </h3>
          <div>
            <ProductStars
              starRatedColor="orange"
              rating={overallRating}
              totalReviews={allReviews.length}
              showRaters={true}
              starDimension="25px"
              starSpacing="1px"
            />
          </div>
        </div>
        <div className="reviews-sub-container-review">
          <div className="review-input-container">
            <h4>Write your review</h4>
            <div className="star-rating-container">
              <ProductStars
                starDimension="30px"
                starSpacing="1px"
                starRatedColor="orange"
                {...(loading || alreadySubmitted ? {} : { changeRating })}
                rating={myReview.rating}
              />
            </div>
            <textarea
              placeholder={
                !user
                  ? "Please log in to submit the review..."
                  : alreadySubmitted
                  ? "You have already submitted the review..."
                  : "Enter the review (max character: 255)..."
              }
              disabled={loading || alreadySubmitted}
              maxLength={255}
              rows={4}
              value={myReview.text}
              onChange={changeReview}
              onClick={() => !user && redirect()}
            />
            {!user || alreadySubmitted ? (
              ""
            ) : (
              <button onClick={submitReview} disabled={loading}>
                {loading ? (
                  <Loader style={{ width: "16px", height: "16px" }} />
                ) : (
                  "Submit"
                )}
              </button>
            )}
            {error && <p className="review-input-error">{error}</p>}
          </div>
          <div className="all-user-reviews">
            {allReviews
              .slice(0, show ? allReviews.length : 3)
              .map((i, index) => (
                <div className="all-user-reviews-sub-container" key={index}>
                  <span className="review-avatar">{i.name.charAt(0)}</span>
                  <div className="each-review-sub-container">
                    <span className="reviewer-name">{i.name}</span>
                    <ProductStars
                      rating={i.rating}
                      starDimension="15px"
                      starSpacing="1px"
                      starRatedColor="orange"
                    />
                    <h5>{i.review}</h5>
                  </div>
                </div>
              ))}
          </div>
          {allReviews.length > 3 && (
            <div className="show-more-reviews">
              <span />
              <span onClick={() => setShow(!show)}>
                {!show ? "Show more" : "Hide"}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductReviewContainer;
