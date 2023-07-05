import React, { Component } from "react";
import InputContainer from "./InputContainer";
import {
  api_endpoints as API_ENDPOINT,
  formUrl as URL,
} from "../../../api/api";
import axios from "axios";
import { getCurrentUser, getJwt, removeJwt } from "../../../services/LoginReg";
import loadingAnim from "../../../animations/dataload.json";
import Lottie from "lottie-react";

class DeleteAccount extends Component {
  state = {
    loading: false,
    error: null,
    deletionPass: "",
  };

  storePassword = (e) => {
    const value = e.currentTarget.value;
    this.setState({ deletionPass: value });
    if (value.length === 0) {
      this.setState({ error: "Enter Password" });
    } else {
      this.setState({ error: null });
    }
  };

  performDeletion = async () => {
    const { deletionPass } = this.state;
    const { id } = getCurrentUser();
    if (deletionPass.length > 0) {
      this.setState({ loading: true, error: null });
      await axios
        .post(
          `${URL(API_ENDPOINT.userOperations)}/delete-user/${id}`,
          {},
          {
            headers: {
              Authorization: getJwt(),
              "user-password": deletionPass,
            },
          }
        )
        .then(() => {
          removeJwt();
        })
        .catch(({ request }) => {
          if (request.status === 401) {
            this.setState({ error: "Password is wrong", loading: false });
          } else {
            this.setState({
              error: "Server error. Try after sometime",
              loading: false,
            });
          }
        });
    } else {
      this.setState({ error: "Enter the password" });
    }
  };

  render() {
    const { error, deletionPass, loading } = this.state;
    return (
      <div className="admin-settings-delete-container">
        <h1>Delete Account</h1>
        {loading && (
          <div className="admin-settings-delete-loading">
            <Lottie className="loading-anim" animationData={loadingAnim} />
          </div>
        )}
        <h4>
          Are you sure you want to delete the account? Once you delete the
          account, there is no way getting it back.
        </h4>
        <InputContainer
          disabled={loading ? true : false}
          value={deletionPass}
          onChange={this.storePassword}
          name="Confirm Password"
        />
        {error && <h5>{error}</h5>}
        <p>
          <button
            disabled={loading ? true : false}
            onClick={this.performDeletion}
          >
            Delete
          </button>
        </p>
      </div>
    );
  }
}

export default DeleteAccount;
