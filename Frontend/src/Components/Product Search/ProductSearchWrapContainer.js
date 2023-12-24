import { Component } from "react";
import axios from "axios";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";
import debounce from "lodash/debounce";
import {
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
} from "./Utils";

export default class ProductSearchWrapContainer extends Component {
  state = {
    itemCount: 0,
    data: [],
    loading: true,
    error: false,
    query: "_",
    priceRange: defaultPrice,
    rating: defaultRating,
    deal: this.isParamPresent("deals"),
    stock: defaultStock,
    filterDisp: [],
    toggleFilter: false,
    currentPage: defaultPage,
    start: 1,
    end: 3,
    pagesize: defaultPageSize,
    filterVisible: true,
  };

  isParamPresent(val) {
    const searchParams = new URLSearchParams(this.props.location.search);
    const param = searchParams.get(val);
    return param ? true : false;
  }

  componentDidMount() {
    const query = this.getTheQuery();
    this.setState({ query });
    this.getProducts(
      query,
      defaultPageSize,
      defaultPage,
      defaultPrice,
      defaultRating,
      defaultStock,
      this.state.deal,
      1
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const query = this.getTheQuery();
    if (prevState.query !== query) {
      this.resetFilter(query, 1);
    }
  }

  handleFilterToggle = () => {
    const { toggleFilter } = this.state;
    if (toggleFilter) this.setState({ toggleFilter: false });
    else this.setState({ toggleFilter: true });
  };

  getTheQuery() {
    return this.props.match.params.query;
  }

  handleFilterReset = () => {
    const { query } = this.state;
    this.resetFilter(query, 2);
  };

  resetFilter = (query, dataFound) => {
    this.setState({
      filterVisible: true,
      query,
      currentPage: defaultPage,
      priceRange: defaultPrice,
      rating: defaultRating,
      stock: defaultStock,
      deal: defaultDeal,
      filterDisp: [],
      start: 1,
      end: 3,
    });
    this.getProducts(
      query,
      defaultPageSize,
      defaultPage,
      defaultPrice,
      defaultRating,
      defaultStock,
      defaultDeal,
      dataFound
    );
  };

  getProducts = async (
    query,
    pagesize,
    currentPage,
    priceRange,
    rating,
    outOfStock,
    topDeals,
    dataFound
  ) => {
    this.setState({ error: false, loading: true });
    await axios
      .get(`${URL(API_ENDPOINT.productApi)}/search/${query}`, {
        params: {
          limit: pagesize,
          page: currentPage - 1,
          price: priceRange,
          rating: rating,
          outOfStock: outOfStock,
          topDeals: topDeals,
        },
      })
      .then(({ data }) => {
        const { searchView, itemCount } = data;
        if (searchView.length < 1) {
          dataFound === 2
            ? this.setState({ filterVisible: true })
            : this.setState({ filterVisible: false });
        }
        this.setState({ itemCount, data: searchView, loading: false });
      })
      .catch(() => {
        this.setState({ error: true, loading: false });
      });
  };

  handleProduct = (id) => {
    return this.props.history.push(`/products/${id}`);
  };

  handlePriceRange = (val) => {
    this.setState({ priceRange: val });
    this.handlePriceDebounce(val);
  };

  handlePriceDebounce = debounce((val) => this.priceServerConnect(val), 500);

  priceServerConnect = (val) => {
    this.setState({ priceRange: val, currentPage: 1, start: 1, end: 3 });
    this.handleFilterToggle();
    const { query, pagesize, rating, stock, deal } = this.state;
    this.getProducts(query, pagesize, 1, val, rating, stock, deal, 2);
  };

  handleTodaysDeal = (e) => {
    const check = e.currentTarget.checked;
    if (check) this.filterDisplayHandle(TodaysDeal, 1);
    else this.filterDisplayHandle(TodaysDeal, 0);
    this.handleFilterToggle();
    this.setState({ deal: check });
  };

  filterDisplayHandle = (option, what) => {
    const { pagesize, query, priceRange, rating, stock, deal } = this.state;
    const updated = [...this.state.filterDisp];
    let filterDisp = [];
    if (what) filterDisp = [...updated, option];
    else {
      filterDisp = updated.filter((i) => i !== option);
      if (option === TodaysDeal) this.setState({ deal: false });
      else if (option === Available) this.setState({ stock: false });
    }
    let newstock = stock;
    let newdeal = deal;
    option === Available
      ? what
        ? (newstock = true)
        : (newstock = false)
      : option === TodaysDeal && (what ? (newdeal = true) : (newdeal = false));
    this.getProducts(
      query,
      pagesize,
      1,
      priceRange,
      rating,
      newstock,
      newdeal,
      2
    );
    this.setState({ filterDisp, currentPage: 1, start: 1, end: 3 });
  };

  handleOutOfStock = (e) => {
    const check = e.currentTarget.checked;
    if (check) this.filterDisplayHandle(Available, 1);
    else this.filterDisplayHandle(Available, 0);
    this.handleFilterToggle();
    this.setState({ stock: check, currentPage: 1, start: 1, end: 3 });
  };

  handleRating = (rate, what) => {
    this.handleFilterToggle();
    if (this.state.loading) return;
    this.ratingUpdation(rate, what);
  };

  ratingUpdation = (star, what) => {
    const { pagesize, query, priceRange, stock, deal, filterDisp } = this.state;
    let filter = [];
    filterDisp.forEach((i) => {
      if (!i.includes(StarRate)) filter = [...filter, i];
    });
    const updated = what
      ? (filter = [...filter, `${StarRate} - ${star}+`])
      : filter;
    const updatedRating = what ? star : defaultRating;
    this.setState({
      filterDisp: updated,
      rating: updatedRating,
      currentPage: 1,
      start: 1,
      end: 3,
    });
    this.getProducts(
      query,
      pagesize,
      1,
      priceRange,
      updatedRating,
      stock,
      deal,
      2
    );
  };

  pageIteration = (page, len) => {
    const { start, end } = this.state;
    if (page === end && page !== len) {
      this.setState({ start: start + 1, end: end + 1 });
    } else if (page === start && page !== 1) {
      this.setState({ start: start - 1, end: end - 1 });
    }
  };
  handleScroll = () => {
    scroll.scrollTo(0, {
      duration: 500,
      smooth: true,
    });
  };

  onPageChange = (page, len) => {
    const { pagesize, query, priceRange, rating, stock, deal } = this.state;
    this.handleScroll();
    this.pageIteration(page, len);
    this.setState({ currentPage: page });
    this.getProducts(query, pagesize, page, priceRange, rating, stock, deal, 2);
  };

  nextBackBtnCheck = (current, len, size) => {
    if (current === Math.ceil(len / size)) return true;
    return false;
  };

  incrementPage = (size) => {
    const {
      start,
      end,
      currentPage,
      pagesize,
      query,
      priceRange,
      rating,
      stock,
      deal,
    } = this.state;
    this.handleScroll();
    if (currentPage === end - 1 && currentPage !== size - 2)
      this.setState({ start: start + 1, end: end + 1 });
    this.setState({ currentPage: currentPage + 1 });
    this.getProducts(
      query,
      pagesize,
      currentPage + 1,
      priceRange,
      rating,
      stock,
      deal,
      2
    );
  };

  decrementPage = () => {
    const {
      start,
      end,
      pagesize,
      currentPage,
      query,
      priceRange,
      rating,
      stock,
      deal,
    } = this.state;
    this.handleScroll();
    if (currentPage === start + 1 && currentPage !== 2)
      this.setState({ start: start - 1, end: end - 1 });
    else this.setState({ start: start, end: end });
    this.setState({ currentPage: currentPage - 1 });
    this.getProducts(
      query,
      pagesize,
      currentPage - 1,
      priceRange,
      rating,
      stock,
      deal,
      2
    );
  };
}
