import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHeart,
  FaStar,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./HorizontalScrollProducts.css";

const API_URL = import.meta.env.VITE_API_URL;

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.products)) return value.products;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

function HorizontalProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [viewLoadingId, setViewLoadingId] = useState(null);

  const listRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    "All",
    "Ebooks",
    "Courses",
    "Templates",
    "Software",
    "Graphics",
  ];

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const payload = asArray((await axios.get(`${API_URL}/api/digital-products/`)).data);
        setProducts(payload);
        setFiltered(payload);

        const sorted = [...payload].sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
        );
        setFeaturedProduct(sorted[0]);
      } catch {
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ================= FILTER ================= */
  const handleFilter = (category) => {
    setActiveCategory(category);
    const safeProducts = asArray(products);

    if (category === "All") {
      setFiltered(safeProducts);
    } else {
      setFiltered(
        safeProducts.filter((p) =>
          p.category?.toLowerCase().includes(category.toLowerCase())
        )
      );
    }
  };

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
      listRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
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

      setFiltered((prev) =>
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

      {/* FEATURED SMART PICK */}
      {featuredProduct && (
        <div className="featured-product">
          <div className="featured-content">
            <span className="featured-label">✨ Smart Pick For You</span>
            <h3>{featuredProduct.productName}</h3>
            <p>Top rated digital product this week</p>
            <button
              onClick={() =>
                navigate(`/ProductDetails/${featuredProduct._id}?type=digital`)
              }
            >
              Explore Now
            </button>
          </div>
          <img
            src={featuredProduct.image}
            alt={featuredProduct.productName}
          />
        </div>
      )}

      {/* FILTERS */}
      <div className="digital-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => handleFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton-wrapper">
          {[1,2,3,4].map((i)=>(
            <div key={i} className="skeleton-card">
              <div className="skeleton-img shimmer"/>
              <div className="skeleton-line shimmer"/>
              <div className="skeleton-line small shimmer"/>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <div className="product-scroll" ref={listRef}>
          {filtered.map((p) => (
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

                {p.averageRating >= 4.5 && (
                  <div className="hot-badge">🔥 Hot</div>
                )}

                {Math.random() > 0.7 && (
                  <div className="limited-badge">⚡ Limited</div>
                )}

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

      {/* RATING MODAL */}
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