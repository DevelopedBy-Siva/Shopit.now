import React from "react";
import Lottie from "lottie-react";
import loading from "../../../animations/loading.json";
import serverError from "../../../animations/server-error.json";
import ProductDetailsContainer from "./ProductDetailsContainer";
import AdminProductsMainContainer from "./AdminProductsMainContainer";
import { FaSearch } from "react-icons/fa";
import "../../../css/adminProducts.css";
import Pagination from "../../Home/Pagination";

class AdminProducts extends AdminProductsMainContainer {
  render() {
    const {
      search,
      productCount,
      start,
      end,
      pageSize,
      currentPage,
      submitTrendingId,
      submitTrending,
      dataLoaded,
      products,
      unknownError,
    } = this.state;
    return (
      <div className="admin-product-container">
        <div className="admin-product-container-search">
          <input
            value={search}
            onChange={this.handleSearch}
            placeholder="Search products....."
          />
          <button onClick={this.serverSearch}>
            <FaSearch className="search-icon" />
          </button>
        </div>
        {unknownError ? (
          <div className="unknown-error">
            <Lottie
              animationData={serverError}
              loop={false}
              className="server-error"
            />
            <h5>Internal server error occured. Please try after sometime...</h5>
          </div>
        ) : dataLoaded ? (
          <Lottie
            animationData={loading}
            className="admin-products-loading"
            loop
            autoPlay
          />
        ) : productCount === 0 ? (
          <div className="product-empty">
            <h4>There are no products available...</h4>
            <button
              onClick={() => this.props.history.replace("/admin/add-product")}
            >
              Add Products
            </button>
          </div>
        ) : (
          <>
            <div className="admin-product-details-tb-wrapper">
              <table className="admin-product-details">
                <tbody>
                  <tr>
                    <th>Product</th>
                    <th>Stock</th>
                    <th>Trending</th>
                  </tr>
                  {products.map((item, index) => (
                    <ProductDetailsContainer
                      item={item}
                      key={index}
                      handleProductEdit={this.handleProductEdit}
                      handleStockEdit={this.handleStockEdit}
                      handleTrending={this.handleTrending}
                      submitTrending={submitTrending}
                      submitTrendingId={submitTrendingId}
                      toggleTrend={this.toggleTrend}
                      index={index}
                      toggleEdit={this.toggleEditDetails}
                      updateProductDetails={this.updateProductDetails}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pages">
              {productCount > pageSize && (
                <button
                  onClick={this.decrementPage}
                  disabled={currentPage <= 1}
                  className={`page-nxt-bck ${
                    currentPage <= 1 ? "next-back-disable" : ""
                  }`}
                >
                  Back
                </button>
              )}
              <Pagination
                start={start}
                end={end}
                currentPage={currentPage}
                itemCount={productCount}
                onPageChange={this.onPageChange}
                pageSize={pageSize}
              />
              {productCount > pageSize && (
                <button
                  onClick={() => this.incrementPage(pageSize)}
                  disabled={this.nextBackBtnCheck(
                    currentPage,
                    productCount,
                    pageSize
                  )}
                  className={`page-nxt-bck ${
                    this.nextBackBtnCheck(currentPage, productCount, pageSize)
                      ? "next-back-disable"
                      : ""
                  }`}
                >
                  Next
                </button>
              )}
            </div>
            <div className="empty-footer"></div>
          </>
        )}
      </div>
    );
  }
}

export default AdminProducts;
