import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import toast from "../Toast";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getJwt } from "../../services/LoginReg";
import { api_endpoints, formUrl as URL } from "../../api/api";
import Loader from "../Loader";
import { addToCart } from "../../State Management/Cart/CartActions";

const operations = [
  {
    type: "CART",
    title: "Add to Cart",
  },
  {
    type: "BUY",
    title: "Buy Now",
  },
  {
    type: "WISH",
    title: "Add to Wishlist",
    alt: "Remove from Wishlist",
  },
];

export default function ProductOperations({
  user,
  product,
  toggleWishlist,
  handleOutOfStock,
}) {
  const userCart = useSelector((state) => state.CartOperations);
  const { cart } = userCart;
  const dispatch = useDispatch();

  const perform = async (type, setLoading) => {
    setLoading(true);
    switch (type) {
      case "CART":
        await handleAddToCart();
        setLoading(false);
        return;
      case "WISH":
        await handleWishListOperation();
        setLoading(false);
        return;
      default:
        return;
    }
  };

  const handleAddToCart = async () => {
    const cartItem = {
      productId: product.id,
      productName: product.title,
      totalPrice: product.price,
      itemCount: 1,
    };
    return await axios
      .post(`${URL(api_endpoints.userCart)}/add/${user.id}`, cartItem, {
        headers: {
          Authorization: getJwt(),
        },
      })
      .then(({ status }) => {
        dispatch(addToCart({ ...cartItem, available: true }));
        if (status === 204) handleOutOfStock();
        toast.success("Item addded to cart", { autoHideDuration: 2000 });
      })
      .catch((error) => {
        const status = error && error.response && error.response.status;
        if (status === 406) {
          handleOutOfStock();
          return;
        }
        toast.error("Something went wrong");
      });
  };

  const handleWishListOperation = async () => {
    const opr = product.wishListed ? "REMOVE" : "ADD";
    return await axios
      .post(
        `${URL(api_endpoints.userOperations)}/wishlist/${user.id}/${
          product.id
        }?opr=${opr}`,
        null,
        {
          headers: {
            Authorization: getJwt(),
          },
        }
      )
      .then(() => {
        toast.info(
          `Item ${product.wishListed ? "removed from" : "added to"} wishlist`,
          { autoHideDuration: 2000 }
        );
        toggleWishlist();
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const isStockAvailable = () => {
    let count = 0;
    cart.forEach((item) => {
      if (item.productId === product.id) count = item.itemCount;
    });
    return product.inStock > count ? true : false;
  };

  return (
    <>
      {!isStockAvailable() && <h6 className="out-of-stock">Out of Stock</h6>}
      <div className="product-operation-container">
        {operations.map((item, index) => {
          if (!isStockAvailable() && item.type !== "WISH") return "";
          return (
            <ButtonWrapper
              user={user}
              perform={perform}
              type={item.type}
              key={index}
            >
              {item.type === "WISH" && product.wishListed
                ? item.alt
                : item.title}
            </ButtonWrapper>
          );
        })}
      </div>
    </>
  );
}

function ButtonWrapper({ perform, user, type, children }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  function isLoggedIn() {
    if (!user) return history.push("/login", { redirect: history.location });
    perform(type, setLoading);
  }

  return (
    <button disabled={loading} onClick={isLoggedIn}>
      {loading ? (
        <Loader
          style={{
            width: "18px",
            height: "18px",
          }}
        />
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}
