import React, { Component } from "react";
import {
  mapDispatchToProps,
  mapStateToProps,
} from "../../State Management/MappingStates";
import { FaBoxOpen } from "react-icons/fa";
import { connect } from "react-redux";
import CartLoadin from "./CartLoadin";
import CartError from "./CartError";

class SaveForLater extends Component {
  state = {
    data: [],
    loading: false,
    error: false,
    success: false,
    fetchLoading: false,
    fetchError: false,
    itemIndex: null,
    errorIndex: null,
  };

  componentDidMount() {
    this.handleSaveLater();
    this.handleFetchFromServer();
    const { saveLaterServer } = this.props;
    const { loading, error, success } = saveLaterServer;
    this.setState({ loading, success, error });
  }

  handleFetchFromServer = () => {
    const { loading, error } = this.props.saveLaterFetch;
    this.setState({ fetchLoading: loading, fetchError: error });
  };

  componentDidUpdate(prevProps, prevState) {
    const { saveLaterFetch } = this.props;
    if (prevProps.saveLater !== this.props.saveLater) {
      this.handleSaveLater();
    }
    if (prevProps.saveLaterFetch !== saveLaterFetch) {
      const { loading, error } = saveLaterFetch;
      this.setState({ fetchLoading: loading, fetchError: error });
    }
    const { saveLaterServer } = this.props;
    if (prevProps.saveLaterServer !== saveLaterServer) {
      const { success, loading, error } = saveLaterServer;
      if (!loading) {
        this.setState({ itemIndex: null });
      }
      this.setState({ loading, error, success });
    }
  }

  handleSaveLater = () => {
    const { saveLater } = this.props;
    this.setState({ data: saveLater });
  };

  handleRemoveFromSaveLater = (id, e, index) => {
    if (e) e.currentTarget.blur();
    if (index >= 0) this.setState({ itemIndex: index, errorIndex: index });
    this.props.removeFromSaveLater(id);
  };

  handleMoveToCart = (item, e, index) => {
    if (e) e.currentTarget.blur();
    this.setState({ itemIndex: index, errorIndex: index });
    this.props.moveToCart(item);
  };

  render() {
    const { data, itemIndex, errorIndex, error, fetchLoading, fetchError } =
      this.state;
    const len = data.length;
    return (
      <div className="save-for-later-container">
        <div className="save-for-later-sub-container">
          <h2>
            Save for Later{" "}
            <span>
              {len === 1 ? `(${len} item)` : len > 1 ? `(${len} items)` : ""}
            </span>
          </h2>
          {fetchLoading ? (
            <CartLoadin />
          ) : fetchError ? (
            <CartError />
          ) : len < 1 ? (
            <div className="save-for-later-empty">
              <FaBoxOpen className="icon" />
              <h1>Ouch...its empty in here!</h1>
            </div>
          ) : (
            data.map((i, index) => (
              <div key={index} className="save-later-item-container">
                {itemIndex === index && (
                  <div className="save-later-item-container-cover" />
                )}
                {error && errorIndex === index ? (
                  <h5>Server error occured.Try again later</h5>
                ) : (
                  ""
                )}
                <div className="save-later-item">
                  <div className="save-later-item-details">
                    <h3>{i.productName.toLowerCase()}</h3>
                    <h4>
                      No of items: <span>{i.itemCount}</span>
                    </h4>
                  </div>
                  <div className="save-later-item-price">
                    <h3>
                      <span>$ </span>
                      {i.totalPrice}.00
                    </h3>
                  </div>
                </div>
                <div className="save-later-item-operations">
                  <button onClick={(e) => this.handleMoveToCart(i, e, index)}>
                    Move to cart
                  </button>
                  <button
                    onClick={(e) =>
                      this.handleRemoveFromSaveLater(i.productId, e, index)
                    }
                  >
                    Remove item
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveForLater);
