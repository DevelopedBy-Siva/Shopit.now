import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import PaymentDate from "./PaymentDate";

const validate = Yup.object().shape({
  name: Yup.string()
    .required("Enter the name on card")
    .min(5)
    .max(20)
    .label("Card name")
    .trim(),
  cardNo: Yup.number()
    .required("Enter the card no.")
    .min(1000000000000000, "Invalid card no. 16 digits required")
    .max(9999999999999999, "Invalid no. 16 digits required")
    .label("Card No"),
  month: Yup.number(),
  year: Yup.number(),
});
class PaymentInput extends Component {
  render() {
    const { savedCard, handleCard } = this.props;
    return (
      <Formik
        initialValues={
          savedCard
            ? savedCard
            : {
                name: "",
                cardNo: "",
                month: 1,
                year: 2030,
              }
        }
        enableReinitialize
        onSubmit={handleCard}
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
            <div className="card-name">
              <h4>Name on card</h4>
              <input
                type="text"
                value={values.name}
                onChange={handleChange("name")}
                onBlur={() => setFieldTouched("name")}
                spellCheck="false"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
              />
              {errors.name && touched.name && <h5>{errors.name}</h5>}
            </div>
            <div className="card-no">
              <h4>Card number</h4>
              <input
                type="number"
                value={values.cardNo}
                onChange={handleChange("cardNo")}
                onBlur={() => setFieldTouched("cardNo")}
                spellCheck="false"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
              />
              {errors.cardNo && touched.cardNo && <h5>{errors.cardNo}</h5>}
            </div>
            <div className="card-dates">
              <h4>Expiry date</h4>
              <PaymentDate
                dateChange={handleChange("month")}
                yearChange={handleChange("year")}
              />
            </div>
            <button type="submit">
              {savedCard ? "Update Card" : "Add Card"}
            </button>{" "}
            {savedCard ? (
              <span className="card-added-success-msg">Card Added</span>
            ) : (
              ""
            )}
          </form>
        )}
      </Formik>
    );
  }
}

export default PaymentInput;
