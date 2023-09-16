import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Loader from "../Loader";

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
  },
];

export default function ProductOperations({ user }) {
  const perform = (type, setLoading) => {
    setLoading(true);
    switch (type) {
      case "CART":
        return;
      case "WISH":
        return;
      default:
        return;
    }
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
          {item.title}
        </ButtonWrapper>
      ))}
    </div>
  );
}

function ButtonWrapper({ perform, user, type, children }) {
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  function isLoggedIn() {
    if (!user) return history.push("/login");
    perform(type, setLoading);
  }

  return (
    <button disabled={loading} onClick={isLoggedIn}>
      {loading ? (
        <Loader style={{ width: "18px", height: "18px" }} />
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}
