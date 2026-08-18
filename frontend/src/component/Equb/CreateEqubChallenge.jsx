import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../../kyc/DashboardLayout";
import RequireKycAndProfile from "../../ProtectedRoute/RequireKycAndProfile";

const API_URL = import.meta.env.VITE_API_URL;

const initialFormData = {
  title: "",
  description: "",
  fundingType: "FLEXIBLE",
  productId: "",
  productName: "",
  productPrice: "",
  productImage: "",
  totalSlots: "",
  slotPrice: "",
  expiresAt: "",
};

const CreateEqubChallenge = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const isProductLocked = formData.fundingType === "PRODUCT_LOCKED";
  const projectedPool = Number(formData.totalSlots || 0) * Number(formData.slotPrice || 0);

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
        productPrice: formData.productPrice ? Number(formData.productPrice) : undefined,
      };

      if (!isProductLocked) {
        payload.productId = undefined;
        payload.productName = undefined;
        payload.productPrice = undefined;
        payload.productImage = undefined;
      }

      const res = await axios.post(`${API_URL}/api/equb/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Crowdfunded challenge created successfully.");
      setFormData(initialFormData);
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
            <div className="col-lg-8 col-md-10">
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body p-4 p-md-5">
                  <div className="mb-4">
                    <h3 className="fw-bold mb-1">Create Crowdfunding Round</h3>
                    <p className="text-muted mb-0">
                      Choose open crowdfunding for flexible winner purchases, or crowdfunding billing for one specific product.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Funding mode</label>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className={`border rounded-3 p-3 h-100 d-block ${!isProductLocked ? "border-primary bg-primary-subtle" : ""}`}>
                            <input type="radio" name="fundingType" value="FLEXIBLE" checked={!isProductLocked} onChange={handleChange} className="form-check-input me-2" />
                            <strong>Crowdfunding</strong>
                            <small className="d-block text-muted mt-1">Winner can buy any eligible product after the round closes.</small>
                          </label>
                        </div>
                        <div className="col-md-6">
                          <label className={`border rounded-3 p-3 h-100 d-block ${isProductLocked ? "border-primary bg-primary-subtle" : ""}`}>
                            <input type="radio" name="fundingType" value="PRODUCT_LOCKED" checked={isProductLocked} onChange={handleChange} className="form-check-input me-2" />
                            <strong>Crowdfunding Billing</strong>
                            <small className="d-block text-muted mt-1">Winner checkout is locked to a specific product.</small>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Challenge title</label>
                      <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} placeholder="Premium Laptop Equb Challenge" required />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" rows="4" name="description" value={formData.description} onChange={handleChange} placeholder="Describe the goal, rules, product, and winner checkout promise..." required />
                    </div>

                    {isProductLocked && (
                      <div className="border rounded-3 p-3 mb-3 bg-light">
                        <h6 className="fw-bold mb-3">Specific product billing</h6>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Product name</label>
                            <input type="text" className="form-control" name="productName" value={formData.productName} onChange={handleChange} placeholder="MacBook Pro M3" required={isProductLocked} />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Product price</label>
                            <input type="number" className="form-control" name="productPrice" min="1" value={formData.productPrice} onChange={handleChange} required={isProductLocked} />
                          </div>
                          <div className="col-12 mb-1">
                            <label className="form-label">Existing product ID or image URL</label>
                            <div className="row g-2">
                              <div className="col-md-6"><input type="text" className="form-control" name="productId" value={formData.productId} onChange={handleChange} placeholder="Optional approved product ID" /></div>
                              <div className="col-md-6"><input type="url" className="form-control" name="productImage" value={formData.productImage} onChange={handleChange} placeholder="Optional product image URL" /></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Total slots</label>
                        <input type="number" className="form-control" name="totalSlots" min="1" value={formData.totalSlots} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Slot price</label>
                        <input type="number" className="form-control" name="slotPrice" min="1" value={formData.slotPrice} onChange={handleChange} required />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between rounded-3 bg-light p-3 mb-3">
                      <span className="text-muted">Projected funding pool</span>
                      <strong>{projectedPool.toLocaleString()} ETB</strong>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Challenge expiry date</label>
                      <input type="datetime-local" className="form-control" name="expiresAt" value={formData.expiresAt} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                      {loading ? "Creating..." : "Create Crowdfunding Round"}
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
