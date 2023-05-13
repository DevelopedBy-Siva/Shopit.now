import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { FaFilter, FaSyncAlt } from "react-icons/fa";
import Lottie from "lottie-react";
import _ from "lodash";

import DataLoad from "../../Errors/DataLoad";
import NetworkError from "../../Errors/NetworkError";
import EmptyMsg from "../../Errors/EmptyMsg";
import {
  api_endpoints as API_ENDPOINT,
  formUrl as URL,
} from "../../../../api/api";
import { getJwt } from "../../../../services/LoginReg";
import { paginate } from "../../../../utils/Paginate";
import Pagination from "../../../Home/Pagination";
import UserOrderData from "./UserOrderData";
import AdminOrdersError from "../../Errors/AdminOrdersError";
import loadingAnim from "../../../../animations/loadingSetting.json";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../../../State Management/MappingStates";

import "../../../../css/neworders.css";
import OrderSorting from "../Orders/OrderSorting";

const errorMsg = "Server error occured. Try after sometime.";

class NewOrders extends Component {
  state = {
    loading: false,
    error: false,
    data: [],
    currentPage: 1,
    pageSize: 5,
    filter: false,
    adminError: null,
    serverError: false,
    adminSubmit: false,
    start: 1,
    end: 3,
    sort: {
      path: "itemDetails.orderDate",
      order: "asc",
    },
  };

  componentDidMount() {
    const { loading, error, data } = this.props.orders;
    this.setState({ loading, error, data });
    this.props.fetchOrders();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.orders !== this.props.orders) {
      const { loading, error, data } = this.props.orders;
      this.setState({ loading, error, data });
    }
  }

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
    this.setState({ currentPage: currentPage + 1 });
  };

  decrementPage = () => {
    const { start, end, currentPage } = this.state;
    if (currentPage === start + 1 && currentPage !== 2)
      this.setState({ start: start - 1, end: end - 1 });
    else this.setState({ start: start, end: end });
    this.setState({ currentPage: currentPage - 1 });
  };

  diplayFilter = () => {
    const { filter } = this.state;
    if (filter) this.setState({ filter: false });
    else this.setState({ filter: true });
  };

  approveOrder = async (id) => {
    this.setState({ adminSubmit: true, adminError: null, serverError: false });
    await axios
      .put(`${URL(API_ENDPOINT.userOrders)}/approve/${id}`, null, {
        headers: {
          Authorization: getJwt(),
        },
      })
      .then(() => {
        this.updateOrder(id);
        this.setState({ adminSubmit: false });
      })
      .catch(({ request }) => {
        if (request.status === 400) {
          this.adminErrorHandle("Order was cancelled/ approved already");
        } else {
          this.serverErrorHandle();
        }
      });
  };

  shipOrder = async (id) => {
    this.setState({ adminSubmit: true, adminError: null, serverError: false });
    await axios
      .put(`${URL(API_ENDPOINT.userOrders)}/ship/${id}`, null, {
        headers: {
          Authorization: getJwt(),
        },
      })
      .then(() => {
        this.updateOrder(id);
        this.setState({ adminSubmit: false });
      })
      .catch(({ request }) => {
        if (request.status === 400) {
          this.adminErrorHandle("Order was cancelled/ dispatched already");
        } else {
          this.serverErrorHandle();
        }
      });
  };

  updateOrder = (id) => {
    const { data } = this.state;
    const newData = data.filter((i) => {
      if (i.id === id) {
        if (i.orderStatus.dispatched) i.orderStatus.shipped = true;
        else i.orderStatus.dispatched = true;
      }
      return i;
    });
    this.setState({ data: newData });
  };

  adminErrorHandle = (msg) => {
    this.setState({ adminError: msg, adminSubmit: false });
    this.props.fetchOrders();
    setTimeout(() => this.setState({ adminError: null }), 3000);
  };

  serverErrorHandle = () => {
    this.setState({ adminSubmit: false, adminError: null, serverError: true });
    setTimeout(() => this.setState({ serverError: false }), 3000);
  };

  handleSort = (path) => {
    const sort = { ...this.state.sort };
    if (sort.path === path) sort.order = sort.order === "asc" ? "desc" : "asc";
    else {
      if (path === "orderStatus.dispatched" || path === "orderStatus.shipped")
        sort.order = "desc";
      else sort.order = "asc";
      sort.path = path;
    }
    this.setState({ sort });
  };

  render() {
    const {
      sort,
      start,
      end,
      loading,
      adminError,
      error,
      data,
      currentPage,
      pageSize,
      filter,
      serverError,
      adminSubmit,
    } = this.state;
    let newdata = [];
    const sorted = _.orderBy(data, [sort.path], [sort.order]);
    if (data.length !== 0)
      newdata = [...paginate(sorted, currentPage, pageSize)];
    return (
      <div className="new-orders-container">
        <div>
          <h1>Latest Orders</h1>
          {(serverError || adminError) && (
            <AdminOrdersError error={serverError ? errorMsg : adminError} />
          )}
          <div className="order-filter-header-r">
            <FaSyncAlt
              className="refresh-orders"
              onClick={this.props.fetchOrders}
            />
            {data.length > 1 && (
              <div className="order-filter" onClick={this.diplayFilter}>
                <FaFilter />
                <div
                  className={`order-filter-list ${
                    filter ? "order-filter-list-display" : ""
                  } `}
                >
                  <ul>
                    <OrderSorting
                      onClick={() => this.handleSort("itemDetails.productName")}
                      name="Name"
                    />
                    <OrderSorting
                      onClick={() => this.handleSort("orderDate")}
                      name="Order Date"
                    />
                    <OrderSorting
                      onClick={() => this.handleSort("itemDetails.totalPrice")}
                      name="Price"
                    />
                    <OrderSorting
                      onClick={() => this.handleSort("orderStatus.dispatched")}
                      name="Dispatched"
                    />
                    <OrderSorting
                      onClick={() => this.handleSort("orderStatus.shipped")}
                      name="Shipped"
                    />
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <DataLoad />
        ) : error ? (
          <NetworkError />
        ) : !data.length ? (
          <EmptyMsg msg="No Orders Yet" />
        ) : (
          <div className="new-orders-admin-container-datas">
            <table>
              <tbody>
                <tr>
                  <th>O.No.</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Order Date</th>
                  <th>Delivery Date</th>
                  <th>Mode of payment</th>
                  <th>Status</th>
                  <th>
                    <Lottie
                      loop={adminSubmit ? true : false}
                      className="admin-order-anim-icon"
                      animationData={loadingAnim}
                    />
                  </th>
                </tr>
                {newdata.map((i, index) => {
                  return (
                    <tr key={index}>
                      <UserOrderData
                        shipOrder={this.shipOrder}
                        adminSubmit={adminSubmit}
                        approveOrder={this.approveOrder}
                        order={i}
                      />
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="pages">
              {data.length > pageSize && (
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
                itemCount={data.length}
                onPageChange={this.onPageChange}
                pageSize={pageSize}
              />
              {data.length > pageSize && (
                <button
                  onClick={() => this.incrementPage(pageSize)}
                  disabled={this.nextBackBtnCheck(
                    currentPage,
                    data.length,
                    pageSize
                  )}
                  className={`page-nxt-bck ${
                    this.nextBackBtnCheck(currentPage, data.length, pageSize)
                      ? "next-back-disable"
                      : ""
                  }`}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOrders);
