import React from "react";
import { Link } from "react-router-dom";
import {
  FaAngleLeft,
  FaPlusCircle,
  FaEdit,
  FaTimesCircle,
  FaTrash,
  FaStar,
} from "react-icons/fa";
import AccountContainerInput from "../Components/Home/AccountContainerInput";
import { Formik } from "formik";
import Lottie from "lottie-react";
import loadingIcon from "../animations/loading.json";
import * as Yup from "yup";
import "../css/account-address-container.css";
import AddressContainer from "../Components/Account Screen/AddressContainer";
import AddressBtn from "../Components/Admin Screen/AddressBtn";

const validate = Yup.object().shape({
  houseNo: Yup.string()
    .required("Enter the house no")
    .min(3)
    .max(20)
    .label("House No")
    .trim(),
  town: Yup.string().required("Enter the town").max(25).label("Town").trim(),
  city: Yup.string().required("Enter the city").label("City").trim(),
  state: Yup.string().max(20).required("Enter the State").label("State").trim(),
  pincode: Yup.string()
    .min(6, "Invalid pincode")
    .max(6, "Invalid pincode")
    .required("Enter the pincode")
    .label("Pincode"),
});

class AccountAddress extends AddressContainer {
  render() {
    const {
      onSubmission,
      loading,
      noMountError,
      submissionError,
      savedAddress,
      account,
    } = this.state;
    return (
      <>
        <div ref={this.errorRef} className="account-address-error">
          {submissionError}
        </div>
        <div className="account-address-container">
          {loading && (
            <Lottie
              animationData={loadingIcon}
              className="account-address-loading"
            />
          )}
          <div className="manage-address-header">
            <h2>Manage Address</h2>
            <Link to="/account" className="go-back">
              <FaAngleLeft className="left-fa-icon" />
              <span className="go-back">Go Back</span>
            </Link>
          </div>
          <div className="add-address">
            {account.map((item, index) => (
              <div key={index} className="addresses">
                <div className="address-details">
                  <h5>
                    <span>House:</span> {item.addressDetails.houseNo}
                  </h5>
                  <h5>
                    <span>Town:</span> {item.addressDetails.town}
                  </h5>
                  <h5>
                    <span>City:</span> {item.addressDetails.city}
                  </h5>
                  <h5>
                    <span>State:</span> {item.addressDetails.state}
                  </h5>
                  <h5>
                    <span>Pincode:</span> {item.addressDetails.pincode}
                  </h5>
                </div>
                <div className="addresses-cover">
                  <div>
                    <FaEdit
                      onClick={() => this.handleEdit(item)}
                      className="fa-icon fa-icon-yellow"
                    />
                    <FaTrash
                      onClick={() => this.deleteAddress(item.id)}
                      className="fa-icon fa-icon-red"
                    />
                  </div>
                  <button onClick={() => this.changeDefault(item.id)}>
                    Set Default
                  </button>
                </div>
                {item.defaultAddress && (
                  <FaStar className="default-star" color="rgb(255, 166, 0)" />
                )}
              </div>
            ))}
            {account.length < 3 && noMountError && !loading && (
              <div onClick={this.handleAddAddress} className="add-address-btn">
                <FaPlusCircle className="add-address-btn-icon" />
              </div>
            )}
          </div>
        </div>
        <div className="address-input">
          <FaTimesCircle
            onClick={!onSubmission && this.handleAddAddress}
            className="address-input-close"
          />
          <h2>Add Address</h2>

          <Formik
            initialValues={
              savedAddress.id
                ? savedAddress.addressDetails
                : {
                    houseNo: "",
                    town: "",
                    city: "",
                    state: "",
                    pincode: "",
                  }
            }
            enableReinitialize
            validationSchema={validate}
            onSubmit={savedAddress.id ? this.editChanges : this.addAddress}
          >
            {({
              handleChange,
              handleReset,
              handleSubmit,
              touched,
              errors,
              setFieldTouched,
              values,
            }) => (
              <form onReset={handleReset} onSubmit={handleSubmit}>
                <AccountContainerInput
                  maxLength={10}
                  value={values.houseNo}
                  type="text"
                  onBlur={() => setFieldTouched("houseNo")}
                  errors={errors.houseNo}
                  touched={touched.houseNo}
                  onChange={handleChange("houseNo")}
                  name="House No/ Street"
                />
                <AccountContainerInput
                  maxLength={20}
                  value={values.town}
                  type="text"
                  onBlur={() => setFieldTouched("town")}
                  errors={errors.town}
                  touched={touched.town}
                  onChange={handleChange("town")}
                  name="Town"
                />
                <AccountContainerInput
                  maxLength={20}
                  value={values.city}
                  type="text"
                  onBlur={() => setFieldTouched("city")}
                  errors={errors.city}
                  touched={touched.city}
                  onChange={handleChange("city")}
                  name="City"
                />
                <AccountContainerInput
                  maxLength={20}
                  value={values.state}
                  type="text"
                  onBlur={() => setFieldTouched("state")}
                  errors={errors.state}
                  touched={touched.state}
                  onChange={handleChange("state")}
                  name="State"
                />
                <AccountContainerInput
                  maxLength={6}
                  type="number"
                  value={values.pincode}
                  onBlur={() => setFieldTouched("pincode")}
                  errors={errors.pincode}
                  touched={touched.pincode}
                  onChange={handleChange("pincode")}
                  name="Pincode"
                />
                {savedAddress.id ? (
                  <AddressBtn onSubmission={onSubmission} name="Save Changes" />
                ) : (
                  <AddressBtn onSubmission={onSubmission} name="Add Address" />
                )}
              </form>
            )}
          </Formik>
        </div>
        <div
          onClick={!onSubmission && this.handleAddAddress}
          className="background-overlay"
        ></div>
      </>
    );
  }
}

export default AccountAddress;
