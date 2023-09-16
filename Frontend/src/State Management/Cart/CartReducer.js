import axios from "axios";
import {
  FETCHDATA,
  FETCHSUCCESS,
  FETCHERROR,
  ADD_TO_CART,
  INCREMENT_CART,
  DECREMENT_CART,
  REMOVE_FROM_CART,
  MOVE_TO_CART,
  CLEAR_CART_SERVER_SUCCESS,
  CLEAR_CART_SERVER_ERROR,
} from "./Actiontypes";
import {
  addToCart,
  incrementCart,
  decrementCart,
  removeFromCart,
  clearCartSuccess,
  clearCartError,
} from "./CartActions";
import {
  submitToServer,
  serverError,
  serverSuccess,
} from "./ServerSubmitActions";
import * as services from "../../services/LoginReg";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";

const initialState = {
  loading: true,
  cart: [],
  error: false,
  cartRemoveSuccess: false,
  cartRemoveError: false,
};

const CartHandle = (state = initialState, action) => {
  const item = action.payload;

  switch (action.type) {
    //Cart Fetch

    case FETCHDATA:
      return {
        ...state,
        loading: true,
        error: false,
      };

    case FETCHSUCCESS:
      return {
        ...state,
        loading: false,
        cart: [...item],
      };

    case FETCHERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };

    //Cart Operations

    case ADD_TO_CART:
      const itemPresent = state.cart.some(
        (i) => i.productId === item.productId
      );
      if (itemPresent) {
        return { ...state, cart: [...addItemToUI(state.cart, item)] };
      } else return { ...state, cart: [...state.cart, item] };

    case INCREMENT_CART:
      return {
        ...state,
        cart: [...incrementCartUI(state.cart, item)],
      };

    case DECREMENT_CART:
      return {
        ...state,
        cart: [...decrementCartUI(state.cart, item)],
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: [...removeDataUI(state.cart, item)],
      };

    case MOVE_TO_CART:
      const saveItemPresent = state.cart.some(
        (i) => i.productId === item.productId
      );
      if (saveItemPresent) {
        return {
          ...state,
          cart: [...addBackToCart(state.cart, item)],
        };
      }
      return {
        ...state,
        cart: [...state.cart, item],
      };

    case CLEAR_CART_SERVER_ERROR:
      return {
        ...state,
        cartRemoveError: true,
      };

    case CLEAR_CART_SERVER_SUCCESS:
      return {
        ...state,
        cart: [],
        cartRemoveSuccess: true,
      };

    default:
      return state;
  }
};

const addItem = (item) => {
  const { productId, productName, totalPrice, itemCount } = item;
  const newItem = {
    productId,
    productName,
    totalPrice,
    itemCount,
    available: true,
  };
  const { id } = services.getCurrentUser();
  return (dispatch) => {
    dispatch(submitToServer());
    axios
      .post(`${URL(API_ENDPOINT.userCart)}/add/${id}`, newItem, {
        headers: { Authorization: services.getJwt() },
      })
      .then(() => {
        dispatch(addToCart(newItem));
        dispatch(serverSuccess());
      })
      .catch(() => {
        dispatch(serverError());
      });
  };
};
const incrementItem = (item) => {
  const { productId, productName, totalPrice, itemCount } = item;
  const { id } = services.getCurrentUser();
  return (dispatch) => {
    dispatch(submitToServer());
    axios
      .post(
        `${URL(
          API_ENDPOINT.userCart
        )}/increment/${id}/${productId}/${itemCount}`,
        null,
        {
          headers: {
            Authorization: services.getJwt(),
          },
        }
      )
      .then(({ data }) => {
        const newItem = {
          productId,
          productName,
          totalPrice,
          itemCount,
          available: data,
        };
        dispatch(incrementCart(newItem));
        dispatch(serverSuccess());
      })
      .catch(() => {
        dispatch(serverError());
      });
  };
};

const decrementItem = (item) => {
  const { productId, productName, totalPrice, itemCount } = item;
  const { id } = services.getCurrentUser();
  return (dispatch) => {
    dispatch(submitToServer());
    axios
      .post(
        `${URL(
          API_ENDPOINT.userCart
        )}/decrement/${id}/${productId}/${itemCount}`,
        null,
        {
          headers: {
            Authorization: services.getJwt(),
          },
        }
      )
      .then(({ data }) => {
        const newItem = {
          productId,
          productName,
          totalPrice,
          itemCount,
          available: data,
        };
        dispatch(decrementCart(newItem));
        dispatch(serverSuccess());
      })
      .catch(() => {
        dispatch(serverError());
      });
  };
};

const removeItem = (productId) => {
  const { id } = services.getCurrentUser();
  return (dispatch) => {
    dispatch(submitToServer());
    axios
      .delete(`${URL(API_ENDPOINT.userCart)}/remove/${id}/${productId}`, {
        headers: {
          Authorization: services.getJwt(),
        },
      })
      .then(() => {
        dispatch(removeFromCart(productId));
        dispatch(serverSuccess());
      })
      .catch(() => {
        dispatch(serverError());
      });
  };
};

const addItemToUI = (cart, item) => {
  const updated = cart.map((i) => {
    if (i.productId === item.productId) {
      const productPrice = parseInt(i.totalPrice) / i.itemCount;
      i.itemCount++;
      i.totalPrice = parseInt(i.totalPrice) + productPrice;
      return i;
    }
    return i;
  });
  return updated;
};

const addBackToCart = (cart, item) => {
  const updated = cart.map((i) => {
    if (i.productId === item.productId) {
      i.itemCount += item.itemCount;
      i.totalPrice = parseInt(i.totalPrice) + parseInt(item.totalPrice);
      return i;
    }
    return i;
  });
  return updated;
};

const removeDataUI = (cart, item) => {
  const updated = cart.filter((i) => i.productId !== item);
  return updated;
};

const decrementCartUI = (cart, item) => {
  const updated = cart.map((i) => {
    if (i.productId === item.productId) {
      const productPrice = parseInt(i.totalPrice) / i.itemCount;
      if (i.itemCount - 1 !== 0) {
        i.itemCount--;
        i.totalPrice = parseInt(i.totalPrice) - productPrice;
        i.available = item.available;
        return i;
      } else {
        i.itemCount = 0;
      }
    }
    return i;
  });
  const newCart = updated.filter((i) => i.itemCount !== 0);
  return newCart;
};
const incrementCartUI = (cart, item) => {
  const updated = cart.map((i) => {
    if (i.productId === item.productId) {
      const productPrice = parseInt(i.totalPrice) / i.itemCount;
      i.itemCount++;
      i.totalPrice = parseInt(i.totalPrice) + productPrice;
      i.available = item.available;
      return i;
    }
    return i;
  });
  return updated;
};

const clearCartServer = (where) => {
  const { id } = services.getCurrentUser();
  return (dispatch) => {
    axios
      .delete(`${URL(API_ENDPOINT.userCart)}/clear/${id}`, {
        headers: {
          Authorization: services.getJwt(),
        },
      })
      .then(() => {
        if (where === "CART") dispatch(clearCartSuccess());
      })
      .catch(() => {
        dispatch(clearCartError());
      });
  };
};

export {
  CartHandle,
  addItem,
  incrementItem,
  decrementItem,
  removeItem,
  clearCartServer,
};
