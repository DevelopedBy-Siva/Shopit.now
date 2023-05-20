import React, { Component } from "react";
import "../../css/inputcontainer.css";

class InputContainer extends Component {
  render() {
    const { inputRef, name, errors, touched, maxWidth, ...rest } = this.props;
    return (
      <div className="input-container" {...rest}>
        <input placeholder=" " name={name} ref={inputRef} {...rest} />
        <label htmlFor={name}>{name}</label>
        {errors && touched && <h5 className="input-error">{errors}</h5>}
      </div>
    );
  }
}

export default InputContainer;
