import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaHeart, FaStar } from "react-icons/fa";
import "./HorizontalScrollProducts.css";

const API_URL = import.meta.env.VITE_API_URL;

function HorizontalProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/digital-products/`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="horizontal-product-container">
      <h2 className="digitalproducttitle">Digital Products</h2>

      {/* 🔥 Spinner */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <ClipLoader color="#4dabf7" size={60} />
        </div>
      ) : (
        <div className="horizontal-product-list" ref={listRef}>
          {products.map((p) => (
            <div key={p._id} className="product-card">
              
              {/* 🖼️ IMAGE + ICON OVERLAY */}
              <div className="image-wrapper">
                <img src={p.image} alt={p.productName} />

                {/* ⭐ Rating (bottom-left) */}
                <div className="rating-badge">
                  <FaStar />
                  <span>{p.rating || 0}</span>
                </div>

                {/* ❤️ Favorite (bottom-right) */}
                <FaHeart
                  className="favorite-icon"
                  color={favorites.includes(p._id) ? "red" : "#fff"}
                  onClick={() => toggleFavorite(p._id)}
                />
              </div>

              <h5>{p.productName}</h5>
              <p className="price">{p.price} ETB</p>
              <p className="seller">Seller: {p.seller?.name}</p>

              <Link to={`/ProductDetails/${p._id}?type=digital`}>
                <button className="btn btn-primary mt-2">View</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HorizontalProductList;
