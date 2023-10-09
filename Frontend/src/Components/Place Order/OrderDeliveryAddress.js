import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Loader from "../Loader";

const validate = Yup.object().shape({
  houseNo: Yup.string()
    .required("Enter the house no/street")
    .min(3)
    .max(20)
    .label("House No")
    .trim(),
  town: Yup.string().required("Enter the town").max(25).label("Town").trim(),
  city: Yup.string().required("Enter the city").label("City").trim(),
  state: Yup.string().max(20).required("Enter the State").label("State").trim(),
  pincode: Yup.string()
    .min(5, "Invalid pincode")
    .max(10, "Invalid pincode")
    .required("Enter the pincode")
    .label("Pincode"),
});

class OrderDeliveryAddress extends Component {
  render() {
    const { addAddress, btnRef, onSubmission } = this.props;

    return (
      <div className="address-container">
        <Formik
          initialValues={{
            houseNo: "",
            town: "",
            city: "",
            state: "",
            pincode: "",
          }}
          enableReinitialize
          validationSchema={validate}
          onSubmit={addAddress}
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
              <div>
                <input
                  disabled={onSubmission}
                  spellCheck="false"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  placeholder=" "
                  maxLength={10}
                  value={values.houseNo}
                  type="text"
                  onBlur={() => setFieldTouched("houseNo")}
                  onChange={handleChange("houseNo")}
                  name="house"
                />
                <label htmlFor="house">House No/ Street</label>
                {errors.houseNo && touched.houseNo && <h4>{errors.houseNo}</h4>}
              </div>

              <div>
                <input
                  disabled={onSubmission}
                  spellCheck="false"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  placeholder=" "
                  value={values.town}
                  type="text"
                  onBlur={() => setFieldTouched("town")}
                  onChange={handleChange("town")}
                  name="Town"
                />
                <label htmlFor="Town">Town</label>
                {errors.town && touched.town && <h4>{errors.town}</h4>}
              </div>

              <div>
                <input
                  disabled={onSubmission}
                  spellCheck="false"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  placeholder=" "
                  value={values.city}
                  type="text"
                  onBlur={() => setFieldTouched("city")}
                  onChange={handleChange("city")}
                  name="City"
                />
                <label htmlFor="City">City</label>
                {errors.city && touched.city && <h4>{errors.city}</h4>}
              </div>

              <div>
                <input
                  disabled={onSubmission}
                  spellCheck="false"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  placeholder=" "
                  value={values.state}
                  type="text"
                  onBlur={() => setFieldTouched("state")}
                  onChange={handleChange("state")}
                  name="State"
                />
                <label htmlFor="State">State</label>
                {errors.state && touched.state && <h4>{errors.state}</h4>}
              </div>

              <div>
                <input
                  disabled={onSubmission}
                  spellCheck="false"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  placeholder=" "
                  value={values.pincode}
                  onBlur={() => setFieldTouched("pincode")}
                  onChange={handleChange("pincode")}
                  name="Pincode"
                />
                <label htmlFor="Pincode">Pincode</label>
                {errors.pincode && touched.pincode && <h4>{errors.pincode}</h4>}
              </div>

              <p className="add-address-btn">
                <button disabled={onSubmission} ref={btnRef} type="submit">
                  {onSubmission ? (
                    <Loader style={{ width: "17px", height: "17px" }} />
                  ) : (
                    "Add Address"
                  )}
                </button>
              </p>
            </form>
          )}
        </Formik>
      </div>
    );
  }
}

export default OrderDeliveryAddress;
