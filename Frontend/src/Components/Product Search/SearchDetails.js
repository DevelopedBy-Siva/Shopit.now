import React, { Component } from "react";
import Lottie from "lottie-react";
import loadingAnim from "../../animations/dataload.json";
import serverError from "../../animations/server-error.json";
import ProductDetails from "./ProductDetails";
import SearchEmpty from "./SearchEmpty";
import { StarRate } from "./Utils";
import { MdClose } from "react-icons/md";

class SearchDetails extends Component {
  checkFilterOption = (option, what) => {
    const { filterDisplayHandle, handleRating } = this.props;
    return !option.includes(StarRate)
      ? filterDisplayHandle(option, what)
      : handleRating(option, what);
  };

  render() {
    const {
      filterVisible,
      itemCount,
      data,
      loading,
      error,
      query,
      handleProduct,
      filterDisp,
    } = this.props;

    return (
      <div className="search-details">
        {loading ? (
          <div className="search-loading">
            <Lottie animationData={loadingAnim} />
          </div>
        ) : error ? (
          <div className="server-error">
            <Lottie loop={false} animationData={serverError} />
            <h2>Server error occured. Try again later</h2>
          </div>
        ) : !filterVisible ? (
          <SearchEmpty query={query} />
        ) : (
          <div>
            <h5 className="results-found">
              {itemCount} results found for <span>" {query} "</span>
            </h5>
            <div className="filter-disp-container">
              {filterDisp.map((i, index) => {
                return (
                  <div className="each-filter-disp" key={index}>
                    <span>{i}</span>
                    <button onClick={() => this.checkFilterOption(i, 0)}>
                      <MdClose />
                    </button>
                  </div>
                );
              })}
            </div>
            {filterVisible && data.length === 0 ? (
              <SearchEmpty query={query} />
            ) : (
              <div className="search-details-sub">
                {data.map((i, index) => (
                  <div key={index}>
                    <ProductDetails handleProduct={handleProduct} data={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default SearchDetails;
