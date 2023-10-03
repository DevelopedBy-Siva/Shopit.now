import React, { Component } from "react";
import {
  api_endpoints as API_ENDPOINT,
  formUrl as URL,
} from "../../../api/api";
import { getJwt } from "../../../services/LoginReg";
import axios from "axios";

const defaultPage = 1;
const defaultPageSize = 5;

class AdminProductsMainContainer extends Component {
  constructor(props) {
    super(props);
    this.togggleProductDetailsEdit = React.createRef();
    this.toggleProductStockEdit = React.createRef();
    this.toggleEditCover = React.createRef();
    this.submittingDetails = React.createRef();
    this.submittingUpdateDetails = React.createRef();
    this.submittingStockUpdate = React.createRef();
    this.exitBtn = React.createRef();
    this.exitStockBtn = React.createRef();
    this.toggleTrend = React.createRef();
  }

  state = {
    products: [],
    updateStock: false,
    dataLoaded: true,
    details: {
      id: "",
      title: "",
      price: "",
    },
    stock: {
      id: "",
      inStock: 0,
    },
    unknownError: false,
    submittingDetails: false,
    updateSuccess: false,
    submitTrending: false,
    submitTrendingId: null,
    submitError: false,
    currentPage: 1,
    pageSize: defaultPageSize,
    search: "",
    start: 1,
    end: 3,
    productCount: 0,
  };

  componentDidMount() {
    this.getProducts(defaultPage);
  }

  getProducts = async (page) => {
    this.setState({ dataLoaded: true });
    this.props.handleSelectedScreen("Products");
    await axios
      .get(`${URL(API_ENDPOINT.productApi)}/view/all-products`, {
        params: {
          page: page - 1,
          size: defaultPageSize,
        },
      })
      .then(({ data }) => {
        const { productCount, productViews } = data;
        this.setState({
          productCount,
          products: productViews,
          dataLoaded: false,
          unknownError: false,
        });
      })
      .catch(() => {
        this.setState({ unknownError: true, dataLoaded: false });
      });
  };

  handleTrending = (id) => {
    const updatedProduct = [...this.state.products];
    updatedProduct.forEach(async (i) => {
      if (i.id === id) {
        if (i.trending) {
          i.trending = false;
          await this.submitTrending(false, id);
        } else {
          i.trending = true;
          await this.submitTrending(true, id);
        }
      }
    });
    this.setState({ products: updatedProduct });
  };

  updateProductDetails = (id, details) => {
    let data = [...this.state.products];
    data.forEach((item) => {
      if (item.id === id) {
        item.title = details.title;
        item.inStock = details.stock;
        item.price = details.price;
      }
    });
    this.setState({ products: [...data] });
  };

  submitTrending = async (value, id) => {
    this.setState({ submitTrending: true, submitTrendingId: id });
    await axios
      .put(
        `${URL(API_ENDPOINT.productApi)}/update/update-trending/${id}`,
        {
          trending: value,
        },
        {
          headers: { Authorization: getJwt() },
        }
      )
      .then(() => {
        this.setState({ submitTrending: false, submitTrendingId: null });
      })
      .catch(() => {
        this.setState({ submitTrending: false, submitTrendingId: null });
      });
  };

  handleProductEdit = (item) => {
    const newdetails = { ...this.state.details };
    newdetails.id = item.id;
    newdetails.title = item.title;
    newdetails.price = item.price;
    this.setState({ details: newdetails });
    this.handleProductScreenToggle();
  };
  handleProductScreenToggle = () => {
    this.setState({ submitError: false });
    this.toggleEditCover.current.classList.toggle(
      "admin-product-edit-cover-display"
    );
    this.togggleProductDetailsEdit.current.classList.toggle(
      "edit-admin-product-details-display"
    );
  };

  handleStockEdit = (item) => {
    const newStock = { ...this.state.stock };
    newStock.id = item.id;
    newStock.inStock = item.inStock;
    this.setState({ stock: newStock, submitError: false });
    this.handleProductStockScreenToggle();
  };
  handleProductStockScreenToggle = () => {
    this.toggleEditCover.current.classList.toggle(
      "admin-product-edit-cover-display"
    );
    this.toggleProductStockEdit.current.classList.toggle(
      "edit-admin-product-stock-display"
    );
  };
  handleProductDetailsSubmit = async (value, id) => {
    this.submitStart(this.submittingUpdateDetails, this.exitBtn);
    await axios
      .put(
        `${URL(API_ENDPOINT.productApi)}/update/update-details/${id}`,
        {
          title: value.title,
          price: value.price,
        },
        {
          headers: { Authorization: getJwt() },
        }
      )
      .then(() => {
        this.submitSuccess(this.submittingUpdateDetails);
      })
      .catch(() => {
        this.submitFail(this.submittingUpdateDetails, this.exitBtn);
      });
  };

  handleProductStockSubmit = async (value, id) => {
    this.submitStart(this.submittingStockUpdate, this.exitStockBtn);
    await axios
      .put(
        `${URL(API_ENDPOINT.productApi)}/update/update-stock/${id}`,
        {
          stock: value.stock,
        },
        {
          headers: { Authorization: getJwt() },
        }
      )
      .then(() => {
        this.submitSuccess(this.submittingStockUpdate);
      })
      .catch(() => {
        this.submitFail(this.submittingStockUpdate, this.exitStockBtn);
      });
  };

  submitStart = (ref, exitBtn) => {
    ref.current.classList.add("toggle-product-update-submit");
    exitBtn.current.classList.add("exitBtn-disapper");
    this.setState({ submittingDetails: true, submitError: false });
  };

  submitSuccess = (ref) => {
    this.setState({ updateSuccess: true, submitError: false });
    ref.current.classList.remove("toggle-product-update-submit");
    ref.current.classList.add("toggle-product-update-submit-success");
    setTimeout(() => (window.location = "/admin/products"), 1700);
  };
  submitFail = (ref, exitBtn) => {
    ref.current.classList.remove("toggle-product-update-submit");
    ref.current.classList.remove("toggle-product-update-submit-success");
    exitBtn.current.classList.remove("exitBtn-disapper");
    this.setState({ submittingDetails: false, submitError: true });
  };

  pageIteration = (page, len) => {
    const { start, end } = this.state;
    if (page === end && page !== len) {
      this.setState({ start: start + 1, end: end + 1 });
    } else if (page === start && page !== 1) {
      this.setState({ start: start - 1, end: end - 1 });
    }
  };

  onPageChange = (page, len) => {
    this.pageIteration(page, len);
    this.getProducts(page);
    this.setState({ currentPage: page });
  };

  nextBackBtnCheck = (current, len, size) => {
    if (current === Math.ceil(len / size)) return true;
    return false;
  };

  incrementPage = (size) => {
    const { start, end, currentPage } = this.state;
    if (currentPage < end - 1) this.setState({ start: start, end: end });
    else if (currentPage !== size - 1)
      this.setState({ start: start + 1, end: end + 1 });
    this.getProducts(currentPage + 1);
    this.setState({ currentPage: currentPage + 1 });
  };

  decrementPage = () => {
    const { start, end, currentPage } = this.state;
    if (currentPage === start + 1 && currentPage !== 2)
      this.setState({ start: start - 1, end: end - 1 });
    else this.setState({ start: start, end: end });
    this.getProducts(currentPage - 1);
    this.setState({ currentPage: currentPage - 1 });
  };

  handleSearch = (e) => {
    const search = e.currentTarget.value.toLowerCase();
    this.setState({ search });
  };

  serverSearch = async () => {
    const { search } = this.state;
    if (search.length) {
      this.setState({ dataLoaded: true });
      axios
        .get(`${URL(API_ENDPOINT.productApi)}/view/search-products/${search}`, {
          params: {
            page: defaultPage - 1,
            size: defaultPageSize,
          },
        })
        .then(({ data }) => {
          const { productCount, productViews } = data;
          this.setState({
            currentPage: 1,
            end: 3,
            start: 1,
            productCount,
            products: productViews,
            dataLoaded: false,
            unknownError: false,
          });
        })
        .catch(() => {
          this.setState({ unknownError: true, dataLoaded: false });
        });
    }
  };
}

export default AdminProductsMainContainer;
