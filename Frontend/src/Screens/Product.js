import React from "react";
import {
  MainProductContainer,
  ProductDetails,
  AddNowBtn,
  RecommendedProducts,
  ProductReviewContainer,
} from "../Refactor/ItemScreenRefactor";
import Lottie from "lottie-react";
import load from "../animations/dataload.json";
import "../css/product.css";
import WishListBtn from "../Components/Item Screen/WishListBtn";

class Product extends MainProductContainer {
  render() {
    const {
      user,
      loading,
      initialUrl,
      displayReviewError,
      reviewSubmit,
      loadedReview,
      product,
      rating,
      review,
      overallRating,
    } = this.state;
    return (
      <>
        <div className="product-main-container">
          {loading ? (
            <Lottie animationData={load} className="product-loader" />
          ) : (
            <>
              <div className="product-details-header">
                <ProductDetails
                  overallRating={overallRating}
                  starDimension="16px"
                  starSpacing="1px"
                  product={product}
                />
              </div>
              <div className="product-container">
                <div className="product-image-container">
                  <div className="all-images">
                    {product.productimage.map((i, index) => {
                      const imgUrl = `data:${i.type};base64,${i.picByte}`;
                      return (
                        <div
                          key={index}
                          className={
                            index === 0
                              ? "image-container selected-image"
                              : "image-container"
                          }
                        >
                          <img
                            onClick={this.handleImageSelect}
                            src={imgUrl}
                            alt="Product"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="full-image">
                    <img src={initialUrl} alt="Product Cover" />
                  </div>
                </div>
                <div className="product-details-container">
                  <ProductDetails
                    overallRating={overallRating}
                    starDimension="20px"
                    starSpacing="2px"
                    product={product}
                  />
                  <AddNowBtn
                    handleBuyNow={this.handleBuyNow}
                    handleLogin={this.handleLogin}
                    product={product}
                  />
                  <WishListBtn
                    productId={product.id}
                    handleLogin={this.handleLogin}
                  />
                </div>
              </div>
              <div className="small-screen-btns">
                <AddNowBtn
                  handleBuyNow={this.handleBuyNow}
                  handleLogin={this.handleLogin}
                  product={product}
                />
                <WishListBtn
                  productId={product.id}
                  handleLogin={this.handleLogin}
                />
              </div>
              <div className="product-description-container">
                <h5>Product Description</h5>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                  Contrary to popular belief, Lorem Ipsum is not simply random
                  text. It has roots in a piece of classical Latin literature
                  from 45 BC, making it over 2000 years old. Richard McClintock,
                  a Latin professor at Hampden-Sydney College in Virginia,
                  looked up one of the more obscure Latin words, consectetur,
                  from a Lorem Ipsum passage, and going through the cites of the
                  word in classical literature, discovered the undoubtable
                  source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of
                  "de Finibus Bonorum et Malorum" (The Extremes of Good and
                  Evil) by Cicero, written in 45 BC. This book is a treatise on
                  the theory of ethics, very popular during the Renaissance. The
                  first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
                  comes from a line in section 1.10.32. The standard chunk of
                  Lorem Ipsum used since the 1500s is reproduced below for those
                  interested. Sections 1.10.32 and 1.10.33 from "de Finibus
                  Bonorum et Malorum" by Cicero are also reproduced in their
                  exact original form, accompanied by English versions from the
                  1914 translation by H. Rackham.
                </p>
              </div>
              <div className="reviews-container">
                <ProductReviewContainer
                  displayReviewError={displayReviewError}
                  reviewSubmit={reviewSubmit}
                  overallRating={overallRating}
                  loadedReview={loadedReview}
                  handleLoadMore={this.handleLoadMore}
                  userReview={product.productRatings}
                  handleReviewSubmit={this.handleReviewSubmit}
                  review={review}
                  onChange={this.handleReviewOnChange}
                  rating={rating}
                  changeRating={this.changeRating}
                  user={user}
                  handleLogin={this.handleLogin}
                />
              </div>
              <RecommendedProducts productId={product.id} />
            </>
          )}
        </div>
      </>
    );
  }
}

export default Product;
