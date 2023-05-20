import { enqueueSnackbar, closeSnackbar } from "notistack";

import ToastContainer from "./ToastContainer";

const toastBg = {
  error: "#FF2B20",
  success: "#2d9d41",
  info: "#3C90AB",
};

const notify = (key, message, props = {}) => {
  enqueueSnackbar(<ToastContainer type={key} message={message} />, {
    autoHideDuration: 5000,
    style: {
      background: toastBg[key],
      width: "fit-content",
      minWidth: "0",
      maxWidth: "280px",
      borderRadius: "5px",
    },
    anchorOrigin: {
      vertical: "top",
      horizontal: "right",
    },
    ...props,
  });
};

const remove = () => {
  closeSnackbar();
};

const toastProps = {
  persist: {
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    },
    persist: true,
  },
  cart: {
    anchorOrigin: {
      vertical: "top",
      horizontal: "right",
    },
  },
};

const toExpose = {
  success: (message, props) => notify("success", message, props),
  error: (message, props) => notify("error", message, props),
  info: (message, props) => notify("info", message, props),
  remove: () => remove(),
  props: toastProps,
};

export default toExpose;
