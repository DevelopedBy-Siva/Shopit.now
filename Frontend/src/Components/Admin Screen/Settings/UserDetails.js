import React, { Component } from "react";
import userDummy from "../../../Images/user.png";
import {
  api_endpoints as API_ENDPOINT,
  formUrl as URL,
} from "../../../api/api";
import axios from "axios";
import { getJwt, getCurrentUser } from "../../../services/LoginReg";
import { FaCamera } from "react-icons/fa";
import loadingAnim from "../../../animations/dataload.json";
import Lottie from "lottie-react";

class UserDetails extends Component {
  state = {
    user: {
      sub: "",
      fullname: "",
    },
    displayImage: null,
    image: null,
    errorMsg: null,
    loading: false,
  };

  componentDidMount() {
    this.setState({ user: getCurrentUser() });
    this.getProfileImage();
  }

  getProfileImage = async () => {
    const { id } = getCurrentUser();
    this.setState({ errorMsg: null, loading: true });
    await axios
      .get(`${URL(API_ENDPOINT.userOperations)}/profile-image/${id}`, {
        headers: {
          Authorization: getJwt(),
        },
      })
      .then(({ data }) => {
        let imgUrl = null;
        if (data) imgUrl = `data:${data.type};base64,${data.picByte}`;
        this.setState({ displayImage: imgUrl, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
        this.imageErrorCheck("Server error. Couldn't fetch the image");
      });
  };

  handleImageChange = (e) => {
    if (e.target.files[0]) {
      const { size, type } = e.target.files[0];
      if (this.imageValidation(size, type)) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            this.handleSubmit(reader, e.target.files[0]);
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    } else return;
  };

  imageValidation = (size, type) => {
    this.setState({ errorMsg: null });
    const allowedTypes = ["jpeg", "png", "jpg"];
    const allowedSize = 1000000;
    const imageType = type.split("/");
    if (!allowedTypes.includes(imageType[1])) {
      const errorMsg = "Should be .jpeg or .png";
      this.imageErrorCheck(errorMsg);
      return false;
    } else if (size >= allowedSize) {
      const errorMsg = "Should be less than 1mb";
      this.imageErrorCheck(errorMsg);
      return false;
    } else {
      return true;
    }
  };

  imageErrorCheck = (errorMsg) => {
    this.setState({ errorMsg });
    setTimeout(() => this.setState({ errorMsg: null }), 4000);
  };

  handleSubmit = async (reader, img) => {
    const { id } = getCurrentUser();
    const uploadImageData = new FormData();
    uploadImageData.append("file", img, img.name);
    this.setState({ errorMsg: null, loading: true });
    await axios
      .post(
        `${URL(API_ENDPOINT.userOperations)}/profile-image/${id}`,
        uploadImageData,
        {
          headers: {
            Authorization: getJwt(),
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        this.setState({
          displayImage: reader.result,
          image: img,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({ loading: false });
        this.imageErrorCheck("Upload failed. Server error occured");
      });
  };

  render() {
    const { displayImage, errorMsg, user, loading } = this.state;
    return (
      <div className="admin-settings-details-container">
        <div className="admin-settings-img-cont">
          <div className="admin-settings-img-cont-sub">
            <img src={!displayImage ? userDummy : displayImage} alt="user" />
            {loading && (
              <div>
                <Lottie animationData={loadingAnim} />
              </div>
            )}
          </div>
          <label className="admin-settings-image-logo">
            <input
              disabled={loading ? true : false}
              accept="image/*"
              type="file"
              onChange={this.handleImageChange}
              style={{ display: "none" }}
            />
            <FaCamera id="camera-logo" />
          </label>
        </div>
        <div>
          <h1>{user.fullname.toLowerCase()}</h1>
          <h2>{user.sub}</h2>
        </div>
        {errorMsg && <span>{errorMsg}</span>}
      </div>
    );
  }
}

export default UserDetails;
