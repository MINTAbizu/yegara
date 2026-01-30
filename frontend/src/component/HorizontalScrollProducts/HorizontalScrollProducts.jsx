import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const DigitalProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch products
  useEffect(() => {
    axios
      .get(`${API_URL}/digital-products/approved`)
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, []);

  // Open rating modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setRating(0);
    setShowModal(true);
  };

  // Submit rating
  const submitRating = async () => {
    if (!rating) return alert("Select a rating");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/digital-products/${selectedProduct._id}/rate`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update product average rating locally
      setProducts((prev) =>
        prev.map((p) =>
          p._id === selectedProduct._id
            ? { ...p, averageRating: res.data.averageRating, ratings: p.ratings.concat([{ user: "you", value: rating }]) }
            : p
        )
      );

      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Rating failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Digital Products</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.map((p) => (
          <div key={p._id} style={{ width: "250px", border: "1px solid #ddd", borderRadius: "8px", padding: "10px" }}>
            <div style={{ position: "relative" }}>
              <img
                src={p.image}
                alt={p.productName}
                style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "6px" }}
              />
              {/* Rating badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "8px",
                  background: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                onClick={() => openModal(p)}
              >
                ⭐ {p.averageRating?.toFixed(1) || 0} ({p.ratings?.length || 0})
              </div>
            </div>
            <h4>{p.productName}</h4>
            <p>{p.price} ETB</p>
          </div>
        ))}
      </div>

      {/* ⭐ RATING MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "300px", textAlign: "center" }}>
            <h3>Rate {selectedProduct.productName}</h3>

            <div style={{ fontSize: "28px", margin: "15px 0" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    cursor: "pointer",
                    color: star <= rating ? "#ffc107" : "#ccc",
                  }}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <div>
              <button onClick={submitRating} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button onClick={() => setShowModal(false)} style={{ marginLeft: "10px" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalProductsPage;
