import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHeart, FaStar, FaSpinner, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./HorizontalScrollProducts.css";

const API_URL = import.meta.env.VITE_API_URL;

function HorizontalProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [viewLoadingId, setViewLoadingId] = useState(null);

  const listRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/digital-products/`);
        setProducts(res.data);
      } catch {
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ================= FAVORITES ================= */
  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  /* ================= SCROLL ================= */
  const scroll = (direction) => {
    if (listRef.current) {
      const scrollAmount = 300;
      listRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  /* ================= RATING ================= */
  const openRatingModal = (product) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate(`/register?redirect=${location.pathname}&rate=${product._id}`);
      return;
    }

    setSelectedProduct(product);
    setRating(0);
    setHoverRating(0);
    setShowModal(true);
  };

  const submitRating = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        `${API_URL}/api/digital-products/${selectedProduct._id}/rate`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === selectedProduct._id
            ? { ...p, averageRating: res.data.averageRating }
            : p
        )
      );

      setShowModal(false);
    } catch {
      alert("Failed to submit rating.");
    }
  };

  return (
    <div className="horizontal-container">

      <div className="section-header">
        <h2>Trending Digital Products</h2>
        <div className="scroll-buttons">
          <button onClick={() => scroll("left")}><FaChevronLeft /></button>
          <button onClick={() => scroll("right")}><FaChevronRight /></button>
        </div>
      </div>

      {loading ? (
        <div className="skeleton-wrapper">
          {[1,2,3,4].map((i)=>(
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <div className="product-scroll" ref={listRef}>
          {products.map((p) => (
            <div key={p._id} className="product-card">

              <div className="img-wrapper">
                <img
                  src={p.image || "https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image"}
                  alt={p.productName}
                />

                <div
                  className="rating-badge"
                  onClick={() => openRatingModal(p)}
                >
                  <FaStar />
                  {p.averageRating?.toFixed(1) || "0.0"}
                </div>

                <button
                  className="favorite"
                  onClick={() => toggleFavorite(p._id)}
                >
                  <FaHeart color={favorites.includes(p._id) ? "red" : "#fff"} />
                </button>
              </div>

              <div className="card-body">
                <h4>{p.productName}</h4>
                <p className="price">{p.price} ETB</p>

                <button
                  className="view-btn"
                  disabled={viewLoadingId === p._id}
                  onClick={() => {
                    setViewLoadingId(p._id);
                    setTimeout(() => {
                      navigate(`/ProductDetails/${p._id}?type=digital`);
                    }, 300);
                  }}
                >
                  {viewLoadingId === p._id ? (
                    <>
                      <FaSpinner className="spin" />
                      Opening...
                    </>
                  ) : (
                    "View Product"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ⭐ RATING MODAL (Improved but NOT removed) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Rate {selectedProduct?.productName}</h3>

            <div className="stars">
              {[1,2,3,4,5].map((star)=>(
                <FaStar
                  key={star}
                  size={32}
                  color={hoverRating >= star || rating >= star ? "#facc15" : "#d1d5db"}
                  onMouseEnter={()=>setHoverRating(star)}
                  onMouseLeave={()=>setHoverRating(0)}
                  onClick={()=>setRating(star)}
                />
              ))}
            </div>

            <div className="modal-actions">
              <button onClick={()=>setShowModal(false)}>Cancel</button>
              <button disabled={!rating} onClick={submitRating}>
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HorizontalProductList;