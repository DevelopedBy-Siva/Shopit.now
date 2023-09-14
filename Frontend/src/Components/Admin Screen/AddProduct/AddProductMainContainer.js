import React, { Component } from "react";
import axios from "axios";
import {
  api_endpoints as API_ENDPOINT,
  formUrl as URL,
} from "../../../api/api";
import dummyImage from "../../../Images/camera.png";
import { getJwt } from "../../../services/LoginReg";
import toast from "../../Toast";

class AddProductMainContainer extends Component {
  constructor(props) {
    super(props);
    this.imageUploadError = React.createRef();
    this.logoError = React.createRef();
    this.helpError = React.createRef();
    this.goBackChange = React.createRef();
    this.helpChange = React.createRef();
    this.formRef = React.createRef();
  }

  state = {
    logoImage: dummyImage,
    thumbnail: null,
    productImage: dummyImage,
    allproductImages: [],
    loading: false,
    uploadNote: null,
    uploadFail: false,
    submitImages: [],
  };
  componentDidMount() {
    this.props.handleSelectedScreen("Add Product");
  }

  reinitialise = () => {
    this.setState({
      logoImage: dummyImage,
      thumbnail: null,
      productImage: dummyImage,
      allproductImages: [],
      loading: false,
      uploadNote: null,
      uploadFail: false,
      submitImages: [],
    });
  };

  handleLogoChange = (e) => {
    this.logoError.current.classList.remove("product-logo-error-visible");
    if (e.target.files[0]) {
      const { size, type } = e.target.files[0];
      if (this.imageValidation(size, type)) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            this.setState({
              logoImage: reader.result,
              thumbnail: e.target.files[0],
            });
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      } else {
        this.setState({ logoImage: dummyImage });
      }
    } else return;
  };

  imageValidation = (size, type) => {
    const allowedTypes = ["webp"];
    const allowedSize = 50 * 1024;
    const imageType = type.split("/");
    if (!allowedTypes.includes(imageType[1])) {
      toast.info("Image should be of type .webp");
      return false;
    } else if (size >= allowedSize) {
      toast.info("Image size should be less than 50kb");
      return false;
    }
    return true;
  };

  handleProductSubmit = (value, resetForm) => {
    const { allproductImages, logoImage } = this.state;
    if (!this.productImageCheck()) {
      this.logoError.current.classList.add("product-logo-error-visible");
    } else {
      this.logoError.current.classList.remove("product-logo-error-visible");
    }
    if (allproductImages.length === 4 && logoImage !== dummyImage) {
      this.setState({ loading: true });
      toast.promise(
        "Please wait... Adding product",
        toast.props.promise,
        true,
        false
      );
      this.uploadTheFile(value, resetForm);
    }
  };
  productImageCheck = () => {
    const { logoImage } = this.state;
    if (logoImage === dummyImage) {
      return false;
    }
    return true;
  };
  uploadTheFile = async (data, resetForm) => {
    const { thumbnail, submitImages } = this.state;
    const thumbnailImage = new FormData();
    thumbnailImage.append("thumbnailFile", thumbnail, thumbnail.name);
    const product = {
      title: data.title,
      price: data.price,
      category: data.category,
      description: data.description,
      inStock: 0,
      trending: false,
      productRatings: {
        overallRating: 0,
        usersReviews: [],
      },
    };
    const allimages = new FormData();
    if (submitImages && submitImages.length !== 4) toast.info("Pick 4 images");
    for (let i of submitImages) {
      allimages.append("imageFiles", i);
    }

    await axios
      .post(`${URL(API_ENDPOINT.productAddApi)}`, product, {
        headers: { Authorization: getJwt() },
      })
      .then(({ data }) => {
        this.sendThumbnailRequest(data, thumbnailImage, allimages, resetForm);
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
        toast.error("Sorry! Failed to add product");
      });
  };
  sendThumbnailRequest = async (id, thumbnailImage, allimages, resetForm) => {
    await axios
      .post(
        `${URL(API_ENDPOINT.productAddApi)}/thumbnail-image/${id}`,
        thumbnailImage,
        {
          headers: { Authorization: getJwt() },
        }
      )
      .then(() => {
        this.sendProductImagesRequest(id, allimages, resetForm);
      })
      .catch(() => {
        this.setState({ loading: false });
        toast.error("Sorry! Failed to add product");
      });
  };
  sendProductImagesRequest = async (id, allimages, resetForm) => {
    await axios
      .post(
        `${URL(API_ENDPOINT.productAddApi)}/product-images/${id}`,
        allimages,
        {
          headers: { Authorization: getJwt() },
        }
      )
      .then(() => {
        this.reinitialise();
        resetForm({
          values: "",
        });
        this.formRef.current.reset();
        toast.success("Product successfully added");
      })
      .catch(() => {
        this.setState({ loading: false });
        toast.error("Sorry! Failed to add product");
      });
  };

  handleHelp = () =>
    this.helpError.current.classList.toggle("help-container-details-visible");

  handleProductImages = (e) => {
    if (e.target.files.length) {
      const images = e.target.files;
      this.storeProductImages(images);
    } else return;
  };

  storeProductImages = (images) => {
    const { allproductImages } = this.state;
    const storedLen = allproductImages.length;
    const imgLen = images.length;
    let l = 0;
    if (imgLen >= 4) {
      l = 4 - storedLen;
    } else {
      if (imgLen + storedLen <= 4) {
        l = imgLen;
      } else l = imgLen - (imgLen + storedLen - 4) - 4;
    }
    for (let i = 0; i < l; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(images[i]);
      reader.onload = () => {
        if (reader.readyState === 2) {
          if (this.imageValidation(images[i].size, images[i].type)) {
            this.setState({
              allproductImages: [...this.state.allproductImages, reader.result],
              submitImages: [...this.state.submitImages, images[i]],
            });
          }
        }
      };
    }
  };

  removeProductImage = (position) => {
    const { allproductImages, submitImages } = this.state;
    const updateProductImages = allproductImages.filter(
      (i, index) => index !== position
    );
    const updateSubmitImages = submitImages.filter(
      (i, index) => index !== position
    );
    this.setState({
      allproductImages: updateProductImages,
      submitImages: updateSubmitImages,
    });
  };
}

export default AddProductMainContainer;
