import React, { Component } from "react";
import { FaChevronRight, FaSlidersH } from "react-icons/fa";
import RatingFilter from "./RatingFilter";
import PriceRange from "./PriceRange";
import NewDeals from "./NewDeals";
import OutOfStock from "./OutOfStock";
import Lottie from "lottie-react";
import LoadingAnim from "../../animations/dataload.json";

class ProductFilter extends Component {
  render() {
    const {
      filterVisible,
      handleReset,
      handleRating,
      loading,
      error,
      priceRange,
      handlePriceRange,
      handleTodaysDeal,
      handleOutOfStock,
      deal,
      stock,
      toggleFilter,
      handleFilterToggle,
    } = this.props;
    return (
      <div className={`product-filter ${toggleFilter ? "filter-display" : ""}`}>
        <div
          className={`product-filter-sub-container ${
            toggleFilter ? "product-filter-sub-container-display" : ""
          }`}
        >
          <div className="filter-head">
            <FaSlidersH />
            <h2>Filter</h2>
            {filterVisible && (
              <button onClick={handleReset} id="search-filter-reset">
                Reset
              </button>
            )}
          </div>
          {loading ? (
            <Lottie animationData={LoadingAnim} className="filter-loading" />
          ) : error ? (
            ""
          ) : (
            filterVisible && (
              <>
                <PriceRange
                  priceRange={priceRange}
                  handlePriceRange={handlePriceRange}
                />
                <RatingFilter handleRating={handleRating} />
                <NewDeals deal={deal} handleTodaysDeal={handleTodaysDeal} />
                <OutOfStock stock={stock} handleOutOfStock={handleOutOfStock} />
              </>
            )
          )}
        </div>
        <div className="toggle-icon" onClick={handleFilterToggle}>
          <FaChevronRight
            className={`${toggleFilter ? "toggle-icon-rotate" : ""}`}
          />
        </div>
      </div>
    );
  }
}

export default ProductFilter;
