import React, { Component } from "react";
import { FaSlidersH } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import RatingFilter from "./RatingFilter";
import PriceRange from "./PriceRange";
import NewDeals from "./NewDeals";
import OutOfStock from "./OutOfStock";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import ReactFocusLock from "react-focus-lock";

const screenAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { type: "spring", bounce: 0, duration: 0.3 },
};

const navAnimation = {
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
  transition: { type: "spring", bounce: 0, duration: 0.4 },
};

class ProductFilter extends Component {
  render() {
    const {
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

    const filterProps = {
      handleReset: handleReset,
      handleRating: handleRating,
      loading: loading,
      error: error,
      priceRange: priceRange,
      handlePriceRange: handlePriceRange,
      handleTodaysDeal: handleTodaysDeal,
      handleOutOfStock: handleOutOfStock,
      deal: deal,
      stock: stock,
    };

    return (
      <>
        <AnimatePresence>
          {toggleFilter && (
            <div className="product-filter-wrapper-small">
              <ReactFocusLock>
                <motion.div>
                  <ProductFilterDetails
                    animationProps={navAnimation}
                    {...filterProps}
                  />
                  <motion.div
                    onClick={handleFilterToggle}
                    className="product-filter-toggle-container"
                    {...screenAnimation}
                  >
                    <button>
                      <MdClose />
                    </button>
                  </motion.div>
                </motion.div>
              </ReactFocusLock>
            </div>
          )}
        </AnimatePresence>
        <div className="product-filter-wrapper">
          <ProductFilterDetails {...filterProps} />
        </div>
      </>
    );
  }
}

export default ProductFilter;

function ProductFilterDetails({
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
  animationProps,
}) {
  return (
    <motion.div className={`product-filter`} {...animationProps}>
      <div className={`product-filter-sub-container`}>
        <div className="filter-head">
          <FaSlidersH className="icon" />
          <h2>Filter</h2>
          <button
            disabled={loading}
            onClick={handleReset}
            id="search-filter-reset"
          >
            Reset
          </button>
        </div>
        {error ? (
          <p className="product-filter-error">Sorry, something went wrong</p>
        ) : (
          <>
            <PriceRange
              loading={loading}
              priceRange={priceRange}
              handlePriceRange={handlePriceRange}
            />
            <RatingFilter loading={loading} handleRating={handleRating} />
            <NewDeals
              loading={loading}
              deal={deal}
              handleTodaysDeal={handleTodaysDeal}
            />
            <OutOfStock
              loading={loading}
              stock={stock}
              handleOutOfStock={handleOutOfStock}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}
