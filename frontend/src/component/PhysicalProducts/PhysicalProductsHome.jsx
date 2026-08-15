import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const normalizeProducts = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.products)) return value.products;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

export default function PhysicalProductsHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/physical-products/`);
        setProducts(normalizeProducts(res.data));
      } catch (error) {
        console.error("Physical products fetch failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section style={{ padding: "32px 20px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>Physical Products</h2>
          <span style={{ color: "#64748b" }}>{products.length} items</span>
        </div>

        {loading ? (
          <p>Loading physical products...</p>
        ) : products.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, textAlign: "center", color: "#64748b" }}>
            No physical products available yet.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {products.map((product) => (
              <div key={product._id || product.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 30px rgba(15,23,42,0.06)" }}>
                <img
                  src={product.image || "https://dummyimage.com/600x400/eeeeee/111111.png&text=Physical+Product"}
                  alt={product.productName || "Physical Product"}
                  style={{ width: "100%", height: 200, objectFit: "cover" }}
                />
                <div style={{ padding: 16 }}>
                  <h4 style={{ margin: "0 0 8px" }}>{product.productName || "Untitled Product"}</h4>
                  <p style={{ margin: "0 0 8px", color: "#475569" }}>{product.description || "No description provided."}</p>
                  <strong style={{ color: "#2563eb", fontSize: 18 }}>{product.price || 0} ETB</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
