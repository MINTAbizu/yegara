// HorizontalProductList.jsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './HorizontalScrollProducts.css';

const API_URL = import.meta.env.VITE_API_URL;

function HorizontalProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ added
  const listRef = useRef(null);

  useEffect(() => {
    setLoading(true); // ✅ start loading

    axios.get(`${API_URL}/api/digital-products/`)
      .then(res => {
        setProducts(res.data);
        setLoading(false); // ✅ stop loading
      })
      .catch(err => {
        console.log(err);
        setLoading(false); // ✅ stop loading even on error
      });
  }, []);

  return (
    <div className="horizontal-product-container">
      <h2 className='digitalproducttitle'>Physical Products</h2>

      {/* ✅ loading */}
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      <div className="horizontal-product-list" ref={listRef}>
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <img src={`${API_URL}${p.image}`} alt="" />

            <h5>{p.productName}</h5>
            <p className="price">{p.price} ETB</p>

            <p className="seller">Seller: {p.seller?.name}</p>

            <Link to={`/ProductDetails/${p._id}?type=digital`}>
              <button>View</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HorizontalProductList;

export default HorizontalProductList;
