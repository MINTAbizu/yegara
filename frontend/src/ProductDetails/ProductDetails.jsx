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
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // 🔹 Try digital first
        let res;
        try {
          res = await axios.get(`${API_URL}/api/digital-products/${id}`);
        } catch {
          res = await axios.get(`${API_URL}/api/physical-products/${id}`);
        }

        setProduct(res.data);

        // 🔹 Seller stats
        if (res.data.seller?._id) {
          const statsRes = await axios.get(
            `${API_URL}/api/users/${res.data.seller._id}/stats`
          );
          setSellerStats(statsRes.data);

          // 🔹 Related products by seller
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

  if (!product) return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="container py-5">
      {/* ================= SELLER HEADER ================= */}
      {product.seller && (
        <div className="card shadow-sm p-3 mb-4 d-flex flex-row align-items-center gap-3">
          {product.seller.avatar ? (
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              style={{ width: 70, height: 70, borderRadius: "50%" }}
            />
          ) : (
            <FaUserCircle size={70} color="#adb5bd" />
          )}

          <div>
            <h5 className="mb-1">{product.seller.name}</h5>
            <small className="text-muted">
              {sellerStats.totalProducts} products · {sellerStats.totalSold} sold
            </small>
          </div>
        </div>
      )}

      {/* ================= PRODUCT DETAILS ================= */}
      <div className="card shadow-sm mb-5">
        <div style={{ height: 300, overflow: "hidden" }}>
          <img
            src={product.image}
            alt={product.productName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div className="card-body">
          <h3>{product.productName}</h3>
          <p>{product.description}</p>
          <p className="fw-bold text-success">{product.price} ETB</p>

          <button
            className="btn btn-primary"
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

          {/* Links */}
          <div className="mt-3">
            {product.telegram && (
              <a href={product.telegram} target="_blank" rel="noreferrer">
                Telegram
              </a>
            )}
            {product.drive && (
              <a href={product.drive} target="_blank" rel="noreferrer">
                Google Drive
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      {relatedProducts.length > 0 && (
        <>
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
                    <h6 className="mb-1">{p.productName}</h6>
                    <p className="text-success fw-bold">{p.price} ETB</p>
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
        </>
      )}
    </div>
  );
};

export default DigitalProductDetail;
