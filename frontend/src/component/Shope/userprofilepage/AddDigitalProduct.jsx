import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = import.meta.env.VITE_API_URL;

const AddDigitalProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    description: "",
    image: null,
    telegram: "",
    drive: "",
    dropbox: "",
    productLink: "",
  });

  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [locationName, setLocationName] = useState({
    region: "",
    subcity: "",
    woreda: "",
  });

  // ================= GET USER LOCATION =================
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        try {
          // ================= REVERSE GEOCODING =================
          const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
            params: {
              lat: latitude,
              lon: longitude,
              format: "json",
              addressdetails: 1,
            },
            headers: {
              "User-Agent": "digital-product-app", // Required by Nominatim
            },
          });

          const address = res.data.address;
          setLocationName({
            region: address.city || address.town || address.village || "",
            subcity: address.suburb || address.city_district || "",
            woreda: address.neighbourhood || address.hamlet || "",
          });
        } catch (err) {
          console.warn("Reverse geocoding failed:", err.message);
        }
      },
      (error) => {
        console.warn("Could not get location:", error.message);
      }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    // append coordinates
    if (coords.lat && coords.lng) {
      data.append("lat", coords.lat);
      data.append("lng", coords.lng);
    }

    // append reverse geocoded location info
    data.append("region", locationName.region);
    data.append("subcity", locationName.subcity);
    data.append("woreda", locationName.woreda);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to add a product");
        return;
      }

      await axios.post(`${API_URL}/api/digital-products/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Digital Product Added Successfully!");
      setFormData({
        productName: "",
        price: "",
        description: "",
        image: null,
        telegram: "",
        drive: "",
        dropbox: "",
        productLink: "",
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error adding product!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start py-5 bg-light min-vh-100">
      <div className="card shadow-sm p-4" style={{ width: "400px" }}>
        <h4 className="card-title mb-4 text-center">Add Digital Product</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            onChange={handleChange}
            required
            className="form-control mb-2"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            required
            className="form-control mb-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
            className="form-control mb-2"
          />
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            required
            className="form-control mb-2"
          />
          <input
            type="text"
            name="telegram"
            placeholder="Telegram Link"
            onChange={handleChange}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="drive"
            placeholder="Drive Link"
            onChange={handleChange}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="dropbox"
            placeholder="Dropbox Link"
            onChange={handleChange}
            className="form-control mb-2"
          />
          <input
            type="url"
            name="productLink"
            placeholder="Product Link"
            onChange={handleChange}
            className="form-control mb-2"
          />

          {coords.lat && coords.lng && (
            <p className="text-muted small mb-2">
              Current location: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </p>
          )}
          {(locationName.region || locationName.subcity || locationName.woreda) && (
            <p className="text-muted small mb-2">
              Detected region: {locationName.region} | Subcity: {locationName.subcity} | Woreda: {locationName.woreda}
            </p>
          )}

          <button type="submit" className="btn btn-success w-100">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDigitalProduct;
