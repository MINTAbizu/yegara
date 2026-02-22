// src/components/BuyerProducts.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaStar, FaHeart, FaCheckCircle, FaTruck } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const BuyerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [locationStatus, setLocationStatus] = useState("Detecting your location...");

  // Fetch products nearby
  const fetchProducts = async (lat, lng) => {
    try {
      setLocationStatus("Finding products near you...");
      const res = await axios.get(`${API_URL}/api/digital-products/nearby`, {
        params: { lat, lng, maxDistanceKm: 20 },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch nearby products");
    } finally {
      setLoading(false);
    }
  };

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchProducts(pos.coords.latitude, pos.coords.longitude),
      () => {
        setError("Please enable location access");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x250?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_URL}/${imagePath.replace(/^\/+/, "")}`;
  };

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) setWishlist(wishlist.filter((i) => i !== id));
    else setWishlist([...wishlist, id]);
  };

  const retryLocation = () => window.location.reload();

  if (loading) return <LoadingSkeleton message={locationStatus} />;
  if (error) return <ErrorState message={error} retry={retryLocation} />;
  if (!products.length) return <EmptyState />;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2>📍 Products Near You</h2>
        <p>Discover amazing digital & physical products nearby</p>
      </div>

      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p._id} style={styles.card}>
            {/* Wishlist */}
            <div onClick={() => toggleWishlist(p._id)} style={styles.wishlist}>
              <FaHeart size={20} color={wishlist.includes(p._id) ? "red" : "#ccc"} />
            </div>

            {/* Hot/New badge */}
            {p.isNew && <div style={styles.badge}>New</div>}
            {p.discount && <div style={styles.discountBadge}>{p.discount}% OFF</div>}

            <img
              src={getImageUrl(p.image)}
              alt={p.productName}
              loading="lazy"
              style={styles.image}
              onError={(e) => (e.target.src = "https://via.placeholder.com/400x250?text=No+Image")}
            />

            <div style={styles.cardBody}>
              <h5>{p.productName}</h5>
              {p.description && <p style={styles.description}>{p.description.slice(0, 70)}...</p>}

              {/* Rating */}
              <div style={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={14} color={i < Math.floor(p.rating || 4) ? "#fbc02d" : "#ddd"} />
                ))}
                <span style={{ fontSize: 12, color: "#555", marginLeft: 4 }}>
                  ({p.reviewsCount || 0})
                </span>
              </div>

              {/* Price */}
              <div style={styles.price}>
                <strong>{p.price} ETB</strong>
                {p.oldPrice && <span style={styles.oldPrice}>{p.oldPrice} ETB</span>}
              </div>

              {/* Location */}
              <div style={styles.location}>
                <FaMapMarkerAlt style={{ marginRight: 4 }} />
                {p.region || "-"}, {p.subcity || "-"}
              </div>

              {/* Seller & Delivery */}
              <div style={styles.seller}>
                Seller: {p.seller?.name || "-"} <FaCheckCircle color="green" />
                {p.delivery && <FaTruck style={{ marginLeft: 6, color: "#2563eb" }} />}
              </div>

              <a href={p.productLink || "#"} target="_blank" rel="noreferrer" style={styles.button}>
                View Product
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Skeleton Loading ---------- */
const LoadingSkeleton = ({ message }) => (
  <div style={styles.center}>
    <div style={styles.loader}></div>
    <p style={{ marginTop: 15 }}>{message}</p>
  </div>
);

const ErrorState = ({ message, retry }) => (
  <div style={styles.center}>
    <h4>{message}</h4>
    <button style={styles.retryBtn} onClick={retry}>Retry</button>
  </div>
);

const EmptyState = () => (
  <div style={styles.center}>
    <h3>No products near you yet</h3>
    <p>Be the first to post something nearby!</p>
  </div>
);

/* ---------- Styles ---------- */
const styles = {
  wrapper: {
    padding: "40px 20px",
    background: "linear-gradient(135deg,#f8fafc,#eef2ff)",
    minHeight: "100vh",
  },
  header: { textAlign: "center", marginBottom: 30 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },
  cardBody: { padding: 15, display: "flex", flexDirection: "column" },
  image: { width: "100%", height: 200, objectFit: "cover" },
  wishlist: { position: "absolute", top: 12, right: 12, cursor: "pointer", zIndex: 5 },
  badge: { position: "absolute", top: 12, left: 12, background: "#ff4757", color: "#fff", padding: "4px 8px", fontSize: 12, borderRadius: 6 },
  discountBadge: { position: "absolute", top: 12, left: 12, background: "#2563eb", color: "#fff", padding: "4px 8px", fontSize: 12, borderRadius: 6 },
  description: { fontSize: 13, color: "#555", marginBottom: 6 },
  rating: { display: "flex", alignItems: "center", marginBottom: 6 },
  price: { fontWeight: "bold", color: "#2563eb", marginBottom: 6 },
  oldPrice: { textDecoration: "line-through", color: "#999", marginLeft: 6 },
  location: { fontSize: 12, color: "#555", marginBottom: 6, display: "flex", alignItems: "center" },
  seller: { fontSize: 12, color: "#555", marginBottom: 10, display: "flex", alignItems: "center" },
  button: { background: "#2563eb", color: "#fff", textAlign: "center", padding: 10, borderRadius: 8, fontWeight: 600, textDecoration: "none", marginTop: "auto" },
  center: { textAlign: "center", padding: 60 },
  retryBtn: { marginTop: 15, padding: "10px 16px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer" },
  loader: { width: 40, height: 40, border: "4px solid #ddd", borderTop: "4px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" },
};

export default BuyerProducts;