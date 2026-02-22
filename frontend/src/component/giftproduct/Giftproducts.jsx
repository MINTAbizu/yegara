import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaGift, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Gift.css";

const API_URL = import.meta.env.VITE_API_URL;

function Giftproducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOccasion, setActiveOccasion] = useState("All");

  const listRef = useRef(null);

  const occasions = ["All", "Birthday", "Wedding", "Anniversary", "Surprise"];

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/giftproduct/`);
        setProducts(res.data);
        setFiltered(res.data);
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

    if (occasion === "All") {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter((p) =>
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

  return (
    <section className="gift-section">

      {/* HERO */}
      <div className="gift-hero">
        <FaGift size={28} />
        <h2>Find the Perfect Gift for Every Occasion</h2>
        <p>Make someone smile today 🎁</p>
      </div>

      {/* FILTER CHIPS */}
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

      {/* LOADING */}
      {loading ? (
        <div className="gift-skeleton-wrapper">
          {[1,2,3,4].map((i)=>(
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

                  <Link to={`/giftProductDetails/${p._id}?type=digital`}>
                    <button className="gift-btn">
                      View Gift
                    </button>
                  </Link>
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