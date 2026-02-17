// src/components/BuyerProducts.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const BuyerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async (lat, lng) => {
    try {
      const res = await axios.get(`${API_URL}/api/digital-products/nearby`, {
        params: { lat, lng, maxDistanceKm: 20 },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchProducts(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn(err);
          setError("Please enable location services");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading nearby products...</p>;
  if (error) return <p>{error}</p>;
  if (!products.length) return <p>No products near you</p>;

  return (
    <div className="container py-4">
      <h3>Products Near You</h3>
      <div className="row">
        {products.map((p) => (
          <div key={p._id} className="col-md-4 mb-3">
            <div className="card shadow-sm">
              {p.image && <img src={`${API_URL}/${p.image}`} className="card-img-top" alt={p.productName} />}
              <div className="card-body">
                <h5>{p.productName}</h5>
                <p>Price: {p.price} ETB</p>
                <p style={{ fontSize: "0.85rem", color: "#555" }}>
                  {p.region}, {p.subcity}, {p.wereda}, {p.kebele}
                </p>
                <a href={p.productLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                  View Product
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerProducts;
