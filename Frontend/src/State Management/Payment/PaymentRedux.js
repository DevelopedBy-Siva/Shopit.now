import axios from "axios";
import * as service from "../../services/LoginReg";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";
import toast from "../../Components/Toast";

const initialState = {
  processStarted: false,
  orders: [],
  savedCard: null,
  success: false,
  paymentMode: "",
  fromWhere: "",
  paymentAddress: null,
  serverLoading: false,
  serverError: false,
  serverSuccess: false,
};

//Reducer

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PROCESS_BEGAN":
      return {
        ...state,
        processStarted: true,
        orders: [...action.payload.orders],
        fromWhere: action.payload.where,
      };
    case "PROCESS_DONE":
      return {
        ...state,
        processStarted: false,
        savedCard: null,
        orders: [],
        paymentMode: "",
        fromWhere: "",
        paymentAddress: null,
      };
    case "PROCESS_SAVED_CARD":
      return {
        ...state,
        savedCard: action.payload.card,
        paymentMode: action.payload.mode,
      };
    case "BILLING_ADDRESS":
      return {
        ...state,
        paymentAddress: action.payload,
      };
    case "END_SUCCESS":
      return {
        ...state,
        success: false,
        processStarted: false,
      };
    case "SUBMIT_TO_SERVER":
      return {
        ...state,
        serverLoading: true,
        serverError: false,
      };
    case "SUBMIT_TO_SERVER_SUCCESS":
      return {
        ...state,
        serverLoading: false,
        serverSuccess: true,
      };
    case "SUBMIT_TO_SERVER_ERROR":
      return {
        ...state,
        serverLoading: false,
        serverError: true,
      };
    case "ORDER_COMPLETED":
      return {
        ...state,
        savedCard: null,
        orders: [],
        success: true,
        paymentMode: "",
        fromWhere: "",
        paymentAddress: null,
      };
    default:
      return {
        ...state,
      };
  }
};

//Action Types

const paymentAction = (orders, where) => {
  return {
    type: "PROCESS_BEGAN",
    payload: {
      orders,
      where,
    },
  };
};

const paymentCardSave = (card, mode) => {
  return {
    type: "PROCESS_SAVED_CARD",
    payload: {
      card,
      mode,
    },
  };
};

const paymentClose = () => {
  return {
    type: "PROCESS_DONE",
  };
};

const orderCompleted = () => {
  return {
    type: "ORDER_COMPLETED",
  };
};

const billingAddress = (address) => {
  return {
    type: "BILLING_ADDRESS",
    payload: address,
  };
};

const endSuccess = () => {
  return {
    type: "END_SUCCESS",
  };
};

const serverSubmitBegan = () => {
  return {
    type: "SUBMIT_TO_SERVER",
  };
};

const serverSuccessfull = () => {
  return {
    type: "SUBMIT_TO_SERVER_SUCCESS",
  };
};

const serverErrorOccured = () => {
  return {
    type: "SUBMIT_TO_SERVER_ERROR",
  };
};

const submitDataToServer = (orders) => {
  return (dispatch) => {
    const { id } = service.getCurrentUser();
    dispatch(serverSubmitBegan());
    axios
      .post(`${URL(API_ENDPOINT.userOrders)}/${id}`, orders, {
        headers: {
          Authorization: service.getJwt(),
        },
      })
      .then(() => {
        dispatch(serverSuccessfull());
      })
      .catch(() => {
        dispatch(serverErrorOccured());
        toast.error("Something went wrong. Cannot process order");
      });
  };
};

export {
  paymentReducer,
  paymentAction,
  paymentClose,
  paymentCardSave,
  endSuccess,
  billingAddress,
  submitDataToServer,
  orderCompleted,
};
