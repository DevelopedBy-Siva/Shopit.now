import { fetchCartData, error } from "./Cart/FetchActions";
import {
  addItem,
  incrementItem,
  decrementItem,
  removeItem,
  clearCartServer,
} from "./Cart/CartReducer";
import {
  fetchSaveForLater,
  removeFromSaveLaterServer,
  addToSaveLaterServer,
  addBackToCart,
} from "./SaveForLater/SaveForLaterReducer";
import {
  paymentAction,
  paymentClose,
  endSuccess,
  paymentCardSave,
  billingAddress,
  submitDataToServer,
  orderCompleted,
} from "./Payment/PaymentRedux";
import { getOrders } from "./Order/OrdersReducer";

const mapStateToProps = (state) => ({
  cartFetch: state.CartOperations,
  userCart: state.CartOperations.cart,
  saveLaterFetch: state.SaveLater,
  saveLater: state.SaveLater.items,

  //payment
  paymentBegan: state.paymentBegan,

  //Cart-Server
  cartServer: state.CartServer,
  saveLaterServer: state.SaveLaterServer,

  //Orders
  orders: state.AllOrders,

  //Wishlist
  wishlist: state.Wishlist,
});

const mapDispatchToProps = (dispatch) => {
  return {
    //Cart
    fetch: () => dispatch(fetchCartData()),
    cartErrorCheck: () => dispatch(error()),
    addItem: (data) => dispatch(addItem(data)),
    incrementitem: (data) => dispatch(incrementItem(data)),
    decrementitem: (data) => dispatch(decrementItem(data)),
    removeItem: (id) => dispatch(removeItem(id)),
    moveToCart: (data) => dispatch(addBackToCart(data)),
    clearCart: (where) => dispatch(clearCartServer(where)),

    //Save For Later
    fetchSaveLater: () => dispatch(fetchSaveForLater()),
    moveToSaveLater: (data) => dispatch(addToSaveLaterServer(data)),
    removeFromSaveLater: (id) => dispatch(removeFromSaveLaterServer(id)),

    //payment
    paymentStarted: (data, where) => dispatch(paymentAction(data, where)),
    paymentOver: () => dispatch(paymentClose()),
    paymentSuccessEnd: () => dispatch(endSuccess()),
    paymentMode: (card, mode) => dispatch(paymentCardSave(card, mode)),
    paymentAddress: (address) => dispatch(billingAddress(address)),
    submitOrders: (orders) => dispatch(submitDataToServer(orders)),
    orderCompleted: () => dispatch(orderCompleted()),

    //orders
    fetchOrders: () => dispatch(getOrders()),
  };
};

export { mapStateToProps, mapDispatchToProps };
