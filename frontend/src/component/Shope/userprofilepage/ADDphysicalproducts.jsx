import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../../Context/Authcontext";

const API_URL = import.meta.env.VITE_API_URL;

const initialFormData = {
  productName: "",
  price: "",
  description: "",
  image: null,
  telegram: "",
  drive: "",
  productLink: "",
};

const ADDphysicalproducts = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first.");
      navigate("/login", { replace: true });
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) data.append(key, value);
    });

    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/physical-products/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Physical product added successfully. It will appear after admin approval.");
      setFormData(initialFormData);
      e.target.reset();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        logout?.();
        toast.error("Your session expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }

      toast.error(error.response?.data?.message || "Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start py-5 bg-light min-vh-100">
      <div className="card shadow-sm p-4" style={{ width: "400px" }}>
        <h4 className="card-title mb-4 text-center">Add Physical Product</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input type="text" name="productName" className="form-control" value={formData.productName} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} min="1" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Image</label>
            <input type="file" name="image" className="form-control" onChange={handleChange} accept="image/png, image/jpeg, image/webp" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Telegram Link</label>
            <input type="text" name="telegram" className="form-control" value={formData.telegram} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Google Drive Link</label>
            <input type="text" name="drive" className="form-control" value={formData.drive} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Product Link</label>
            <input type="url" name="productLink" className="form-control" value={formData.productLink} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ADDphysicalproducts;
