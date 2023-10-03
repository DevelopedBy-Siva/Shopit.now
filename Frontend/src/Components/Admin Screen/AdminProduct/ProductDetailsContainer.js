import React, { Component, useState } from "react";
import Lottie from "lottie-react";
import loading from "../../../animations/loading.json";
import ReactFocusLock from "react-focus-lock";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import { formUrl as URL, api_endpoints } from "../../../api/api";
import { getJwt } from "../../../services/LoginReg";
import toast from "../../Toast";

class ProductDetailsContainer extends Component {
  state = {
    editToggle: false,
  };

  toggleEditDetails = () => {
    this.setState({ editToggle: !this.state.editToggle });
  };

  render() {
    const {
      toggleTrend,
      submitTrendingId,
      submitTrending,
      handleTrending,
      updateProductDetails,
      item,
    } = this.props;
    return (
      <>
        <tr className="admin-product-details-container">
          <td>
            <h2>{item.title.toLowerCase()}</h2>
            <h3>
              <span className="admin-product-details-container-detail-name">
                Category:{" "}
              </span>
              {item.category}
            </h3>
            <h4 className="admin-product-details-container-price">
              <span className="admin-product-details-container-detail-name">
                Price:{" "}
              </span>
              <span>{item.price}</span>
            </h4>
            <div>
              <button
                onClick={this.toggleEditDetails}
                className="admin-product-details-edit-btn"
              >
                Edit
              </button>
            </div>
          </td>

          <td>
            <h3 className="item-stock">{item.inStock}</h3>
          </td>

          <td>
            <h2>
              {item.id === submitTrendingId && submitTrending && (
                <Lottie
                  className="trending-submit-icon"
                  animationData={loading}
                />
              )}
            </h2>
            <div className="trend-toggle-icon">
              <div
                ref={toggleTrend}
                className={item.trending ? "toggle-trending" : ""}
                onClick={() => handleTrending(item.id)}
              >
                <span
                  className={`${item.trending ? "toggle-trending-round" : ""}`}
                />
              </div>
            </div>
          </td>
        </tr>
        {this.state.editToggle && (
          <EditDetailsContainer
            item={item}
            updateProductDetails={updateProductDetails}
            cancel={this.toggleEditDetails}
          />
        )}
      </>
    );
  }
}

export default ProductDetailsContainer;

const validate = Yup.object().shape({
  title: Yup.string()
    .required("Enter the product title")
    .min(8)
    .max(50)
    .label("Product Name")
    .trim(),
  price: Yup.string()
    .min(2, "Price cannot be less than $10")
    .max(4, "Price cannot be greater than $9999")
    .required("Enter the price")
    .label("Price")
    .trim(),
  stock: Yup.number()
    .positive()
    .integer()
    .min(10, "Minimum 10 stocks required")
    .max(100, "Minimum 100 stocks are only allowed")
    .required("Enter the Stock")
    .label("Stock"),
});

function EditDetailsContainer({ cancel, item, updateProductDetails }) {
  const [loading, setLoading] = useState(false);

  const { id, title, inStock, price } = item;

  const handleProductDetailsSubmit = async (data, id) => {
    setLoading(true);
    await axios
      .put(
        `${URL(api_endpoints.productApi)}/update/update-details/${id}`,
        {
          ...data,
        },
        {
          headers: { Authorization: getJwt() },
        }
      )
      .then(() => {
        toast.success("Product details updated");
        updateProductDetails(id, data);
        cancel();
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
    setLoading(false);
  };

  return (
    <div className="admin-details-edit-details-wrapper">
      <ReactFocusLock>
        <div className="admin-details-edit-details-container">
          <h2>Edit Product</h2>
          <Formik
            initialValues={{
              title: title,
              price: price,
              stock: inStock,
            }}
            enableReinitialize
            onSubmit={(value) => handleProductDetailsSubmit(value, id)}
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
              <form
                onSubmit={handleSubmit}
                className="admin-details-edit-details-input-container"
              >
                <div className="admin-details-edit-details-input">
                  <label>Name:</label>
                  <input
                    disabled={loading}
                    maxLength={50}
                    value={values.title}
                    errors={errors.title}
                    onBlur={() => setFieldTouched("title")}
                    onChange={handleChange("title")}
                    placeholder="Enter the name"
                    type="text"
                  />
                  {errors.title && touched.title && (
                    <span className="admin-details-edit-details-input-error">
                      {errors.title}
                    </span>
                  )}
                </div>
                <div className="admin-details-edit-details-input">
                  <label>
                    Price<span>($):</span>
                  </label>
                  <input
                    disabled={loading}
                    type="number"
                    value={values.price}
                    errors={errors.price}
                    onBlur={() => setFieldTouched("price")}
                    onChange={handleChange("price")}
                    placeholder="Enter the price"
                  />
                  {errors.price && touched.price && (
                    <span className="admin-details-edit-details-input-error">
                      {errors.price}
                    </span>
                  )}
                </div>
                <div className="admin-details-edit-details-input">
                  <label>Stock:</label>
                  <input
                    disabled={loading}
                    type="number"
                    value={values.stock}
                    errors={errors.stock}
                    onBlur={() => setFieldTouched("stock")}
                    onChange={handleChange("stock")}
                    placeholder="Enter the stock"
                  />
                  {errors.stock && touched.stock && (
                    <span className="admin-details-edit-details-input-error">
                      {errors.stock}
                    </span>
                  )}
                </div>
                <div className="admin-details-edit-details-btn-container">
                  <button type="submit" disabled={loading}>
                    Save
                  </button>
                  <button type="button" disabled={loading} onClick={cancel}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </ReactFocusLock>
    </div>
  );
}
