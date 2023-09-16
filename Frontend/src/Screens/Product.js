import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Lottie from "lottie-react";

import {
  MainProductContainer,
  ProductDetails,
  RecommendedProducts,
  ProductReviewContainer,
} from "../Refactor/ItemScreenRefactor";
import load from "../animations/dataload.json";
import "../css/product.css";
import ProductOperations from "../Components/Item Screen/ProductOperations";

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
                <div className="product-image-wrapper">
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
              </div>
              <div className="product-details-container">
                <ProductDetails
                  overallRating={overallRating}
                  starDimension="18px"
                  starSpacing="1px"
                  product={product}
                />

                <ProductOperations user={user} product={product} />
                <div className="product-description-container">
                  <h5>Product Description</h5>
                  <ReactMarkdown
                    components={{
                      h1: "h6",
                      h2: "h6",
                      h3: "h6",
                      h4: "h6",
                      h5: "h6",
                    }}
                    children={product.description}
                    remarkPlugins={[remarkGfm]}
                  />
                </div>
              </div>
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
