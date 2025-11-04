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
import MaterialsCategory from "./MaterialsCategory";

const validate = Yup.object().shape({
  title: Yup.string()
    .required("Enter the product title")
    .min(8)
    .max(50)
    .label("Product Name")
    .trim(),
  category: Yup.string().required("Pick the category").label("Category"),
  material: Yup.string().required("Pick the material").label("Material"),
  description: Yup.string()
    .required("Enter the product description")
    .min(50)
    .max(5024)
    .label("Description")
    .trim(),
  price: Yup.string()
    .min(2, "Price cannot be less than $10")
    .max(4, "Price cannot be greater than $9999")
    .required("Enter the price")
    .label("Price")
    .trim(),
  emission_factor: Yup.number().nullable().label("Emission Factor"),
  eco_score: Yup.number().nullable().label("Eco Score"),
  weight: Yup.number()
    .min(0.1, "Weight cannot be less than 0.1kg")
    .required("Enter the weight")
    .label("Weight (in Kg)"),
  origin_location: Yup.string()
    .required("Enter the origin location")
    .min(2)
    .max(50)
    .label("Origin Location")
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
              material: "",
              price: "",
              description: "",
              emission_factor: 0,
              eco_score: 0,
              weight: 0,
              origin_location: "",
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
              values,
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

                <MaterialsCategory
                  disabled={loading}
                  category={values.category}
                  value={values.material}
                  errors={errors.material}
                  touched={touched.material}
                  onBlur={() => setFieldTouched("material")}
                  onChange={handleChange("material")}
                  valueEcoScore={values.eco_score}
                  valueEmissionFactor={values.emission_factor}
                  onChangeEcoScore={handleChange("eco_score")}
                  onChangeeEmissionFactor={handleChange("emission_factor")}
                />

                <AdminInputContainer
                  type="number"
                  step="any"
                  name="Weight (in Kg)"
                  disabled={loading}
                  errors={errors.weight}
                  touched={touched.weight}
                  onBlur={() => setFieldTouched("weight")}
                  onChange={handleChange("weight")}
                />
                <AdminInputContainer
                  type="number"
                  step="any"
                  name="Price (USD)"
                  disabled={loading}
                  errors={errors.price}
                  touched={touched.price}
                  onBlur={() => setFieldTouched("price")}
                  onChange={handleChange("price")}
                />
                <AdminInputContainer
                  type="text"
                  name="Origin Location"
                  disabled={loading}
                  errors={errors.origin_location}
                  touched={touched.origin_location}
                  onBlur={() => setFieldTouched("origin_location")}
                  onChange={handleChange("origin_location")}
                />

                <div className="product-description">
                  <label>Description</label>
                  <textarea
                    name="Description"
                    placeholder="Please provide details about the product..."
                    disabled={loading}
                    onBlur={() => setFieldTouched("description")}
                    onChange={handleChange("description")}
                  />
                  {errors.description && touched.description && (
                    <h5>{errors.description}</h5>
                  )}
                </div>
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
      </div>
    );
  }
}

export default AddProducts;
