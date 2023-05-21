import React, { Component } from "react";
import { userRegistration } from "../../services/LoginReg";
import { userLogin, setJwt } from "../../services/LoginReg";
import toast from "../Toast";

class RegisterMain extends Component {
  constructor(props) {
    super(props);
    this.nameref = React.createRef();
    this.emailref = React.createRef();
    this.mobileref = React.createRef();
    this.passwordref = React.createRef();
    this.confirmref = React.createRef();
    this.submitRef = React.createRef();
  }

  state = {
    registerError: null,
    registrationBegin: false,
  };

  disableBtn = (event, isLoading) => {
    toast.remove();
    if (isLoading) event.preventDefault();
  };

  handleRegistration = async ({ name, email, mobile, password }) => {
    const register = { fullname: name, email, mobile, password };
    this.errorHandle(null, true);
    await userRegistration(register)
      .then(() => {
        this.registrationSuccess(email, password);
      })
      .catch(({ response }) => {
        let registerError = "Server down. Try after sometime";
        if (response && response.status === 400)
          registerError = "Email already registered";
        this.errorHandle(registerError, false);
        toast.error(registerError, toast.props.persist);
      });
  };

  errorHandle = (registerError, registrationBegin) => {
    this.setState({ registerError, registrationBegin });
  };

  registrationSuccess = async (email, password) => {
    await userLogin(email, password)
      .then(({ data }) => {
        setJwt(data);
        window.location = "/";
      })
      .catch(() => {
        window.location = "/login";
      });
  };
}

export default RegisterMain;
