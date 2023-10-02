import React, { Component } from "react";
import {
  FaUser,
  FaShoppingBag,
  FaBox,
  FaExclamation,
  FaCoins,
} from "react-icons/fa";
import Lottie from "lottie-react";
import loading from "../../../animations/loading.json";

class AdminOperations extends Component {
  state = {};
  render() {
    const {
      revenue,
      revenueError,
      revenueLoading,
      noOfOrders,
      noOfOrdersLoading,
      noOfOrdersError,
      noOfUsers,
      usersError,
      usersLoading,
      noOfProductsLoading,
      noOfProducts,
      noOfProductsError,
    } = this.props;
    return (
      <>
        <div className="admin-control-div">
          <div>
            <FaUser className="user-icon" />
            <h2>Users</h2>
          </div>
          <div>
            {usersLoading ? (
              <Lottie
                className="admin-operation-user-loading"
                animationData={loading}
              />
            ) : usersError ? (
              <h1>
                <FaExclamation className="faExclamation" />
              </h1>
            ) : (
              <h1 className="no-of1">{noOfUsers}</h1>
            )}
          </div>
        </div>
        <div className="admin-control-div">
          <div>
            <FaShoppingBag className="shopping-icon" />
            <h2>Orders</h2>
          </div>
          {noOfOrdersLoading ? (
            <Lottie
              className="admin-operation-user-loading"
              animationData={loading}
            />
          ) : noOfOrdersError ? (
            <h1>
              <FaExclamation className="faExclamation" />
            </h1>
          ) : (
            <h1 className="no-of2">{noOfOrders}</h1>
          )}
        </div>
        <div className="admin-control-div">
          <div>
            <FaBox className="product-icon" />
            <h2>Products</h2>
          </div>
          {noOfProductsLoading ? (
            <Lottie
              className="admin-operation-user-loading"
              animationData={loading}
            />
          ) : noOfProductsError ? (
            <h1>
              <FaExclamation className="faExclamation" />
            </h1>
          ) : (
            <h1 className="no-of3">{noOfProducts}</h1>
          )}
        </div>
        <div className="admin-control-div">
          <div>
            <FaCoins />
            <h2>Total Revenue</h2>
          </div>
          {revenueLoading ? (
            <Lottie
              className="admin-operation-user-loading"
              animationData={loading}
            />
          ) : revenueError ? (
            <h1>
              <FaExclamation className="faExclamation" />
            </h1>
          ) : (
            <h1 className="no-of4">
              <span className="no-of4-money">$</span>
              {revenue}
              <span>.00</span>
            </h1>
          )}
        </div>
      </>
    );
  }
}

export default AdminOperations;
