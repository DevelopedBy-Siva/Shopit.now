import React, { Component } from "react";
import { FaSearch } from "react-icons/fa";
import Lottie from "lottie-react";
import loadingIcon from "../../../animations/dataload.json";
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
import toast from "../../Toast";
import ReactFocusLock from "react-focus-lock";
import Loader from "../../Loader";

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
    image: null,
    advertisementLoading: false,
    advertisementError: false,
    advertisements: [],
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
    toast.info(errorMsg);
  };

  handleAdData = (adId) => {
    const newAds = this.state.advertisements.filter(
      (i) => i.productId !== adId
    );
    this.setState({ advertisements: [...newAds] });
  };

  handleSubmit = async () => {
    const { image, adInitiate, advertisements } = this.state;
    const uploadImageData = new FormData();
    uploadImageData.append("imageFile", image, image.name);
    this.setState({
      errorMsg: null,
      submitLoading: true,
    });
    await axios
      .post(
        `${URL(API_ENDPOINT.productApi)}/mark/et-ing/${adInitiate.productId}`,
        uploadImageData,
        {
          headers: {
            Authorization: getJwt(),
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(({ data }) => {
        this.setState({
          submitLoading: false,
          advertisements: [...advertisements, data],
          adInitiate: null,
          image: null,
          displayImage: null,
        });
        toast.success("Advertisement added");
      })
      .catch(({ response }) => {
        this.setState({ submitLoading: false });
        if (response && response.status === 400)
          toast.info("Product already advertised");
        else toast.error("Something went wrong");
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

  handleAdInitiate = (val = null) => {
    this.setState({ adInitiate: val, image: null, displayImage: null });
  };

  render() {
    const {
      deleteIndex,
      deleteLoading,
      deleteError,
      productCount,
      productCountLoading,
      productCountError,
      advertisementLoading,
      advertisementError,
      advertisements,
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
          handleAdData={this.handleAdData}
        />
        <h1>Advertise Products</h1>
        <div className="ad-details">
          <h5>
            Products:
            {!productCountLoading && !productCountError && (
              <span>{productCount}</span>
            )}
          </h5>
          <h5>
            Advertisements:
            {!advertisementLoading && !advertisementError && (
              <span>{advertisements.length}</span>
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
            <div className="ad-products-container-loading">
              <Lottie className="loading-icon" animationData={loadingIcon} />
            </div>
          ) : searchError ? (
            <div className="search-error-container">
              <Lottie loop={false} animationData={ServerError} />
              <h5>Unknown error occured. Try again later...</h5>
            </div>
          ) : products.length < 1 ? (
            <div className="search-error-container">
              <Lottie loop={false} animationData={SearchEmpty} />
              {!searchStarted ? (
                <h5>Search Products</h5>
              ) : (
                <h5>No product found...</h5>
              )}
            </div>
          ) : (
            <>
              <div className="ad-products-wrapper">
                {products.map((i, index) => (
                  <div key={index}>
                    <AdProducts
                      handleAdInitiate={() => this.handleAdInitiate(i)}
                      product={i}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {adInitiate && (
            <div className="place-ad-container">
              <ReactFocusLock>
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
                      disabled={submitLoading}
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
                      {submitLoading ? (
                        <Loader style={{ width: "18px", height: "18px" }} />
                      ) : (
                        "Submit"
                      )}
                    </button>
                    <button
                      disabled={submitLoading}
                      onClick={() => this.handleAdInitiate(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </ReactFocusLock>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AdminAdvertisement;
