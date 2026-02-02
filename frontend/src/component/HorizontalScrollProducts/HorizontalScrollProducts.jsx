import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaHeart, FaStar, FaSpinner } from "react-icons/fa";
import "./HorizontalScrollProducts.css";

const API_URL = import.meta.env.VITE_API_URL;

function HorizontalProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [viewLoadingId, setViewLoadingId] = useState(null); // ✅ VIEW BUTTON LOADER

  const listRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch products
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

  // ⭐ Auto-open rating modal after login redirect
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const rateProductId = searchParams.get("rate");

    if (rateProductId && products.length > 0) {
      const token = localStorage.getItem("userToken");
      if (token) {
        const product = products.find((p) => p._id === rateProductId);
        if (product) {
          openRatingModal(product);

          searchParams.delete("rate");
          navigate(
            { pathname: location.pathname, search: searchParams.toString() },
            { replace: true }
          );
        }
      }
    }
  }, [location.search, products]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const openRatingModal = (product) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate(
        `/register?redirect=${encodeURIComponent(
          location.pathname
        )}&rate=${product._id}`
      );
      return;
    }

    setSelectedProduct(product);
    setRating(0);
    setHoverRating(0);
    setShowModal(true);
  };

  const submitRating = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("⚠ You must log in to submit a rating.");
      setShowModal(false);
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/digital-products/${selectedProduct._id}/rate`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("⭐ Rating submitted!");

      setProducts((prev) =>
        prev.map((p) =>
          p._id === selectedProduct._id
            ? {
                ...p,
                averageRating: res.data.averageRating,
                ratings: [...(p.ratings || []), { value: rating }],
              }
            : p
        )
      );

      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit rating");
    }
  };

  return (
    <div className="horizontal-product-container">
      <h2 className="digitalproducttitle">Digital Products</h2>

      {loading ? (
        <div className="spinner-center">
          <ClipLoader color="#4dabf7" size={60} />
        </div>
      ) : (
        <div className="horizontal-product-list" ref={listRef}>
          {products.map((p) => (
            <div key={p._id} className="product-card">
              <div className="image-wrapper">
                <img
                  src={
                    p.image ||
                    "https://dummyimage.com/400x200/cccccc/000000.png&text=No+Image"
                  }
                  alt={p.productName}
                />

                {/* ⭐ Rating badge */}
                <div
                  className="rating-badge"
                  title="Click to rate"
                  onClick={() => openRatingModal(p)}
                >
                  <FaStar color="#ffc107" />
                  <span>{p.averageRating?.toFixed(1) || 0}</span>
                </div>

                {/* ❤️ Favorite */}
                <FaHeart
                  className="favorite-icon"
                  color={favorites.includes(p._id) ? "red" : "#fff"}
                  onClick={() => toggleFavorite(p._id)}
                />
              </div>

              <h5>{p.productName}</h5>
              <p className="price">{p.price} .00 ETB</p>

              {/* ✅ VIEW BUTTON WITH LOADER */}
              <button
                className="btn btn-primary mt-2"
                disabled={viewLoadingId === p._id}
                onClick={() => {
                  setViewLoadingId(p._id);
                  setTimeout(() => {
                    navigate(`/ProductDetails/${p._id}?type=digital`);
                  }, 300);
                }}
              >
                {viewLoadingId === p._id ? (
                  <span className="view-loading">
                    <FaSpinner className="spin" />
                    Opening…
                  </span>
                ) : (
                  "View"
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ⭐ Rating Modal */}
      {showModal && (
        <div className="rating-modal-overlay">
          <div className="rating-modal">
            <h4>Rate {selectedProduct?.productName}</h4>

            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={30}
                  color={
                    hoverRating >= star || rating >= star
                      ? "#facc15"
                      : "#d1d5db"
                  }
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button disabled={rating === 0} onClick={submitRating}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HorizontalProductList;
