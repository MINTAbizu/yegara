import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hardcoded admin credentials
  const adminCredentials = {
    email: 'minte@gmail.com',
    password: 'Aa@123',
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Check if admin
      if (
        formData.email === adminCredentials.email &&
        formData.password === adminCredentials.password
      ) {
        // Admin login without backend
        localStorage.setItem('adminToken', 'fake-admin-token');
        setMessage('Admin login successful!');
        navigate('/AdminKYCList');
      } else {
        // Normal user login via backend
        const res = await axios.post(`${API_URL}/api/users/login`, formData);
        localStorage.setItem('token', res.data.token);
        setMessage(res.data.message || 'Login successful!');
        navigate('/RecognitionForm');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="card-title text-center mb-3">Login</h2>
        {message && (
          <div
            className={`alert ${
              message.includes('successful') ? 'alert-success' : 'alert-danger'
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
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
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
