import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Loader from "../Loader";
import toast from "../Toast";
import axios from "axios";
import { getJwt } from "../../services/LoginReg";
import { api_endpoints, formUrl as URL } from "../../api/api";

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
  productId,
  wishListed,
  toggleWishlist,
}) {
  const perform = async (type, setLoading) => {
    setLoading(true);
    switch (type) {
      case "CART":
        toast.success("Item addded to cart", { autoHideDuration: 2000 });
        return;
      case "WISH":
        await handleWishListOperation();
        setLoading(false);
        return;
      default:
        return;
    }
  };

  const handleWishListOperation = async () => {
    const opr = wishListed ? "REMOVE" : "ADD";
    await axios
      .post(
        `${URL(api_endpoints.userOperations)}/wishlist/${
          user.id
        }/${productId}?opr=${opr}`,
        null,
        {
          headers: {
            Authorization: getJwt(),
          },
        }
      )
      .then(() => {
        toast.info(
          `Item ${wishListed ? "removed from" : "added to"} wishlist`,
          { autoHideDuration: 2000 }
        );
        toggleWishlist();
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  return (
    <div className="product-operation-container">
      {operations.map((item, index) => (
        <ButtonWrapper
          user={user}
          perform={perform}
          type={item.type}
          key={index}
        >
          {item.type === "WISH" && wishListed ? item.alt : item.title}
        </ButtonWrapper>
      ))}
    </div>
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
