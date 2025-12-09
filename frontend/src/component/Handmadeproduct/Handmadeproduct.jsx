// HorizontalProductList.jsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './HorizontalScrollProducts.css';
const API_URL = import.meta.env.VITE_API_URL;

function HorizontalProductList() {
  const [products, setProducts] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/digital-products/`)
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

 //  useEffect(() => {
   //   const handleScroll = () => {
     //   const currentScroll = window.scrollY;
  
     //   if (!listRef.current) return;
  
    //    if (currentScroll > lastScroll) {
           // USER SCROLLING DOWN → MOVE RIGHT → LEFT
   //      listRef.current.scrollLeft -= 15;
  //     } else {
  //         // USER SCROLLING UP → MOVE LEFT → RIGHT
  //         listRef.current.scrollLeft += 15;
  //       }
  
  //       lastScroll = currentScroll;
  //     };
  
  //     window.addEventListener('scroll', handleScroll);
  
  //     return () => window.removeEventListener('scroll', handleScroll);
  //   }, []);

  return (
    <div className="horizontal-product-container">
      <h2 className='digitalproducttitle'>digital and human made Products</h2>

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
