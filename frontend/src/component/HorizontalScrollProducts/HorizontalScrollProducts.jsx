import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaHeart, FaStar } from "react-icons/fa";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const listRef = useRef(null);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  }, []);

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

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Open rating modal (for logged-in users)
  const openRatingModal = (product) => {
    if (!isLoggedIn) {
      alert("⚠ You must log in to rate this product.");
      navigate("/login");
      return;
    }

    setSelectedProduct(product);
    setRating(0);
    setHoverRating(0);
    setShowModal(true);
  };

  // Submit rating
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

      // Update product average rating locally
      setProducts((prev) =>
        prev.map((p) =>
          p._id === selectedProduct._id
            ? {
                ...p,
                averageRating: res.data.averageRating,
                ratings: [...(p.ratings || []), { user: "you", value: rating }],
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
                  title={
                    isLoggedIn
                      ? "Click to rate"
                      : "Log in to rate this product"
                  }
                  onClick={() => openRatingModal(p)}
                >
                  <FaStar color="#ffc107" />
                  <span>{p.averageRating?.toFixed(1) || 0}</span>
                </div>

                {/* ❤️ Favorite icon */}
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
                  title={`${star} Star${star > 1 ? "s" : ""}`}
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
