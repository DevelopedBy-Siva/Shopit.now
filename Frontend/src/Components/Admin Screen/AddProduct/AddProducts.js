import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { FaTimesCircle, FaHandPointRight } from "react-icons/fa";
import { MdInfo, MdCameraAlt } from "react-icons/md";

import AddProductMainContainer from "./AddProductMainContainer";
import AdminInputContainer from "../AdminInputContainer";
import DropDownCategory from "./DropDownCategory";
import dummyImage from "../../../Images/camera.png";

import "../../../css/addProduct.css";
import Loader from "../../Loader";

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
    const { loading, logoImage, allproductImages } = this.state;
    return (
      <div className="add-product-container">
        <div className="add-product-sub-container">
          <Formik
            initialValues={{
              title: "",
              category: "",
              price: "",
            }}
            onSubmit={(values, { resetForm }) =>
              this.handleProductSubmit(values, resetForm)
            }
            validationSchema={validate}
          >
            {({
              handleSubmit,
              handleChange,
              errors,
              setFieldTouched,
              touched,
            }) => (
              <form ref={this.formRef} onSubmit={handleSubmit}>
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
                    Pick a thumbnail
                  </h5>
                </div>
                <AdminInputContainer
                  type="text"
                  name="Title"
                  disabled={loading}
                  errors={errors.title}
                  touched={touched.title}
                  onBlur={() => setFieldTouched("title")}
                  onChange={handleChange("title")}
                />
                <DropDownCategory
                  disabled={loading}
                  errors={errors.category}
                  touched={touched.category}
                  onBlur={() => setFieldTouched("category")}
                  onChange={handleChange("category")}
                />
                <AdminInputContainer
                  type="number"
                  name="Price ($)"
                  disabled={loading}
                  errors={errors.price}
                  touched={touched.price}
                  onBlur={() => setFieldTouched("price")}
                  onChange={handleChange("price")}
                />
                <div className="product-image-main-container">
                  {allproductImages.length !== 4 && (
                    <div className="product-images-container">
                      <span>Pick 4 images of the product</span>
                      <label htmlFor="product-image">
                        <input
                          disabled={loading}
                          name="images"
                          multiple
                          accept="image/*"
                          onChange={this.handleProductImages}
                          id="product-image"
                          type="file"
                        />
                        <MdCameraAlt />
                      </label>
                    </div>
                  )}
                  <div className="product-image-sub-container">
                    {allproductImages.map((image, index) => (
                      <div key={index} className="each-image">
                        <button
                          className="close-each-product"
                          disabled={loading}
                        >
                          <FaTimesCircle
                            onClick={() => this.removeProductImage(index)}
                            className="close-each-product-icon"
                          />
                        </button>
                        <img src={image} alt="Products" />
                      </div>
                    ))}
                  </div>
                </div>
                <button disabled={loading} className="submit-btn" type="submit">
                  {loading ? (
                    <Loader style={{ width: "18px", height: "18px" }} />
                  ) : (
                    "Add Product"
                  )}
                </button>
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
            <MdInfo />
          </div>
          <div ref={this.helpError} className="help-container-details">
            <span>Note:-</span>
            <div>
              <p>
                <FaHandPointRight /> Images should be of type .webp
              </p>
              <p>
                <FaHandPointRight /> Images should be less than 50kb
              </p>
              <p>
                <FaHandPointRight /> Must submit 4 images of the product
              </p>
            </div>
          </div>
        </div>
        <div ref={this.moreThanFiveError} className="more-than-five-selection">
          Only <span>4 images</span> are allowed so other selections are removed
        </div>
      </div>
    );
  }
}

export default AddProducts;
