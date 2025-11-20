import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Authcontext";
import DashboardLayout from "./DashboardLayout";

const FullMultiStepKYC = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "", dob: "", gender: "", nationality: "", maritalStatus: "",
    faceId: null, idType: "", idFront: null, idBack: null,
    idNumber: "", issueDate: "", expireDate: "", residentialAddress: "",
    phone: "", email: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setFormData({ ...formData, [name]: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const validateStep = () => {
    if (step === 1) {
      const { fullName, dob, gender, nationality, maritalStatus } = formData;
      if (!fullName || !dob || !gender || !nationality || !maritalStatus) return false;
    } else if (step === 2) {
      const { faceId, idType, idFront, idBack, idNumber, issueDate, expireDate } = formData;
      if (!faceId || !idType || !idFront || !idBack || !idNumber || !issueDate || !expireDate) return false;
    } else if (step === 3) {
      if (!formData.residentialAddress) return false;
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(step + 1); };
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await fetch("http://localhost:5000/api/kyc/submit-kyc", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert("KYC Submitted Successfully!");
        if (refreshUser) await refreshUser();
        navigate("/Shop", { replace: true }); // go to Shop directly
      } else alert(result.message || "Submission failed!");
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-center py-5">
        <div className="card shadow p-3" style={{ maxWidth: 500, width: "100%" }}>
          <div className="card-body">
            <h2 className="text-center mb-4">
              {step === 1 ? "KYC Profile" : step === 2 ? "Identity Verification" : "Contact Information"}
            </h2>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name*" className="form-control mb-2" />
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control mb-2" />
                  <select name="gender" value={formData.gender} onChange={handleChange} className="form-select mb-2">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality*" className="form-control mb-2" />
                  <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="form-select mb-2">
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </>
              )}
              {step === 2 && (
                <>
                  <input type="file" name="faceId" accept="image/*" onChange={handleChange} className="form-control mb-2" />
                  <select name="idType" value={formData.idType} onChange={handleChange} className="form-select mb-2">
                    <option value="">Select ID Type</option>
                    <option value="Drivers Licence">Drivers Licence</option>
                    <option value="Passport">Passport</option>
                    <option value="National ID">National ID</option>
                  </select>
                  <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="ID Number*" className="form-control mb-2" />
                  <input type="file" name="idFront" accept="image/*,application/pdf" onChange={handleChange} className="form-control mb-2" />
                  <input type="file" name="idBack" accept="image/*,application/pdf" onChange={handleChange} className="form-control mb-2" />
                  <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} className="form-control mb-2" />
                  <input type="date" name="expireDate" value={formData.expireDate} onChange={handleChange} className="form-control mb-2" />
                </>
              )}
              {step === 3 && (
                <>
                  <input type="text" name="residentialAddress" value={formData.residentialAddress} onChange={handleChange} placeholder="Residential Address*" className="form-control mb-2" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="form-control mb-2" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="form-control mb-2" />
                </>
              )}
              <div className="d-flex justify-content-between mt-3">
                {step > 1 && <button type="button" className="btn btn-secondary" onClick={prevStep}>Previous</button>}
                {step < 3 && <button type="button" className="btn btn-primary ms-auto" onClick={nextStep}>Next</button>}
                {step === 3 && <button type="submit" className="btn btn-success ms-auto">Submit</button>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FullMultiStepKYC;
