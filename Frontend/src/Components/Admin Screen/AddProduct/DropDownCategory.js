import React, { Component } from "react";
class DropDownCategory extends Component {
  state = {};

  options = ["Mobiles", "Laptops", "Fashion", "Kids & Baby", "Appliances"];

  render() {
    const { errors, touched, ...rest } = this.props;
    return (
      <div className="pick-category-container">
        <select name="category" {...rest}>
          <option hidden defaultValue="">
            Pick a category
          </option>
          {this.options.map((item, index) => (
            <option value={item} key={index}>
              {item}
            </option>
          ))}
        </select>
        {errors && touched && <h5>{errors}</h5>}
      </div>
    );
  }
}

export default DropDownCategory;
