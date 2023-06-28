import React, { Component } from "react";

class AdminInputContainer extends Component {
  render() {
    const { errors, touched, name, ...rest } = this.props;
    return (
      <div className="admin-input-container">
        <input
          placeholder=" "
          autoComplete="off"
          spellCheck="false"
          {...rest}
        />
        <label htmlFor={name}>{name}</label>
        {errors && touched && <h5>{errors}</h5>}
      </div>
    );
  }
}

export default AdminInputContainer;
