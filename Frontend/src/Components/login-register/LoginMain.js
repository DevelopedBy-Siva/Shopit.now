import React, { Component } from "react";
import { userLogin, setJwt } from "../../services/LoginReg";
import toast from "../Toast";

class LoginMain extends Component {
  constructor(props) {
    super(props);
    this.userref = React.createRef();
    this.passref = React.createRef();
    this.submitRef = React.createRef();
  }

  state = {
    loginError: null,
    loginBegan: false,
  };

  disableBtn = (event, isLoading) => {
    toast.remove();
    if (isLoading) event.preventDefault();
  };

  handleLogin = async ({ email, password }) => {
    toast.remove();
    this.handleError(true, null);
    await userLogin(email, password)
      .then(({ data }) => {
        this.loginSuccess(data);
      })
      .catch(({ response }) => {
        let message = "Server down. Try after sometime";
        if (response && response.status === 401)
          message = "Invalid email or password";
        this.handleError(false, message);
        toast.error(message, toast.props.persist);
      });
  };

  handleError = (loginBegan, loginError) => {
    this.setState({ loginBegan, loginError });
  };

  redirectTo = () => {
    const { state } = this.props.location;
    return state && state.redirect ? state.redirect.pathname : "/";
  };

  loginSuccess = (data) => {
    setJwt(data);
    window.location = this.redirectTo();
  };
}

export default LoginMain;
