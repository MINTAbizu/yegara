import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const DigitalProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [sellerStats, setSellerStats] = useState({
    totalProducts: 0,
    totalSold: 0,
  });

  // 🔹 NEW
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // digital
        let res;
        try {
          res = await axios.get(`${API_URL}/api/digital-products/${id}`);
        } catch {
          // physical fallback
          res = await axios.get(`${API_URL}/api/physical-products/${id}`);
        }

        setProduct(res.data);

        if (res.data.seller?._id) {
          // seller stats (existing)
          const statsRes = await axios.get(
            `${API_URL}/api/users/${res.data.seller._id}/stats`
          );
          setSellerStats(statsRes.data);

          // 🔹 NEW: related products
          const relatedRes = await axios.get(
            `${API_URL}/api/products/by-seller/${res.data.seller._id}`
          );

          setRelatedProducts(
            relatedRes.data.filter((p) => p._id !== res.data._id)
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuy = async (productId, amount, recipientWallet) => {
    try {
      const res = await axios.post(`${API_URL}/api/payment/initiate`, {
        productId,
        amount,
        recipientWallet,
      });
      window.location.href = res.data.checkout_url;
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container py-5">

      {/* ================= NEW: SELLER HEADER ================= */}
      {product.seller && (
        <div className="card shadow-sm mb-4 p-3 d-flex align-items-center flex-row gap-3">
          {product.seller.avatar ? (
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              style={{ width: 60, height: 60, borderRadius: "50%" }}
            />
          ) : (
            <FaUserCircle size={60} className="text-secondary" />
          )}

          <div>
            <h6 className="mb-0">{product.seller.name}</h6>
            <small className="text-muted">
              {sellerStats.totalProducts} products · {sellerStats.totalSold} sold
            </small>
          </div>
        </div>
      )}
      {/* ================= END NEW ================= */}

      {/* ======== YOUR ORIGINAL LAYOUT (UNCHANGED) ======== */}
      <div
        className="d-flex flex-wrap gap-4"
        style={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        {/* Product Detail Card */}
        <div style={{ flex: "1 1 48%", minWidth: "300px" }}>
          <div className="card shadow-sm h-100">
            <div style={{ width: "100%", height: "300px", overflow: "hidden" }}>
              <img
                src={product.image}
                alt={product.productName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div className="card-body">
              <h3 className="card-title">{product.productName}</h3>
              <p>{product.description}</p>
              <p className="fw-bold text-success">{product.price} ETB</p>

              <button
                className="btn btn-primary mt-3"
                onClick={() =>
                  handleBuy(
                    product._id,
                    product.price,
                    product.seller?.chapaWallet
                  )
                }
              >
                Buy Now
              </button>

              {product.seller && (
                <div className="card mt-3 shadow-sm p-2">
                  <h5>Uploaded by:</h5>
                  <p>Name: {product.seller.name}</p>
                </div>
              )}

              {product.telegram && (
                <a href={product.telegram} target="_blank" rel="noreferrer">
                  Telegram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Seller Stats */}
        <div
          style={{
            flex: "1 1 48%",
            minWidth: "250px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div className="card shadow-sm p-3 text-center">
            <h5>Total Products</h5>
            <p className="fw-bold">{sellerStats.totalProducts}</p>
          </div>
          <div className="card shadow-sm p-3 text-center">
            <h5>Total Sold</h5>
            <p className="fw-bold">{sellerStats.totalSold}</p>
          </div>
        </div>
      </div>

      {/* ================= NEW: RELATED PRODUCTS ================= */}
      {relatedProducts.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3">More from this seller</h4>

          <div className="row g-3">
            {relatedProducts.map((p) => (
              <div key={p._id} className="col-md-3 col-sm-6">
                <div className="card h-100 shadow-sm">
                  <img
                    src={p.image}
                    alt={p.productName}
                    style={{ height: 150, objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6>{p.productName}</h6>
                    <p className="fw-bold text-success">{p.price} ETB</p>
                    <button
                      className="btn btn-sm btn-outline-primary w-100"
                      onClick={() =>
                        navigate(`/ProductDetails/${p._id}`)
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ================= END NEW ================= */}
    </div>
  );
};

export default DigitalProductDetail;
