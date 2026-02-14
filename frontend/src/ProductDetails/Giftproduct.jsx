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
  const [profiles, setProfiles] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [sellerStats, setSellerStats] = useState({
    totalProducts: 0,
    totalSold: 0,
  });

  /* ================= FETCH PROFILES ================= */
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/profile/approved`);
        setProfiles(res.data || []);
        console.log("profile",res.data)
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfiles();
  }, []);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let res;

        try {
          res = await axios.get(`${API_URL}/api/giftproduct/${id}`);
          console.log("res", res.data);
        } catch {
          res = await axios.get(`${API_URL}/api/physical-products/${id}`);
        }

        const data = res?.data;
        if (!data) return;

        console.log("product",res.data)

        setProduct(data);

        const sellerId = data?.seller?._id;

        /* Related products */
        if (sellerId) {
          try {
            const relatedRes = await axios.get(
              `${API_URL}/api/giftproduct/products/by-seller/${sellerId}`
            );

            setRelatedProducts(
              (relatedRes.data || []).filter(
                (p) => p?._id !== data?._id
              )
            );

            
          } catch {
            setRelatedProducts([]);
          }
        }
      } catch (err) {
        console.error("Product fetch error:", err);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  /* ================= SAFE SELLER ================= */
  const seller = product?.seller;

  const sellerProfile = profiles.find(
    (p) => p?.user?._id === seller?._id
  );

  /* ================= BUY ================= */
  const handleBuy = async () => {
    if (!seller?.chapaWallet) {
      alert("Seller wallet unavailable");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/payment/initiate`, {
        productId: product?._id,
        amount: product?.price,
        recipientWallet: seller.chapaWallet,
      });

      window.location.href = res.data.checkout_url;
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  /* ================= LOADING ================= */
  if (!product) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <RingLoader color="#4dabf7" size={80} />
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="container py-5">

      {/* SELLER HEADER */}
      {seller && (
        <div className="card shadow-sm mb-4 p-3 d-flex flex-row align-items-center gap-3">
          {sellerProfile?.profileImage ? (
            <img
              src={sellerProfile.profileImage}
              alt="seller"
              style={{ width: 60, height: 60, borderRadius: "50%" }}
            />
          ) : (
            <FaUserCircle size={60} className="text-secondary" />
          )}

          <div>
            <h6 className="mb-0">
              {sellerProfile?.fullName || seller?.name || "Seller"}
            </h6>

            <small className="text-muted">
              {sellerProfile?.profession || "Seller"}
            </small>
          </div>
        </div>
      )}

      {/* PRODUCT */}
      <div className="d-flex flex-wrap gap-4">

        <div style={{ flex: "1 1 48%", minWidth: "300px" }}>
          <div className="card shadow-sm h-100">

            <img
              src={product?.image}
              alt={product?.productName}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
              }}
            />

            <div className="card-body">

              <h3>{product?.productName}</h3>
              <p>{product?.description}</p>

              <p className="fw-bold text-success">
                {product?.price} ETB
              </p>

              <button
                className="btn btn-primary mt-3"
                onClick={handleBuy}
              >
                Buy Now
              </button>

              {seller && (
                <div className="card mt-3 shadow-sm p-2">
                  Uploaded by: {seller?.name || "Seller"}
                </div>
              )}

              {/* LINKS */}
              {product?.telegram && (
                <a href={product.telegram} target="_blank" rel="noreferrer">
                  Telegram
                </a>
              )}
              {product?.drive && (
                <a href={product.drive} target="_blank" rel="noreferrer">
                  Google Drive
                </a>
              )}
              {product?.dropbox && (
                <a href={product.dropbox} target="_blank" rel="noreferrer">
                  Dropbox
                </a>
              )}
              {product?.productLink && (
                <a href={product.productLink} target="_blank" rel="noreferrer">
                  Product Link
                </a>
              )}

            </div>
          </div>
        </div>

        {/* SELLER STATS */}
        <div style={{ flex: "1 1 48%", minWidth: "250px" }}>
          <div className="card shadow-sm p-3 text-center">
            Total Products: {sellerStats.totalProducts}
          </div>

          <div className="card shadow-sm p-3 text-center">
            Total Sold: {sellerStats.totalSold}
          </div>
        </div>

      </div>

      {/* RELATED */}
      {relatedProducts.length > 0 && (
        <div className="mt-5">
          <h4>More from this seller</h4>

          <div className="row g-3">
            {relatedProducts.map((p) => (
              <div key={p._id} className="col-md-3 col-sm-6">
                <div className="card shadow-sm">

                  <img
                    src={p?.image}
                    alt={p?.productName}
                    style={{ height: 150, objectFit: "cover" }}
                  />

                  <div className="card-body">
                    <h6>{p?.productName}</h6>

                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() =>
                        navigate(`/giftproduct/${p._id}`)
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

    </div>
  );
};

export default Giftproduct;
