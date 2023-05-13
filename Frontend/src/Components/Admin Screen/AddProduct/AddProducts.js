import React from "react";
import Lottie from "lottie-react";
import * as Yup from "yup";
import { Formik } from "formik";
import { FaQuestionCircle, FaTimesCircle, FaTimes } from "react-icons/fa";
import submitLoading from "../../../animations/loading.json";
import successSubmit from "../../../animations/success.json";
import submitFailure from "../../../animations/failure.json";

import AddProductMainContainer from "./AddProductMainContainer";
import AdminInputContainer from "../AdminInputContainer";
import DropDownCategory from "./DropDownCategory";
import dummyImage from "../../../Images/camera.png";

import "../../../css/addProduct.css";

const validate = Yup.object().shape({
  title: Yup.string()
    .required("Enter the product title")
    .min(8)
    .max(50)
    .label("Product Name")
    .trim(),
  category: Yup.string().required("Pick the category").label("Category"),
  price: Yup.string()
    .min(2, "Price cannot be less than $10")
    .max(4, "Price cannot be greater than $9999")
    .required("Enter the price")
    .label("Price")
    .trim(),
});
class AddProducts extends AddProductMainContainer {
  render() {
    const {
      uploadFail,
      uploadNote,
      beforeSuccess,
      loading,
      logoImage,
      productImage,
      allproductImages,
    } = this.state;
    return (
      <div className="add-product-container">
        {loading && (
          <div className="product-save-loading-container">
            <div className="product-save-loading">
              {uploadFail ? (
                <div className="product-saving-fail">
                  <FaTimes
                    className="close-product-saving-fail"
                    onClick={this.tryUploadAgian}
                  />
                  <Lottie
                    className="product-save-fail-icon"
                    animationData={submitFailure}
                    loop={false}
                    autoPlay={true}
                  />
                  <h4>Image upload failed...</h4>
                </div>
              ) : (
                <div className="product-saving-success">
                  {beforeSuccess && (
                    <FaTimes
                      onClick={() => (window.location = "/admin/add-product")}
                      className="close-product-saving-success"
                    />
                  )}
                  <h5>{uploadNote}</h5>
                  {!beforeSuccess && (
                    <Lottie
                      className="product-save-loading-icon"
                      animationData={submitLoading}
                      autoPlay
                      loop
                    />
                  )}
                  {beforeSuccess && (
                    <Lottie
                      className="product-save-success-icon"
                      animationData={successSubmit}
                      loop={false}
                      autoPlay={true}
                    />
                  )}
                  {beforeSuccess && (
                    <h4>You have successFully added the product</h4>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="add-product-sub-container">
          <Formik
            initialValues={{
              title: "",
              category: "",
              price: "",
            }}
            onSubmit={this.handleProductSubmit}
            validationSchema={validate}
          >
            {({
              handleSubmit,
              handleChange,
              errors,
              setFieldTouched,
              touched,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="product-logo-main-container">
                  <label
                    className="product-logo-container"
                    htmlFor="image-logo"
                  >
                    <input
                      name="thumbnail"
                      accept="image/*"
                      onChange={this.handleLogoChange}
                      id="image-logo"
                      type="file"
                    />
                    <img
                      src={logoImage}
                      className={logoImage === dummyImage ? "dummylogo" : ""}
                      alt="Thumbnail"
                    />
                  </label>
                  <h5 ref={this.logoError} className="product-logo-error">
                    Pick a Thumbnail
                  </h5>
                </div>
                <AdminInputContainer
                  type="text"
                  name="Title"
                  errors={errors.title}
                  touched={touched.title}
                  onBlur={() => setFieldTouched("title")}
                  onChange={handleChange("title")}
                />
                <DropDownCategory
                  errors={errors.category}
                  touched={touched.category}
                  onBlur={() => setFieldTouched("category")}
                  onChange={handleChange("category")}
                />
                <AdminInputContainer
                  type="number"
                  name="Price ($)"
                  errors={errors.price}
                  touched={touched.price}
                  onBlur={() => setFieldTouched("price")}
                  onChange={handleChange("price")}
                />
                <div className="product-image-main-container">
                  {allproductImages.length !== 4 && (
                    <label
                      className="product-images-container"
                      htmlFor="product-image"
                    >
                      <input
                        name="images"
                        multiple
                        accept="image/*"
                        onChange={this.handleProductImages}
                        id="product-image"
                        type="file"
                      />
                      <img src={productImage} alt="Products" />
                    </label>
                  )}
                  {allproductImages.map((image, index) => (
                    <div key={index} className="each-image">
                      <div className="close-each-product">
                        <FaTimesCircle
                          onClick={() => this.removeProductImage(index)}
                          className="close-each-product-icon"
                        />
                      </div>
                      <img src={image} alt="Products" />
                    </div>
                  ))}
                </div>
                <h2 className="submit-btn">
                  <button type="submit">Add Product</button>
                </h2>
              </form>
            )}
          </Formik>
        </div>
        <div
          ref={this.imageUploadError}
          className="product-image-upload-error"
        ></div>
        <div onClick={this.handleHelp} className="help-container">
          <div ref={this.helpChange} className="help-container-circle">
            <FaQuestionCircle />
          </div>
          <div ref={this.helpError} className="help-container-details">
            <h3>Note:</h3>
            <ul>
              <li>Images Should be of .jpeg or png</li>
              <li>Should be less than 1mb</li>
              <li>Should submit 4 product images</li>
            </ul>
          </div>
        </div>
        <div ref={this.moreThanFiveError} className="more-than-five-selection">
          Only <span>4 images</span> are allowed so other selections are removed
        </div>
        <h5 className="pick-4-images" ref={this.productImageError}>
          Pick <span>4</span> images
        </h5>
      </div>
    );
  }
}

export default AddProducts;
