import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios  from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const AddBook = () => {
  const [formData, setFormData] = useState({
    bookName: "",
    price: "",
    description: "",
    image: null,
    bookFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
     const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    try {
       const token = localStorage.getItem("token"); // JWT from login
      if (!token) {
        alert("You must be logged in to add a product");
        return;
      }
       const res = await axios.post(
        `${API_URL}/api/books/create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
       alert("Book submitted successfully. Admin approval is required before it appears in the marketplace.");
      setFormData({
         bookName: "",
    price: "",
    description: "",
    image: null,
    bookFile: null,
      });
      
    } catch (error) {
       console.error(error);
      alert(error.response?.data?.message || "Error adding Book!");
      
    }

  };

  return (
    <div className="d-flex justify-content-center align-items-start py-5 bg-light min-vh-100">
      <div className="card shadow-sm p-4" style={{ width: "400px" }}>
        <h4 className="card-title mb-4 text-center">Add Book</h4>
        <form onSubmit={handleSubmit}>
          {/* Book Name */}
          <div className="mb-3">
            <label className="form-label">Book Name</label>
            <input
              type="text"
              name="bookName"
              className="form-control"
              value={formData.bookName}
              onChange={handleChange}
              placeholder="e.g. Taking Smart Notes (Ebook)"
              required
            />
          </div>

          {/* Price */}
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price in ETB"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Describe the Book</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Introduce your book here"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-3">
            <label className="form-label">
              Image (Square, 600x600px min, JPG/PNG)
            </label>
            <input
              type="file"
              name="image"
              accept="image/png, image/jpeg"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          {/* Book File Upload */}
          <div className="mb-3">
            <label className="form-label">Upload Book (&lt; 10 MB)</label>
            <input
              type="file"
              name="bookFile"
              accept=".pdf,.epub,.mobi"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
