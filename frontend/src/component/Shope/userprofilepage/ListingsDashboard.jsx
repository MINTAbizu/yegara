import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Package, 
  FileCode, 
  Gift, 
  Users, 
  BookOpen, 
  Share2, 
  ChevronRight,
  Inbox
} from "lucide-react";

const ListingsDashboard = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Physical Product");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Physical Product", buttonText: "Add Product", link: "/ADDphysicalproducts", icon: Package, count: 0 },
    { name: "Digital Product", buttonText: "Add Product", link: "/digitalproduct", icon: FileCode, count: 0 },
    { name: "Gift Product", buttonText: "Add Product", link: "/Giftproduct", icon: Gift, count: 0 },
    { name: "Crowdfunded Product", buttonText: "Create Challenge", link: "/equb-create", icon: Users, count: 0 },
    { name: "Book", buttonText: "Sell Book", link: "/addbook", icon: BookOpen, count: 0 },
    { name: "Social Media Account", buttonText: "Add Account", link: "/socialmediaaccount", icon: Share2, count: 0 },
  ];

  const currentCategoryObj = categories.find((c) => c.name === selectedCategory) || categories[0];

  return (
    <div className="container-fluid min-vh-100 bg-light p-3 p-md-4">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Listings & Services</h2>
          <p className="text-muted mb-0">Manage your product offerings, books, and digital services in one place.</p>
        </div>
        <button
          className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 px-3 py-2 shadow-sm rounded-3"
          onClick={() => navigate(currentCategoryObj.link)}
        >
          <Plus size={18} />
          <span>{currentCategoryObj.buttonText}</span>
        </button>
      </div>

      {/* Responsive Category Grid Cards */}
      <div className="row g-3 mb-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.name;
          return (
            <div key={category.name} className="col-12 col-sm-6 col-lg-4 col-xl-2">
              <div
                className={`card h-100 border-0 shadow-sm transition-all rounded-3 ${
                  isSelected ? "ring-2 border-primary bg-white" : "bg-white border-light"
                }`}
                style={{
                  cursor: "pointer",
                  borderLeft: isSelected ? "4px solid #0d6efd" : "1px solid #f0f0f0",
                  transition: "all 0.2s ease-in-out"
                }}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="card-body p-3 d-flex flex-column justify-content-between">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      className={`p-2 rounded-2 ${
                        isSelected ? "bg-primary text-white" : "bg-light text-secondary"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="badge bg-light text-dark fw-normal rounded-pill">
                      {category.count} items
                    </span>
                  </div>

                  <div>
                    <h6 className={`fw-semibold mb-1 ${isSelected ? "text-primary" : "text-dark"}`}>
                      {category.name}
                    </h6>
                    <button
                      className={`btn btn-link p-0 text-decoration-none border-0 text-start d-flex align-items-center gap-1 mt-2 ${
                        isSelected ? "text-primary fw-medium" : "text-muted small"
                      }`}
                      style={{ fontSize: "0.825rem" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(category.link);
                      }}
                    >
                      <span>{category.buttonText}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Products Table Card */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="card-header bg-white py-3 px-4 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0 fw-bold text-dark">{selectedCategory}</h5>
            <span className="badge bg-primary-subtle text-primary rounded-pill">0 Total</span>
          </div>

          <div className="position-relative" style={{ minWidth: "240px" }}>
            <Search
              size={16}
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            />
            <input
              type="text"
              className="form-control ps-5 bg-light border-0 py-2 rounded-3"
              placeholder={`Search ${selectedCategory.toLowerCase()}s...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th className="ps-4">Product Details</th>
                <th>Category</th>
                <th>Sales</th>
                <th>Created Date</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty State */}
              <tr>
                <td colSpan="5" className="text-center py-5">
                  <div className="d-flex flex-column align-items-center justify-content-center my-3">
                    <div className="p-3 bg-light rounded-circle text-muted mb-3">
                      <Inbox size={32} />
                    </div>
                    <h6 className="fw-semibold text-dark mb-1">No listings found</h6>
                    <p className="text-muted small mb-3" style={{ maxWidth: "320px" }}>
                      You haven't listed any items under {selectedCategory} yet. Start selling by adding your first product.
                    </p>
                    <button
                      className="btn btn-outline-primary btn-sm rounded-2 d-inline-flex align-items-center gap-2"
                      onClick={() => navigate(currentCategoryObj.link)}
                    >
                      <Plus size={16} />
                      <span>{currentCategoryObj.buttonText}</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListingsDashboard;