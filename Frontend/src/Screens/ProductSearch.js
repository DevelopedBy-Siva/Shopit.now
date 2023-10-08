import React from "react";
import ProductFilter from "../Components/Product Search/ProductFilter";
import ProductPages from "../Components/Product Search/ProductPages";
import ProductSearchWrapContainer from "../Components/Product Search/ProductSearchWrapContainer";
import SearchDetails from "../Components/Product Search/SearchDetails";
import { BiSlider } from "react-icons/bi";
import "../css/product-search.css";

class ProductSearch extends ProductSearchWrapContainer {
  render() {
    const {
      filterVisible,
      itemCount,
      data,
      loading,
      error,
      query,
      priceRange,
      deal,
      stock,
      filterDisp,
      toggleFilter,
      currentPage,
      pagesize,
      start,
      end,
    } = this.state;

    return (
      <div className="product-search-container contain">
        <ProductFilter
          filterVisible={filterVisible}
          handleReset={this.handleFilterReset}
          handleRating={this.handleRating}
          loading={loading}
          error={error}
          len={data.length}
          toggleFilter={toggleFilter}
          handleFilterToggle={this.handleFilterToggle}
          deal={deal}
          stock={stock}
          handleOutOfStock={this.handleOutOfStock}
          handleTodaysDeal={this.handleTodaysDeal}
          priceRange={priceRange}
          handlePriceRange={this.handlePriceRange}
        />
        <div className="search-details-wrap">
          {!loading && !error && (
            <div className="search-filter-nav">
              <button onClick={this.handleFilterToggle}>
                <BiSlider />
              </button>
            </div>
          )}
          <SearchDetails
            handleRating={this.handleRating}
            filterVisible={filterVisible}
            filterDisplayHandle={this.filterDisplayHandle}
            filterDisp={filterDisp}
            handleProduct={this.handleProduct}
            query={query}
            error={error}
            data={data}
            loading={loading}
            itemCount={itemCount}
          />
          {!loading && (
            <ProductPages
              itemCount={itemCount}
              start={start}
              currentPage={currentPage}
              end={end}
              pagesize={pagesize}
              onPageChange={this.onPageChange}
              incrementPage={this.incrementPage}
              nextBackBtnCheck={this.nextBackBtnCheck}
              decrementPage={this.decrementPage}
            />
          )}
          <div className="search-page-footer" />
        </div>
      </div>
    );
  }
}

export default ProductSearch;
