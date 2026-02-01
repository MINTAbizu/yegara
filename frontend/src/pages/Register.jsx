import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/Authcontext";
import { FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Strong password regex (accepts ANY special character)
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!strongPasswordRegex.test(formData.password)) {
      toast.warning(
        "Password must include uppercase, lowercase, number, special character, and be at least 8 characters."
      );
      return;
    }

    setLoading(true);

    try {
      let payload = { ...formData };

      const adminEmails = [
        "aminteadminsseesss12@yegna.com",
        "superadminss1112@yegna.com",
        "aminteadminsseesss123@yegna.com",
        "aminteadminsseesss124@yegna.com",
        "aminteadminsseesss1233@yegna.com",
      ];

      if (adminEmails.includes(formData.email)) {
        payload.secret = import.meta.env.VITE_ADMIN_SECRET_KEY;
      }

      await register(payload);

      // 🎉 Success popup
      toast.success("Registration successful! 🎉");

      // Handle redirect logic
      const searchParams = new URLSearchParams(location.search);
      const redirectTo = searchParams.get("redirect");
      const rateProductId = searchParams.get("rate");

      setTimeout(() => {
        if (redirectTo) {
          let url = redirectTo;
          if (rateProductId) url += `?rate=${rateProductId}`;
          navigate(url, { replace: true });
        } else {
          if (adminEmails.includes(formData.email)) {
            navigate("/AdminKYCList");
          } else {
            navigate("/RecognitionForm");
          }
        }
      }, 1200); // let user see toast before redirect
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="card-title text-center mb-3">Register</h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
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

          {/* Email */}
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

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <small className="text-muted">
              Must include uppercase, lowercase, number, special character, min
              8 characters.
            </small>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Registering...
              </>
            ) : (
              <>
                <FaUserPlus />
                Register
              </>
            )}
          </button>

          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
