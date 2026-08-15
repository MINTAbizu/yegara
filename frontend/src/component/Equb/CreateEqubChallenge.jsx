import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../../kyc/DashboardLayout";
import RequireKycAndProfile from "../../ProtectedRoute/RequireKycAndProfile";

const API_URL = import.meta.env.VITE_API_URL;

const CreateEqubChallenge = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalSlots: "",
    slotPrice: "",
    expiresAt: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first.");
        navigate("/login");
        return;
      }

      const payload = {
        ...formData,
        totalSlots: Number(formData.totalSlots),
        slotPrice: Number(formData.slotPrice),
      };

      const res = await axios.post(`${API_URL}/api/equb/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Crowdfunded challenge created successfully.");
      setFormData({ title: "", description: "", totalSlots: "", slotPrice: "", expiresAt: "" });
      navigate("/listings");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to create challenge.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireKycAndProfile>
      <DashboardLayout>
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-9">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4 p-md-5">
                  <div className="mb-4">
                    <h3 className="fw-bold mb-1">Create Crowdfunded Product</h3>
                    <p className="text-muted mb-0">
                      Publish a verified seller Equb challenge after KYC approval.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Challenge title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Premium Laptop Equb Challenge"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the products or goal for this crowdfunding challenge..."
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Total slots</label>
                        <input
                          type="number"
                          className="form-control"
                          name="totalSlots"
                          min="1"
                          value={formData.totalSlots}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Slot price</label>
                        <input
                          type="number"
                          className="form-control"
                          name="slotPrice"
                          min="1"
                          value={formData.slotPrice}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Challenge expiry date</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="expiresAt"
                        value={formData.expiresAt}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                      {loading ? "Creating..." : "Create Crowdfunded Product"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireKycAndProfile>
  );
};

export default CreateEqubChallenge;
