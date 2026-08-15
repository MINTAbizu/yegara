import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaGift, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Gift.css";

const API_URL = import.meta.env.VITE_API_URL;

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.products)) return value.products;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

function Giftproducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOccasion, setActiveOccasion] = useState("All");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [addingId, setAddingId] = useState(null);

  const listRef = useRef(null);

  const occasions = ["All", "Birthday", "Wedding", "Anniversary", "Surprise"];

  /* ================= NETWORK STATUS ================= */
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
    const fetchData = async () => {
      try {
        if (navigator.onLine) {
          const res = await axios.get(`${API_URL}/api/giftproduct/`);
          const payload = asArray(res.data);
          setProducts(payload);
          setFiltered(payload);
          localStorage.setItem("cachedGifts", JSON.stringify(payload));
        } else {
          const cached = asArray(JSON.parse(localStorage.getItem("cachedGifts") || "[]"));
          if (cached.length > 0) {
            setProducts(cached);
            setFiltered(cached);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= FILTER ================= */
  const handleFilter = (occasion) => {
    setActiveOccasion(occasion);
    const safeProducts = asArray(products);

    if (occasion === "All") {
      setFiltered(safeProducts);
    } else {
      setFiltered(
        safeProducts.filter((p) =>
          p.category?.toLowerCase().includes(occasion.toLowerCase())
        )
      );
    }
  };

  /* ================= SCROLL ================= */
  const scroll = (dir) => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (product) => {
    setAddingId(product._id);

    // Simulate small delay (like real API)
    await new Promise((resolve) => setTimeout(resolve, 700));

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item._id === product._id);

    if (!exists) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    setAddingId(null);
  };

  return (
    <section className="gift-section">

      {!isOnline && (
        <div className="offline-banner">
          ⚠️ You are offline. Showing saved products.
        </div>
      )}

      {/* HERO */}
      <div className="gift-hero">
        <FaGift size={28} />
        <h2>Find the Perfect Gift for Every Occasion</h2>
        <p>Make someone smile today 🎁</p>
      </div>

      {/* FILTER */}
      <div className="gift-filters">
        {occasions.map((o) => (
          <button
            key={o}
            className={activeOccasion === o ? "active" : ""}
            onClick={() => handleFilter(o)}
          >
            {o}
          </button>
        ))}
      </div>

      {/* SKELETON LOADING */}
      {loading ? (
        <div className="gift-skeleton-wrapper">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="gift-skeleton-card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="gift-empty">
          No gifts found for this category.
        </div>
      ) : (
        <>
          <div className="gift-scroll-header">
            <button onClick={() => scroll("left")}>
              <FaChevronLeft />
            </button>
            <button onClick={() => scroll("right")}>
              <FaChevronRight />
            </button>
          </div>

          <div className="gift-scroll" ref={listRef}>
            {filtered.map((p) => (
              <div key={p._id} className="gift-card">

                <div className="gift-image-wrapper">
                  <img
                    src={
                      p.image ||
                      "https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image"
                    }
                    alt={p.productName}
                  />
                  <div className="gift-badge">
                    <FaStar size={12} /> Perfect Gift
                  </div>
                </div>

                <div className="gift-card-body">
                  <h4>{p.productName}</h4>
                  <p className="gift-price">{p.price} ETB</p>
                  <p className="gift-seller">
                    Trusted Seller: {p.seller?.name}
                  </p>

                  <div className="gift-actions">
                    <Link to={`/giftProductDetails/${p._id}?type=digital`}>
                      <button className="gift-btn primary">
                        View Gift
                      </button>
                    </Link>

                    <button
                      className="gift-btn secondary"
                      disabled={addingId === p._id}
                      onClick={() => addToCart(p)}
                    >
                      {addingId === p._id ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Giftproducts;