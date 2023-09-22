import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import {
  Home,
  NotFound,
  Product,
  Cart,
  Account,
} from "../Refactor/AppContainerRefactor";
import Navbar from "../Components/Home/Navbar";
import ProtectedRoute from "../Components/Route/ProtectedRoute";
import Wishlist from "../Screens/Wishlist";
import OrderPlacedMsg from "../Components/Place Order/OrderPlacedMsg";
import Laptops from "../Screens/Category/Laptops";
import Fashion from "../Screens/Category/Fashion";
import Mobile from "../Screens/Category/Mobile";
import Appliances from "../Screens/Category/Appliances";
import KidsAndBaby from "../Screens/Category/KidsAndBaby";
import ProductSearch from "../Screens/ProductSearch";

class HomeContainer extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className="home-wrapper">
        <Navbar user={user} />
        <Switch>
          <Route
            path="/products/:item"
            render={(props) => <Product {...props} />}
          />
          <Route path="/laptops" component={Laptops} />
          <Route path="/kidsandbaby" component={KidsAndBaby} />
          <Route path="/appliances" component={Appliances} />
          <Route path="/mobiles" component={Mobile} />
          <Route path="/fashions" component={Fashion} />
          <Route path="/search/:query" component={ProductSearch} />
          <ProtectedRoute path="/cart" Component={Cart} />
          <ProtectedRoute path="/wishlist" Component={Wishlist} />
          <ProtectedRoute path="/order-placed" Component={OrderPlacedMsg} />
          <Route path="/account" component={Account} />
          <Route path="/not-found" component={NotFound} />
          <Route path="/" exact component={Home} />
          <Redirect to="/not-found" />
        </Switch>
      </div>
    );
  }
}

export default HomeContainer;
