import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHeart,
  FaStar,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCheckCircle,
  FaBook,
  FaGraduationCap,
  FaThLarge,
  FaCode,
  FaPaintBrush,
  FaLayerGroup,
  FaUserCircle,
} from "react-icons/fa";
import "./HorizontalScrollProducts.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const CATEGORIES = [
  { name: "All", icon: <FaLayerGroup /> },
  { name: "Ebooks", icon: <FaBook /> },
  { name: "Courses", icon: <FaGraduationCap /> },
  { name: "Templates", icon: <FaThLarge /> },
  { name: "Software", icon: <FaCode /> },
  { name: "Graphics", icon: <FaPaintBrush /> },
];

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-ET", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0);

const normalizeData = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.products)) return value.products;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

export default function HorizontalProductList() {
  const [products, setProducts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch {
      return [];
    }
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const listRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= FETCH PRODUCTS & PROFILES ================= */
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsRes, profilesRes] = await Promise.allSettled([
          axios.get(`${API_URL}/api/digital-products/`, { signal: controller.signal }),
          axios.get(`${API_URL}/api/profile/approved`, { signal: controller.signal }),
        ]);

        if (productsRes.status === "fulfilled") {
          setProducts(normalizeData(productsRes.value.data));
        } else if (!axios.isCancel(productsRes.reason)) {
          setError("Failed to load products. Please try again.");
        }

        if (profilesRes.status === "fulfilled") {
          setProfiles(profilesRes.value.data || []);
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Failed to load marketplace data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  /* ================= PROFILE MAP FOR O(1) LOOKUP ================= */
  const profileMap = useMemo(() => {
    const map = new Map();
    profiles.forEach((profile) => {
      const userId = profile.user?._id || profile.user;
      if (userId) {
        map.set(userId.toString(), profile);
      }
    });
    return map;
  }, [profiles]);

  /* ================= FILTERED PRODUCTS ================= */
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) =>
      p.category?.toLowerCase().includes(activeCategory.toLowerCase())
    );
  }, [products, activeCategory]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleScroll = (direction) => {
    if (!listRef.current) return;
    const scrollAmount = direction === "left" ? -320 : 320;
    listRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const openRatingModal = (product) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate(`/register?redirect=${encodeURIComponent(location.pathname)}&rate=${product._id}`);
      return;
    }
    setSelectedProduct(product);
    setRating(0);
    setHoverRating(0);
  };

  const handleRatingSubmit = async () => {
    if (!rating || !selectedProduct) return;
    setIsSubmittingRating(true);
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        `${API_URL}/api/digital-products/${selectedProduct._id}/rate`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedRating = res.data.averageRating;
      const updatedNumReviews = res.data.numReviews;

      setProducts((prev) =>
        prev.map((p) =>
          p._id === selectedProduct._id
            ? {
                ...p,
                averageRating: updatedRating,
                numReviews: updatedNumReviews ?? (p.numReviews || 0) + 1,
              }
            : p
        )
      );
      setSelectedProduct(null);
    } catch {
      alert("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  return (
    <section className="designer-marketplace-section">
      {/* Category Pills Header */}
      <div className="filter-pill-container">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            className={`designer-pill ${activeCategory === cat.name ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.name)}
          >
            <span className="pill-icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Cards Scroll Container */}
      {loading ? (
        <div className="designer-scroll-grid skeleton-wrapper">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="designer-skeleton-card shimmer" />
          ))}
        </div>
      ) : error ? (
        <div className="designer-error-state">
          <p>{error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="designer-empty-state">
          <p>No products available under "{activeCategory}".</p>
        </div>
      ) : (
        <div className="designer-scroll-grid" ref={listRef}>
          {filteredProducts.map((p) => {
            const isFav = favorites.includes(p._id);

            // Dynamic Seller Profile Resolution
            const sellerId = p.seller?._id || p.seller || p.user?._id || p.user;
            const sellerProfile = sellerId ? profileMap.get(sellerId.toString()) : null;

            const sellerName =
              sellerProfile?.fullName ||
              p.sellerName ||
              p.seller?.name ||
              p.seller?.username ||
              "Verified Seller";

            const sellerAvatar =
              sellerProfile?.profileImage ||
              p.seller?.profileImage ||
              p.seller?.avatar;

            const reviewCount = p.numReviews ?? p.reviews?.length ?? 0;
            const productDescription = p.description || "No description provided for this product.";

            return (
              <div key={p._id} className="designer-card">
                <div className="designer-media">
                  <img
                    src={p.image || "https://dummyimage.com/400x300/e2e8f0/64748b&text=No+Image"}
                    alt={p.productName}
                    loading="lazy"
                  />

                  {/* Rating Tag */}
                  <div className="rating-tag" onClick={() => openRatingModal(p)}>
                    <FaStar className="star-gold" />
                    <span>{p.averageRating ? Number(p.averageRating).toFixed(1) : "0.0"}</span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    className={`favorite-circle-btn ${isFav ? "active" : ""}`}
                    onClick={() => toggleFavorite(p._id)}
                    aria-label="Add to favorites"
                  >
                    <FaHeart />
                  </button>
                </div>

                <div className="designer-card-body">
                  <h3 className="designer-title" title={p.productName}>
                    {p.productName}
                  </h3>

                  <div className="designer-price">
                    {formatCurrency(p.price)} <span className="currency-unit">ETB</span>
                  </div>

                  {/* Dynamic Description */}
                  <p className="designer-description" title={productDescription}>
                    {productDescription}
                  </p>

                  {/* Dynamic User Reviews */}
                  <p className="designer-reviews">
                    User reviews: {reviewCount}
                  </p>

                  <button
                    className="designer-explore-btn"
                    onClick={() => navigate(`/ProductDetails/${p._id}?type=digital`)}
                  >
                    EXPLORE
                  </button>

                  <div className="designer-footer">
                    {/* Dynamic Reviewer Avatar Stack */}
                    <div className="avatar-stack">
                      {reviewCount > 0 ? (
                        <>
                          <img src={`https://i.pravatar.cc/40?u=${p._id}-1`} alt="reviewer" />
                          {reviewCount > 1 && <img src={`https://i.pravatar.cc/40?u=${p._id}-2`} alt="reviewer" />}
                          {reviewCount > 2 && <img src={`https://i.pravatar.cc/40?u=${p._id}-3`} alt="reviewer" />}
                          {reviewCount > 3 && (
                            <span className="avatar-count">+{reviewCount - 3}</span>
                          )}
                        </>
                      ) : (
                        <span className="avatar-count flex-avatar">New</span>
                      )}
                    </div>

                    {/* Dynamic Seller Badge */}
                    <div className="seller-badge">
                      {sellerAvatar ? (
                        <img src={sellerAvatar} alt={sellerName} className="seller-avatar-img" />
                      ) : (
                        <FaUserCircle className="seller-avatar-icon" />
                      )}
                      <div className="seller-info-text">
                        <span className="seller-name">{sellerName}</span>
                      </div>
                      <FaCheckCircle className="verified-icon" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Nav Controls */}
      <div className="scroll-controls-bar">
        <button className="nav-arrow" onClick={() => handleScroll("left")} aria-label="Scroll left">
          <FaChevronLeft />
        </button>
        <div className="scroll-track-line">
          <div className="scroll-track-thumb" />
        </div>
        <button className="nav-arrow" onClick={() => handleScroll("right")} aria-label="Scroll right">
          <FaChevronRight />
        </button>
      </div>

      {/* Rating Modal */}
      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProduct(null)}>
              <FaTimes />
            </button>
            <h3>Rate "{selectedProduct.productName}"</h3>

            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`star-choice ${star <= (hoverRating || rating) ? "active" : ""}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setSelectedProduct(null)}>
                Cancel
              </button>
              <button
                className="submit-btn"
                disabled={!rating || isSubmittingRating}
                onClick={handleRatingSubmit}
              >
                {isSubmittingRating ? <FaSpinner className="spin" /> : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}