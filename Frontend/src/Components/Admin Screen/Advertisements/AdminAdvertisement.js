import React, { Component } from "react";
import { FaSearch, FaExclamation } from "react-icons/fa";
import Lottie from "lottie-react";
import loadingIcon from "../../../animations/dataload.json";
import countLoading from "../../../animations/loading.json";
import { getJwt } from "../../../services/LoginReg";
import {
  api_endpoints as API_ENDPOINT,
  formUrl as URL,
} from "../../../api/api";
import axios from "axios";
import SearchEmpty from "../../../animations/searchEmpty.json";
import ServerError from "../../../animations/server-error.json";
import AdProducts from "./AdProducts";
import "../../../css/adminAdvertisement.css";
import HandleAd from "./HandleAd";

class AdminAdvertisement extends Component {
  state = {
    loading: false,
    errorMsg: null,
    displayImage: null,
    submitLoading: false,
    search: "",
    products: [],
    searchStarted: false,
    searchError: false,
    adInitiate: false,
    adId: null,
    image: null,
    alreadyAdvertised: false,
    advertisementLoading: false,
    advertisementError: false,
    advertisements: [],
    adCountLoading: false,
    adCountError: false,
    adCount: 0,
    productCount: 0,
    productCountLoading: false,
    productCountError: false,
    deleteLoading: false,
    deleteError: null,
    deleteIndex: null,
  };

  componentDidMount() {
    this.props.handleSelectedScreen("Advertisement");
    this.getData();
    this.getProductCount();
    this.getAdCount();
  }
  getData = async () => {
    this.setState({ advertisementLoading: true, advertisementError: false });
    await axios
      .get(`${URL(API_ENDPOINT.productApi)}/mark/marks`, {
        headers: {
          Authorization: getJwt(),
        },
      })
      .then(({ data }) => {
        this.setState({ advertisementLoading: false, advertisements: data });
      })
      .catch(() => {
        this.setState({
          advertisementLoading: false,
          advertisementError: true,
        });
      });
  };

  getAdCount = async () => {
    this.setState({ adCountLoading: true, adCountError: false });
    await axios
      .get(`${URL(API_ENDPOINT.productApi)}/mark/marks-count`, {
        headers: {
          Authorization: getJwt(),
        },
      })
      .then(({ data }) => {
        this.setState({ adCountLoading: false, adCount: data });
      })
      .catch(() => {
        this.setState({ adCountLoading: false, adCountError: true });
      });
  };

  getProductCount = async () => {
    this.setState({ productCountLoading: true, productCountError: false });
    await axios
      .get(`${URL(API_ENDPOINT.productApi)}/view/no-of-products`, {
        headers: {
          Authorization: getJwt(),
        },
      })
      .then(({ data }) => {
        this.setState({ productCountLoading: false, productCount: data });
      })
      .catch(() => {
        this.setState({ productCountLoading: false, productCountError: true });
      });
  };

  handleImageChange = (e) => {
    if (e.target.files[0]) {
      const { size, type } = e.target.files[0];
      if (this.imageValidation(size, type)) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            this.setState({
              displayImage: reader.result,
              image: e.target.files[0],
            });
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    } else return;
  };

  imageValidation = (size, type) => {
    this.setState({ errorMsg: null });
    const allowedTypes = ["jpeg", "png", "jpg"];
    const allowedSize = 1000000;
    const imageType = type.split("/");
    if (!allowedTypes.includes(imageType[1])) {
      const errorMsg = "Should be .jpeg or .png";
      this.imageErrorCheck(errorMsg);
      return false;
    } else if (size >= allowedSize) {
      const errorMsg = "Should be less than 1mb";
      this.imageErrorCheck(errorMsg);
      return false;
    } else {
      return true;
    }
  };

  imageErrorCheck = (errorMsg) => {
    this.setState({ errorMsg });
    setTimeout(() => this.setState({ errorMsg: null }), 5000);
  };

  handleSubmit = async () => {
    const { image, adId } = this.state;
    const uploadImageData = new FormData();
    uploadImageData.append("imageFile", image, image.name);
    this.setState({
      errorMsg: null,
      submitLoading: true,
      alreadyAdvertised: false,
    });
    await axios
      .post(
        `${URL(API_ENDPOINT.productApi)}/mark/et-ing/${adId}`,
        uploadImageData,
        {
          headers: {
            Authorization: getJwt(),
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        this.removeAdInitiate();
        this.getData();
        this.getAdCount();
        this.setState({ submitLoading: false });
      })
      .catch(({ response }) => {
        this.setState({ submitLoading: false });
        if (response.status === 400) this.setState({ alreadyAdvertised: true });
        else this.imageErrorCheck("Server error. Try again later");
      });
  };

  handleSearchOnChange = (e) => {
    this.setState({ search: e.currentTarget.value });
  };

  handleSearch = async () => {
    const { search } = this.state;
    this.setState({ searchStarted: false, products: [] });
    if (search.length > 0) {
      this.setState({ searchStarted: true, loading: true, searchError: false });
      await axios
        .get(`${URL(API_ENDPOINT.productApi)}/mark/search/${search}`, {
          headers: {
            Authorization: getJwt(),
          },
        })
        .then(({ data }) => {
          this.setState({ loading: false, products: data, searchError: false });
        })
        .catch(() => {
          this.setState({ loading: false, searchError: true });
        });
    }
  };

  handleAdInitiate = (adId) => {
    this.setState({ adInitiate: true, adId });
  };

  removeAdInitiate = () => {
    this.setState({
      adInitiate: false,
      image: null,
      adId: null,
      alreadyAdvertised: false,
    });
    setTimeout(() => this.setState({ displayImage: null }), 300);
  };
  removeAd = async (id, index) => {
    this.setState({
      deleteIndex: index,
      deleteLoading: true,
      deleteError: false,
    });
    await axios
      .delete(`${URL(API_ENDPOINT.productApi)}/mark/marks/${id}`, {
        headers: {
          Authorization: getJwt(),
        },
      })
      .then(() => {
        this.setState({
          deleteLoading: false,
          deleteIndex: null,
          deleteError: null,
        });
        this.getAdCount();
        this.getData();
      })
      .catch(({ request }) => {
        if (request.status === 400) {
          this.deleteErrorHandle("Ad already deleted");
        } else this.deleteErrorHandle("Server error occured. Try again later");
        this.setState({ deleteLoading: false, deleteIndex: null });
      });
  };

  deleteErrorHandle = (errorMsg) => {
    this.setState({ deleteError: errorMsg });
    setTimeout(() => this.setState({ deleteError: null }), 4000);
  };

  render() {
    const {
      deleteIndex,
      deleteLoading,
      deleteError,
      productCount,
      productCountLoading,
      productCountError,
      adCount,
      adCountError,
      adCountLoading,
      advertisementLoading,
      advertisementError,
      advertisements,
      alreadyAdvertised,
      errorMsg,
      displayImage,
      searchStarted,
      loading,
      search,
      products,
      searchError,
      adInitiate,
      image,
      submitLoading,
    } = this.state;
    return (
      <div className="admin-advertisement-container">
        {deleteError && <div className="ad-delete-error">{deleteError}</div>}
        <div className="ad-instructions">
          <h2>Note:</h2>
          <ul>
            <li>1. To Advertise a product, you must add the product first</li>
            <li>2. A product can have only one advertisement</li>
            <li>3. Advertisement image should not be more than 1mb</li>
          </ul>
        </div>
        <h1>Manage Advertisements</h1>
        <HandleAd
          deleteIndex={deleteIndex}
          deleteLoading={deleteLoading}
          removeAd={this.removeAd}
          data={advertisements}
          loading={advertisementLoading}
          error={advertisementError}
        />
        <h1>Advertise Products</h1>
        <div className="ad-details">
          <h5>
            Products:
            {productCountLoading ? (
              <Lottie animationData={countLoading} className="count-loading" />
            ) : productCountError ? (
              <FaExclamation className="count-error" />
            ) : (
              <span>{productCount}</span>
            )}
          </h5>
          <h5>
            Advertisement:
            {adCountLoading ? (
              <Lottie animationData={countLoading} className="count-loading" />
            ) : adCountError ? (
              <FaExclamation className="count-error" />
            ) : (
              <span>{adCount}</span>
            )}
          </h5>
        </div>
        <div className="ad-product-search">
          <input
            value={search}
            onChange={this.handleSearchOnChange}
            placeholder="Enter the product name"
            type="text"
            autoCapitalize="off"
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
          />

          <button onClick={this.handleSearch}>
            <FaSearch />
          </button>
        </div>
        <div className="ad-products-container">
          {loading ? (
            <Lottie className="loading-icon" animationData={loadingIcon} />
          ) : searchError ? (
            <div className="search-error-container">
              <Lottie animationData={ServerError} />
              <h5>Unknown error occured. Try again later...</h5>
            </div>
          ) : products.length < 1 ? (
            <div className="search-error-container">
              <Lottie animationData={SearchEmpty} />
              {!searchStarted ? (
                <h5>Search Products</h5>
              ) : (
                <h5>No product found...</h5>
              )}
            </div>
          ) : (
            <>
              <h4>
                Found: <span>{products.length}</span>
              </h4>
              <div className="ad-each-products-container">
                {products.map((i, index) => (
                  <div key={index}>
                    <AdProducts
                      handleAdInitiate={this.handleAdInitiate}
                      product={i}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          <div
            className={`place-ad-container ${
              adInitiate ? "place-ad-container-display" : ""
            }`}
          >
            {errorMsg && <h2>{errorMsg}</h2>}
            {submitLoading && (
              <div className="ad-submit-loading">
                <Lottie
                  className="ad-submit-loading-icon"
                  animationData={loadingIcon}
                />
              </div>
            )}
            {alreadyAdvertised && (
              <h3>
                You have already advertised this product. Select a different
                product.
              </h3>
            )}
            <div className="ad-image-drop-container">
              <div>
                <label htmlFor="file-input">
                  {!displayImage ? (
                    <h5>Click to add image</h5>
                  ) : (
                    <img src={displayImage} alt="advertisement" />
                  )}
                </label>
              </div>
              {adInitiate && (
                <input
                  onChange={this.handleImageChange}
                  id="file-input"
                  type="file"
                />
              )}
              <div>
                <button
                  onClick={this.handleSubmit}
                  disabled={image && !submitLoading ? false : true}
                >
                  Submit
                </button>
                <button
                  disabled={submitLoading ? true : false}
                  onClick={this.removeAdInitiate}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminAdvertisement;
