import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../../kyc/DashboardLayout";
import { useAuth } from "../../Context/Authcontext";

const API_URL = import.meta.env.VITE_API_URL;

const initialFormData = {
  title: "",
  description: "",
  fundingType: "PRODUCT_LOCKED",
  productId: "",
  productType: "physical",
  totalSlots: "",
  slotPrice: "",
  expiresAt: "",
};

const CreateEqubChallenge = ({ embedded = false }) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === "admin";
  const canUseBilling = Boolean(user?.kycSubmitted || user?.profileApproved || ["seller", "pro", "admin"].includes(user?.role));
  const [formData, setFormData] = useState(() => ({
    ...initialFormData,
    fundingType: isAdmin ? "FLEXIBLE" : "PRODUCT_LOCKED",
  }));
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const isProductLocked = formData.fundingType === "PRODUCT_LOCKED";
  const selectedProduct = products.find((product) => product.productId === formData.productId);
  const projectedPool = Number(formData.totalSlots || 0) * Number(formData.slotPrice || 0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/equb/billing-products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Unable to load approved products.");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      setFormData((prev) => ({ ...prev, fundingType: "PRODUCT_LOCKED" }));
    }
  }, [authLoading, isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFundingTypeChange = (e) => {
    const fundingType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      fundingType,
      productId: fundingType === "PRODUCT_LOCKED" ? prev.productId : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isProductLocked && !formData.productId) {
      toast.error("Please select the product for crowdfunding billing.");
      return;
    }

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
        productId: isProductLocked ? formData.productId : undefined,
        productType: isProductLocked ? formData.productType : undefined,
        totalSlots: Number(formData.totalSlots),
        slotPrice: Number(formData.slotPrice),
      };

      const res = await axios.post(`${API_URL}/api/equb/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Crowdfunded challenge created successfully.");
      setFormData(initialFormData);
      navigate(isAdmin ? "/AdminCrowdfunding" : "/listings");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to create challenge.");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body p-4 p-md-5">
                  <div className="mb-4">
                    <h3 className="fw-bold mb-1">Create Crowdfunding Round</h3>
                    <p className="text-muted mb-0">
                      Choose open crowdfunding, or lock the winner checkout to one approved marketplace product.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Funding mode</label>
                      <div className="row g-3">
                        {isAdmin && (
                          <div className="col-md-6">
                            <label className={`border rounded-3 p-3 h-100 d-block ${!isProductLocked ? "border-primary bg-primary-subtle" : ""}`}>
                              <input type="radio" name="fundingType" value="FLEXIBLE" checked={!isProductLocked} onChange={handleFundingTypeChange} className="form-check-input me-2" />
                              <strong>Crowdfunding</strong>
                              <small className="d-block text-muted mt-1">Owner/admin controlled campaign. Winner can use marketplace credit after settlement.</small>
                            </label>
                          </div>
                        )}
                        <div className={isAdmin ? "col-md-6" : "col-12"}>
                          <label className={`border rounded-3 p-3 h-100 d-block ${isProductLocked ? "border-primary bg-primary-subtle" : ""}`}>
                            <input type="radio" name="fundingType" value="PRODUCT_LOCKED" checked={isProductLocked} onChange={handleFundingTypeChange} className="form-check-input me-2" />
                            <strong>Crowdfunding Billing</strong>
                            <small className="d-block text-muted mt-1">Approved sellers can lock the winner checkout to one approved product.</small>
                          </label>
                        </div>
                      </div>
                      {!isAdmin && <small className="text-muted d-block mt-2">General crowdfunding is managed by the platform owner. Sellers can use crowdfunding billing for approved products.</small>}
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
                        {!canUseBilling && (
                          <div className="alert alert-warning">
                            Complete KYC/profile approval before using crowdfunding billing.
                          </div>
                        )}
                        <label className="form-label">Select approved product</label>
                        <select
                          className="form-select"
                          name="productId"
                          value={formData.productId}
                          onChange={(e) => {
                            const product = products.find((item) => item.productId === e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              productId: e.target.value,
                              productType: product?.productType || prev.productType,
                            }));
                          }}
                          required
                          disabled={productsLoading || !canUseBilling}
                        >
                          <option value="">{productsLoading ? "Loading products..." : "Choose an approved product"}</option>
                          {products.map((product) => (
                            <option key={`${product.productType}-${product.productId}`} value={product.productId}>
                              {product.productName} ({product.productType}) - {Number(product.price || 0).toLocaleString()} ETB
                            </option>
                          ))}
                        </select>
                        {!productsLoading && products.length === 0 && canUseBilling && (
                          <small className="text-danger d-block mt-2">No approved products are available for your account yet.</small>
                        )}
                        {selectedProduct && (
                          <div className="d-flex gap-3 align-items-center mt-3 p-2 bg-white border rounded-3">
                            {selectedProduct.image && <img src={selectedProduct.image} alt={selectedProduct.productName} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />}
                            <div>
                              <strong className="d-block">{selectedProduct.productName}</strong>
                              <small className="text-muted d-block">Price: {Number(selectedProduct.price || 0).toLocaleString()} ETB</small>
                              <small className="text-muted d-block">Type: {selectedProduct.productType}</small>
                              <small className="text-muted d-block">Seller: {selectedProduct.seller?.name || "Marketplace seller"}</small>
                            </div>
                          </div>
                        )}
                        <small className="text-muted d-block mt-2">The winner checkout will be locked to this product only.</small>
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

                    <button type="submit" className="btn btn-primary w-100" disabled={loading || (isProductLocked && (!canUseBilling || products.length === 0))}>
                      {loading ? "Creating..." : isProductLocked ? "Create Crowdfunding Billing" : "Create Crowdfunding Round"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
    </div>
  );

  if (embedded) return content;

  return <DashboardLayout>{content}</DashboardLayout>;
};

export default CreateEqubChallenge;
