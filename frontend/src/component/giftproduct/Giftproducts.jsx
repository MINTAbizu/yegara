import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import './HorizontalScrollProducts.css';

const API_URL = import.meta.env.VITE_API_URL;

function Giftproducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="horizontal-product-container">
      <h2 className="digitalproducttitle">Gift Products</h2>

      {/* 🔥 Spinner */}
      {loading ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px"
        }}>
          <ClipLoader
            color="#4dabf7"
            loading={loading}
            size={60}
            speedMultiplier={1.2}
          />
        </div>
      ) : (
        <div className="horizontal-product-list" ref={listRef}>
          {products.map((p) => (
            console.log("IMAGE URL:", p.image),
            console.log("IMAGE URL:"),

            <div key={p._id} className="product-card">
              

              <img src={p.image} alt={p.productName} />
              {/* <img src={products.image} alt={products.productName} /> */}


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
    </div>
  );
}

export default Giftproducts;
