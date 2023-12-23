import * as Scroll from "react-scroll";

function isParamPresent(val) {
  const searchParams = new URLSearchParams(window.location.search);
  const param = searchParams.get(val);
  return param ? true : false;
}

const TodaysDeal = "Today's Deal";
const Available = "Out of Stock";
const StarRate = "Rating";
const scroll = Scroll.animateScroll;

const defaultPrice = 0;
const defaultRating = 0;
const defaultDeal = isParamPresent("deals");
const defaultStock = false;
const defaultPage = 1;
const defaultPageSize = 8;

export {
  StarRate,
  TodaysDeal,
  Available,
  scroll,
  defaultPrice,
  defaultRating,
  defaultDeal,
  defaultStock,
  defaultPage,
  defaultPageSize,
};
