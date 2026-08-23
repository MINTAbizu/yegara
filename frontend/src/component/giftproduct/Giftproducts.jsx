import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaGift,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaWifi,
  FaStore,
  FaShoppingCart,
  FaEye,
  FaSpinner,
  FaExclamationTriangle,
  FaBirthdayCake,
  FaHeart,
  FaGlassCheers,
  FaSmile,
  FaLayerGroup,
} from "react-icons/fa";
import "./Gift.css";

const API_URL = import.meta.env.VITE_API_URL;

const OCCASIONS = [
  { name: "All", icon: <FaLayerGroup /> },
  { name: "Birthday", icon: <FaBirthdayCake /> },
  { name: "Wedding", icon: <FaHeart /> },
  { name: "Anniversary", icon: <FaGlassCheers /> },
  { name: "Surprise", icon: <FaSmile /> },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.products)) return value.products;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

export default function Giftproducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOccasion, setActiveOccasion] = useState("All");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [addingId, setAddingId] = useState(null);

  const listRef = useRef(null);

  /* ================= NETWORK MONITORING ================= */
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        if (navigator.onLine) {
          const res = await axios.get(`${API_URL}/api/giftproduct/`, {
            signal: controller.signal,
          });
          const payload = normalizeArray(res.data);
          setProducts(payload);
          localStorage.setItem("cachedGifts", JSON.stringify(payload));
        } else {
          const cached = normalizeArray(
            JSON.parse(localStorage.getItem("cachedGifts") || "[]")
          );
          setProducts(cached);
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          const cached = normalizeArray(
            JSON.parse(localStorage.getItem("cachedGifts") || "[]")
          );
          setProducts(cached);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [isOnline]);

  /* ================= DERIVED FILTERED LIST ================= */
  const filteredProducts = useMemo(() => {
    if (activeOccasion === "All") return products;
    return products.filter((p) =>
      p.category?.toLowerCase().includes(activeOccasion.toLowerCase())
    );
  }, [products, activeOccasion]);

  /* ================= SCROLL CONTROLLER ================= */
  const handleScroll = useCallback((direction) => {
    if (!listRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    listRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }, []);

  /* ================= ADD TO CART ================= */
  const addToCart = useCallback((product) => {
    setAddingId(product._id);

    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const exists = cart.some((item) => item._id === product._id);

      if (!exists) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    } finally {
      setAddingId(null);
    }
  }, []);

  return (
    <section className="gift-section" aria-label="Gift Products Store">
      {!isOnline && (
        <div className="offline-banner" role="status">
          <FaWifi className="offline-icon" />
          <span>You are currently offline. Showing cached products.</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <header className="gift-hero">
        <div className="gift-hero-badge">
          <FaGift />
          <span>Curated Gift Store</span>
        </div>
        <h2>Find the Perfect Gift for Every Occasion</h2>
        <p>Make someone happy with thoughtful digital and physical gifts</p>
      </header>

      {/* CATEGORY NAV */}
      <nav className="gift-filters" aria-label="Filter by occasion">
        {OCCASIONS.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`filter-btn ${activeOccasion === item.name ? "active" : ""}`}
            onClick={() => setActiveOccasion(item.name)}
          >
            <span className="btn-icon">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* CONTENT AREA */}
      {loading ? (
        <div className="gift-skeleton-wrapper">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="gift-skeleton-card" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="gift-empty-state">
          <FaExclamationTriangle className="empty-icon" />
          <p>No gifts found for "{activeOccasion}".</p>
        </div>
      ) : (
        <div className="scroll-wrapper">
          <div className="scroll-actions">
            <button
              type="button"
              className="scroll-nav-btn"
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              className="scroll-nav-btn"
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="gift-scroll-container" ref={listRef}>
            {filteredProducts.map((p) => (
              <article key={p._id} className="gift-card">
                <div className="gift-image-wrapper">
                  <img
                    src={
                      p.image ||
                      "https://dummyimage.com/400x300/f1f5f9/475569.png&text=Gift+Product"
                    }
                    alt={p.productName}
                    loading="lazy"
                  />
                  <div className="gift-badge">
                    <FaStar />
                    <span>Top Pick</span>
                  </div>
                </div>

                <div className="gift-card-body">
                  <h3 className="product-title" title={p.productName}>
                    {p.productName}
                  </h3>
                  <div className="gift-price">{formatCurrency(p.price)}</div>

                  <div className="seller-info">
                    <FaStore className="store-icon" />
                    <span>Seller: {p.seller?.name || "Verified Store"}</span>
                  </div>

                  <div className="gift-actions">
                    <Link
                      to={`/giftProductDetails/${p._id}?type=digital`}
                      className="gift-btn primary-btn"
                    >
                      <FaEye />
                      <span>View</span>
                    </Link>

                    <button
                      type="button"
                      className="gift-btn secondary-btn"
                      disabled={addingId === p._id}
                      onClick={() => addToCart(p)}
                    >
                      {addingId === p._id ? (
                        <>
                          <FaSpinner className="spin-icon" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <FaShoppingCart />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}