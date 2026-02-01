import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/Authcontext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const strongPasswordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!strongPasswordRegex.test(formData.password)) {
      setLoading(false);
      setMessage(
        "Password must contain: uppercase, lowercase, number, special character, minimum 8 characters."
      );
      return;
    }

    try {
      let payload = { ...formData };

      const adminEmails = ["aminteadminsseesss12@yegna.com", "superadminss1112@yegna.com",
        "aminteadminsseesss123@yegna.com","aminteadminsseesss124@yegna.com"];
      if (adminEmails.includes(formData.email)) {
        payload.secret = import.meta.env.VITE_ADMIN_SECRET_KEY;
      }

      await register(payload);

      // ⭐ Check for redirect query param
      const searchParams = new URLSearchParams(location.search);
      const redirectTo = searchParams.get("redirect");
      const rateProductId = searchParams.get("rate"); // optional: open rating modal

      if (redirectTo) {
        // Redirect back to the product page after registration
        let url = redirectTo;
        if (rateProductId) url += `?rate=${rateProductId}`;
        navigate(url, { replace: true });
      } else {
        // Normal behavior
        if (adminEmails.includes(formData.email)) {
          navigate("/AdminKYCList");
        } else {
          navigate("/RecognitionForm");
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed!");
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="card-title text-center mb-3">Register</h2>
        {message && <div className="alert alert-danger">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
              required
            />
            <small className="text-muted">
              Must include uppercase, lowercase, number, special character, min 8 characters.
            </small>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-3">
            Already have an account? <Link to={"/login"}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
