import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

    // ✅ Strong password check
    if (!strongPasswordRegex.test(formData.password)) {
      setLoading(false);
      setMessage(
        "Password must contain: uppercase, lowercase, number, special character, minimum 8 characters."
      );
      return;
    }

    try {
      // Prepare payload
      let payload = { ...formData };

      // Add secret key if email is in admin list
      const adminEmails = ["admin@yegna.com", "super@yegna.com"];
      if (adminEmails.includes(formData.email)) {
        payload.secret = import.meta.env.VITE_ADMIN_SECRET_KEY;
        
      }

      await register(payload);

      // Redirect: admin goes to dashboard, others to recognition form
      if (adminEmails.includes(formData.email)) {
        navigate("/admin/dashboard");
      } else {
        navigate("/RecognitionForm");
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
