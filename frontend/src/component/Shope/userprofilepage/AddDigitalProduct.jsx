import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = import.meta.env.VITE_API_URL;

const AddDigitalProduct = () => {
  const [formData, setFormData] = useState({
    productName: "", price: "", description: "", image: null,
    telegram: "", drive: "", dropbox: "", productLink: ""
  });

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationDetails, setLocationDetails] = useState({
    region: "", subcity: "", woreda: "", kebele: "", display_name: ""
  });

  useEffect(() => {
    if (!navigator.geolocation) return console.warn("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLocation({ lat, lng });

      try {
        const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
          params: { lat, lon: lng, format: "json", addressdetails: 1 },
          headers: { "User-Agent": "digital-product-app" }
        });
        const addr = res.data.address || {};
        setLocationDetails({
          region: addr.state || addr.region || addr.city || addr.town || "",
          subcity: addr.city_district || addr.suburb || addr.quarter || "",
          woreda: addr.neighbourhood || addr.locality || addr.hamlet || "",
          kebele: addr.village || addr.croft || addr.kebele || "",
          display_name: res.data.display_name || ""
        });
      } catch (err) {
        console.warn("Reverse geocode failed:", err.message);
      }
    }, (err) => console.warn("Could not get location:", err.message));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setFormData(prev => ({ ...prev, [name]: files[0] }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);
    if (location.lat && location.lng) {
      data.append("lat", location.lat);
      data.append("lng", location.lng);
      Object.entries(locationDetails).forEach(([k, v]) => data.append(k, v));
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login required");

      await axios.post(`${API_URL}/api/digital-products/create`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });

      alert("Product added!");
      setFormData({ productName: "", price: "", description: "", image: null, telegram: "", drive: "", dropbox: "", productLink: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start py-5 bg-light min-vh-100">
      <div className="card shadow-sm p-4" style={{ width: "400px" }}>
        <h4 className="text-center mb-4">Add Digital Product</h4>
        <form onSubmit={handleSubmit}>
          <input type="text" name="productName" placeholder="Product Name" onChange={handleChange} className="form-control mb-2" required />
          <input type="number" name="price" placeholder="Price" onChange={handleChange} className="form-control mb-2" required />
          <textarea name="description" placeholder="Description" onChange={handleChange} className="form-control mb-2" required />
          <input type="file" name="image" onChange={handleChange} accept="image/*" className="form-control mb-2" required />
          <input type="text" name="telegram" placeholder="Telegram Link" onChange={handleChange} className="form-control mb-2" />
          <input type="text" name="drive" placeholder="Drive Link" onChange={handleChange} className="form-control mb-2" />
          <input type="text" name="dropbox" placeholder="Dropbox Link" onChange={handleChange} className="form-control mb-2" />
          <input type="url" name="productLink" placeholder="Product Link" onChange={handleChange} className="form-control mb-2" />

          {location.lat && location.lng && (
            <p className="text-muted small">
              Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          )}
          {(locationDetails.region || locationDetails.subcity || locationDetails.woreda || locationDetails.kebele) && (
            <p className="text-muted small">
              Region: {locationDetails.region} | Subcity: {locationDetails.subcity} | Woreda: {locationDetails.woreda} | Kebele: {locationDetails.kebele}
            </p>
          )}

          <button type="submit" className="btn btn-success w-100">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddDigitalProduct;
