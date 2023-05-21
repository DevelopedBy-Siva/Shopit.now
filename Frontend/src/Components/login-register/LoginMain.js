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
        const { state } = this.props.location;
        this.loginSuccess(data, state);
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

  loginSuccess = (data, state) => {
    setJwt(data);
    window.location = state ? state.from.pathname : "/";
  };
}

export default LoginMain;
