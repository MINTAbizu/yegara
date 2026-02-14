import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { RingLoader } from "react-spinners";

const API_URL = import.meta.env.VITE_API_URL;

const Giftproduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [sellerStats, setSellerStats] = useState({
    totalProducts: 0,
    totalSold: 0,
  });

  // 🔹 NEW STATES
  const [profiles, setProfiles] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  /* ================= FETCH APPROVED PROFILES ================= */
  const fetchProfiles = async () => {
    try {
      setLoadingProfile(true);
      const res = await axios.get(`${API_URL}/api/profile/approved`);
      setProfiles(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  /* ================= FETCH PRODUCT (DIGITAL / PHYSICAL) ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let res;
        try {
          res = await axios.get(`${API_URL}/api/giftproduct/${id}`);
        } catch {
          res = await axios.get(`${API_URL}/api/physical-products/${id}`);
        }

        setProduct(res.data);

        // 🔹 Related products by same seller (if endpoint exists)
        if (res.data.seller?._id) {
          try {
            const relatedRes = await axios.get(
              `${API_URL}/api/giftproduct/products/by-seller/${res.data.seller._id}`
            );
            setRelatedProducts(
              relatedRes.data.filter((p) => p._id !== res.data._id)
            );
          } catch {
            setRelatedProducts([]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
     window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  /* ================= FIND SELLER PROFILE ================= */
  const sellerProfile = profiles.find(
    (p) => p.user?._id === product?.seller?._id
  );

  /* ================= BUY HANDLER ================= */
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

if (!product)
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "50vh" }}
    >
      <RingLoader color="#4dabf7" size={80} />
    </div>
  );

  return (
    <div className="container py-5">
      
      {/* ================= SELLER PROFILE HEADER (NEW) ================= */}
    {(sellerProfile || product.seller) && (
  <div className="card shadow-sm mb-4 p-3 d-flex flex-row align-items-center gap-3">
    {sellerProfile?.profileImage ? (
      <img
        src={sellerProfile.profileImage}
        alt={sellerProfile.fullName}
        style={{ width: 60, height: 60, borderRadius: "50%" }}
      />
    ) : (
      <FaUserCircle size={60} className="text-secondary" />
    )}

    <div>
      <h6 className="mb-0">
        {sellerProfile?.fullName || product.seller.name}
      </h6>
      <small className="text-muted">
        {sellerProfile?.profession || "Seller"}
      </small>
    </div>
  </div>
)}

      {/* ================= END NEW ================= */}

      {/* ================= ORIGINAL LAYOUT (UNCHANGED) ================= */}
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

              {/* Original Seller Info */}
              {product.seller && (
                <div className="card mt-3 shadow-sm p-2">
                  <h5>Uploaded by:</h5>
                  <p>Name: {product.seller.name}</p>
                </div>
              )}

              {/* Original Links */}
              {product.telegram && (
                <a
                  href={product.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="d-block mb-1"
                >
                  Telegram
                </a>
              )}
              {product.drive && (
                <a
                  href={product.drive}
                  target="_blank"
                  rel="noreferrer"
                  className="d-block mb-1"
                >
                  Google Drive
                </a>
              )}
              {product.dropbox && (
                <a
                  href={product.dropbox}
                  target="_blank"
                  rel="noreferrer"
                  className="d-block mb-1"
                >
                  Dropbox
                </a>
              )}
              {product.productLink && (
                <a
                  href={product.productLink}
                  target="_blank"
                  rel="noreferrer"
                  className="d-block"
                >
                  Product Link
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Seller Stats Cards (UNCHANGED) */}
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

      {/* ================= RELATED PRODUCTS (NEW) ================= */}
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

export default Giftproduct;
