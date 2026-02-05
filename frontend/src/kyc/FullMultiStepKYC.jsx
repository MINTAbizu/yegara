import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Authcontext";
import DashboardLayout from "./DashboardLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const API_URL = import.meta.env.VITE_API_URL;

const FullMultiStepKYC = () => {
  const { currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    nationality: "",
    maritalStatus: "",
    faceId: null,
    idType: "",
    idFront: null,
    idBack: null,
    idNumber: "",
    issueDate: "",
    expireDate: "",
    residentialAddress: "",
    phone: "",
    email: "",
  });

  const [verificationStatus, setVerificationStatus] = useState(
    currentUser?.verificationStatus || "Pending"
  );

  // Sync verification status
  useEffect(() => {
    if (currentUser?.verificationStatus) {
      setVerificationStatus(currentUser.verificationStatus);
    }
  }, [currentUser]);

  // Auto refresh every 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshUser();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshUser]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateStep = () => {
    if (step === 1) {
      const { fullName, dob, gender, nationality, maritalStatus } = formData;
      if (!fullName || !dob || !gender || !nationality || !maritalStatus) {
        toast.warning("Please fill all fields in Step 1");
        return false;
      }
    }

    if (step === 2) {
      const {
        faceId,
        idType,
        idFront,
        idBack,
        idNumber,
        issueDate,
        expireDate,
      } = formData;

      if (
        !faceId ||
        !idType ||
        !idFront ||
        !idBack ||
        !idNumber ||
        !issueDate ||
        !expireDate
      ) {
        toast.warning("Please fill all fields in Step 2");
        return false;
      }
    }

    if (step === 3 && !formData.residentialAddress) {
      toast.warning("Please enter your residential address");
      return false;
    }

    return true;
  };

  const nextStep = () => validateStep() && setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return navigate("/login");
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) =>
      data.append(key, formData[key])
    );

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading("Submitting KYC, please wait...");

      const res = await fetch(`${API_URL}/api/kyc/submit-kyc`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();
      toast.dismiss(loadingToast);

      if (res.ok) {
        toast.success("KYC submitted successfully 🎉");
        await refreshUser();
        navigate("/orders", { replace: true });
      } else {
        toast.error(result.message || "KYC submission failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Status */}
      <div className="text-center mb-3">
        <span style={{ color: "red", marginRight: 10 }}>
          Complete all KYC steps to access your dashboard
        </span>
        <span
          style={{
            color: verificationStatus === "Verified" ? "green" : "orange",
            fontWeight: "bold",
          }}
        >
          <FaCheckCircle className="me-1" />
          {verificationStatus}
        </span>
      </div>

      <div className="d-flex justify-content-center py-5">
        <div className="card shadow p-3" style={{ maxWidth: 500, width: "100%" }}>
          <div className="card-body">
            <h4 className="text-center mb-4">
              {step === 1
                ? "KYC Profile"
                : step === 2
                ? "Identity Verification"
                : "Contact Information"}
            </h4>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <input className="form-control mb-2" name="fullName" placeholder="Full Name*" onChange={handleChange} />
                  <input className="form-control mb-2" type="date" name="dob" onChange={handleChange} />
                  <select className="form-select mb-2" name="gender" onChange={handleChange}>
                    <option value="">Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <input className="form-control mb-2" name="nationality" placeholder="Nationality*" onChange={handleChange} />
                  <select className="form-select mb-2" name="maritalStatus" onChange={handleChange}>
                    <option value="">Marital Status</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                  </select>
                </>
              )}

              {step === 2 && (
                <>
                  <input className="form-control mb-2" type="file" name="faceId" onChange={handleChange} />
                  <select className="form-select mb-2" name="idType" onChange={handleChange}>
                    <option value="">ID Type</option>
                    <option>Passport</option>
                    <option>National ID</option>
                    <option>Drivers Licence</option>
                  </select>
                  <input className="form-control mb-2" name="idNumber" placeholder="ID Number*" onChange={handleChange} />
                  <input className="form-control mb-2" type="file" name="idFront" onChange={handleChange} />
                  <input className="form-control mb-2" type="file" name="idBack" onChange={handleChange} />
                  <input className="form-control mb-2" type="date" name="issueDate" onChange={handleChange} />
                  <input className="form-control mb-2" type="date" name="expireDate" onChange={handleChange} />
                </>
              )}

              {step === 3 && (
                <>
                  <input className="form-control mb-2" name="residentialAddress" placeholder="Residential Address*" onChange={handleChange} />
                  <input className="form-control mb-2" name="phone" placeholder="Phone" onChange={handleChange} />
                  <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} />
                </>
              )}

              <div className="d-flex justify-content-between mt-3">
                {step > 1 && (
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    Previous
                  </button>
                )}

                {step < 3 && (
                  <button type="button" className="btn btn-primary ms-auto" onClick={nextStep}>
                    Next
                  </button>
                )}

                {step === 3 && (
                  <button
                    type="submit"
                    className="btn btn-success ms-auto d-flex align-items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <ClipLoader size={18} />
                        <span className="ms-2">Submitting...</span>
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FullMultiStepKYC;
