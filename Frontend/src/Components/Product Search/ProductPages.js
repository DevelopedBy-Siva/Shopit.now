import React, { Component } from "react";
import Pagination from "../Home/Pagination";

class ProductPages extends Component {
  render() {
    const {
      itemCount,
      pagesize,
      decrementPage,
      currentPage,
      start,
      end,
      onPageChange,
      incrementPage,
      nextBackBtnCheck,
    } = this.props;
    return (
      <div className="search-pagination">
        {itemCount > pagesize && (
          <div className="search-page-cont">
            <button
              onClick={decrementPage}
              disabled={currentPage <= 1}
              className={`page-nxt-bck ${
                currentPage <= 1 ? "next-back-disable" : ""
              }`}
            >
              Back
            </button>
          </div>
        )}

        <Pagination
          start={start}
          end={end}
          currentPage={currentPage}
          itemCount={itemCount}
          onPageChange={onPageChange}
          pageSize={pagesize}
        />

        {itemCount > pagesize && (
          <div className="search-page-cont">
            <button
              onClick={incrementPage}
              disabled={nextBackBtnCheck(currentPage, itemCount, pagesize)}
              className={`page-nxt-bck ${
                nextBackBtnCheck(currentPage, itemCount, pagesize)
                  ? "next-back-disable"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default ProductPages;
