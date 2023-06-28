import { enqueueSnackbar, closeSnackbar } from "notistack";

import ToastContainer from "./ToastContainer";

const toastBg = {
  error: "#FF2B20",
  success: "#2d9d41",
  info: "#3C90AB",
  other: "#343434",
};

const notify = (key, message, props = {}, wait = false, allowClose = true) => {
  enqueueSnackbar(
    <ToastContainer
      type={key}
      message={message}
      allowClose={allowClose}
      wait={wait}
    />,
    {
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
    }
  );
};

const remove = (key) => {
  closeSnackbar(key);
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
  promise: {
    anchorOrigin: {
      vertical: "top",
      horizontal: "right",
    },
    persist: true,
  },
};

const toExpose = {
  success: (message, props) => notify("success", message, props),
  error: (message, props) => notify("error", message, props),
  info: (message, props) => notify("info", message, props),
  promise: (message, props, wait, allowClose) =>
    notify("other", message, props, wait, allowClose),
  remove: (key = undefined) => remove(key),
  props: toastProps,
};

export default toExpose;
