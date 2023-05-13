import React, { Component } from "react";
import AdminInput from "./AdminInput";
import { FaTimesCircle } from "react-icons/fa";
import * as Yup from "yup";
import { Formik } from "formik";
import loading from "../../../animations/smallLoad.json";
import success from "../../../animations/successTick.json";
import Lottie from "lottie-react";

const validate = Yup.object().shape({
  stock: Yup.number()
    .positive()
    .integer()
    .min(10, "Minimum 10 stocks required")
    .max(100, "Minimum 100 stocks are only allowed")
    .required("Enter the Stock")
    .label("Stock"),
});

class ProductStockEdit extends Component {
  render() {
    const dummy = {
      id: "",
      inStock: "",
    };

    const {
      submittingDetails,
      submittingStockUpdate,
      updateSuccess,
      exitBtn,
      handleProductStockSubmit,
      stockRef,
      handleStockEdit,
      stock,
    } = this.props;
    return (
      <div ref={stockRef} className="edit-admin-product-stock">
        <div ref={exitBtn} className="admin-edit-stock-close-icon">
          <FaTimesCircle onClick={() => handleStockEdit(dummy)} />
        </div>
        <h2>Edit Product Stocks</h2>
        <Formik
          initialValues={{
            stock: stock.inStock,
          }}
          enableReinitialize
          onSubmit={(value) => handleProductStockSubmit(value, stock.id)}
          validationSchema={validate}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            errors,
            setFieldTouched,
            touched,
          }) => (
            <form onSubmit={handleSubmit}>
              <AdminInput
                value={values.stock}
                onChange={handleChange("stock")}
                onBlur={() => setFieldTouched("stock")}
                errors={errors.stock}
                touched={touched.stock}
                placeholder="Enter the stock"
                type="number"
              />
              <h3>
                <button ref={submittingStockUpdate} type="submit">
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
    );
  }
}

export default ProductStockEdit;
