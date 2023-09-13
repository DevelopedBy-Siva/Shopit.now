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
      <div className="product-main-container contain">
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
              <p>{product.description}</p>
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
    );
  }
}

export default Product;
