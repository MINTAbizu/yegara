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

  // ⭐ Rating modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const listRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/digital-products/`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // ⭐ Open rating modal
  const openRatingModal = (product) => {
    setSelectedProduct(product);
    setRating(0);
    setHoverRating(0);
    setShowModal(true);
  };

  // ⭐ Submit rating
  const submitRating = async () => {
    try {
      const token = localStorage.getItem("userToken");

      await axios.post(
        `${API_URL}/api/digital-products/${selectedProduct._id}/rate`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("⭐ Rating submitted!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating");
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

              {/* IMAGE + ICONS */}
              <div className="image-wrapper">
                <img src={p.image} alt={p.productName} />

                {/* ⭐ Rating badge */}
                <div
                  className="rating-badge"
                  onClick={() => openRatingModal(p)}
                >
                  <FaStar />
                  <span>{p.rating || 0}</span>
                </div>

                {/* ❤️ Favorite */}
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

      {/* ⭐⭐⭐⭐⭐ RATING MODAL */}
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
              <button
                disabled={rating === 0}
                onClick={submitRating}
              >
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
