import React, { Component } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import AdminInput from "./AdminInput";
import { FaTimesCircle } from "react-icons/fa";
import loading from "../../../animations/smallLoad.json";
import success from "../../../animations/successTick.json";
import Lottie from "lottie-react";

const validate = Yup.object().shape({
  title: Yup.string()
    .required("Enter the product title")
    .min(8)
    .max(30)
    .label("Product Name")
    .trim(),
  price: Yup.string()
    .min(2, "Price cannot be less than $10")
    .max(4, "Price cannot be greater than $9999")
    .required("Enter the price")
    .label("Price")
    .trim(),
});

class ProductEditComponent extends Component {
  render() {
    const dummy = {
      id: "",
      title: "",
      price: "",
    };
    const {
      submitError,
      exitBtn,
      updateSuccess,
      submittingUpdateDetails,
      submittingDetails,
      handleProductDetailsSubmit,
      coverRef,
      detailsRef,
      handleProductEdit,
      details,
    } = this.props;
    return (
      <>
        <div ref={coverRef} className="admin-product-edit-cover" />
        <div
          className={`product-submit-error ${
            submitError ? "product-submit-error-display" : ""
          }`}
        >
          Internal server error occured. Try after sometime.
        </div>
        <div ref={detailsRef} className="edit-admin-product-details">
          <div ref={exitBtn} className="admin-edit-close-icon">
            <FaTimesCircle onClick={() => handleProductEdit(dummy)} />
          </div>
          <h2>Edit Product Details</h2>
          <Formik
            initialValues={{
              title: details.title,
              price: details.price,
            }}
            enableReinitialize
            onSubmit={(value) => handleProductDetailsSubmit(value, details.id)}
            validationSchema={validate}
          >
            {({
              handleSubmit,
              handleChange,
              errors,
              values,
              setFieldTouched,
              touched,
            }) => (
              <form onSubmit={handleSubmit}>
                <AdminInput
                  value={values.title}
                  touched={touched.title}
                  errors={errors.title}
                  onBlur={() => setFieldTouched("title")}
                  onChange={handleChange("title")}
                  placeholder="Enter the name"
                  type="text"
                />
                <AdminInput
                  value={values.price}
                  touched={touched.price}
                  errors={errors.price}
                  onBlur={() => setFieldTouched("price")}
                  onChange={handleChange("price")}
                  placeholder="Enter the price ($)"
                  type="number"
                />
                <h3>
                  <button ref={submittingUpdateDetails} type="submit">
                    {submittingDetails ? (
                      <Lottie
                        className={
                          updateSuccess
                            ? "update-submit-success-icon"
                            : "update-submit-loading"
                        }
                        animationData={updateSuccess ? success : loading}
                        autoPlay
                        loop={updateSuccess ? false : true}
                      />
                    ) : (
                      <span>Save</span>
                    )}
                  </button>
                </h3>
              </form>
            )}
          </Formik>
        </div>
      </>
    );
  }
}

export default ProductEditComponent;
