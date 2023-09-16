import {
  ADD_TO_CART,
  INCREMENT_CART,
  DECREMENT_CART,
  REMOVE_FROM_CART,
  MOVE_TO_CART,
  CLEAR_CART_SERVER_ERROR,
  CLEAR_CART_SERVER_SUCCESS,
} from "./Actiontypes";

const addToCart = (data) => {
  return {
    type: ADD_TO_CART,
    payload: data,
  };
};

const incrementCart = (data) => {
  return {
    type: INCREMENT_CART,
    payload: data,
  };
};

const decrementCart = (data) => {
  return {
    type: DECREMENT_CART,
    payload: data,
  };
};

const removeFromCart = (id) => {
  return {
    type: REMOVE_FROM_CART,
    payload: id,
  };
};

const moveToCart = (data) => {
  return {
    type: MOVE_TO_CART,
    payload: data,
  };
};

const clearCartSuccess = () => {
  return {
    type: CLEAR_CART_SERVER_SUCCESS,
  };
};
const clearCartError = () => {
  return {
    type: CLEAR_CART_SERVER_ERROR,
  };
};

export {
  addToCart,
  incrementCart,
  decrementCart,
  removeFromCart,
  moveToCart,
  clearCartSuccess,
  clearCartError,
};
