import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./RegisterWorkshop.css";

const RegisterWorkshop = () => {
  const { id } = useParams();
  const navigate = useNavigate();

const [form, setForm] = useState({
  full_name: "",
  email: "",
  phone: "",
  institution_name: "",
  institution_type: ""
});

  const submitForm = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/workshops/register/",
        {
          ...form,
          workshop: id
        }
      );

      // ✅ Redirect to QR payment page
      navigate(`/workshop-payment/${res.data.registration_id}`);

    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-bg d-flex align-items-center justify-content-center">
      <div className="card register-card shadow-lg">
        <h3 className="text-center mb-4 text-gradient">
          Workshop Registration
        </h3>

        <input
          className="form-control mb-3"
          placeholder="Full Name"
          onChange={e => setForm({ ...form, full_name: e.target.value })}
        />

        <input
          className="form-control mb-3"
          placeholder="Email"
          type="email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="form-control mb-3"
          placeholder="Phone"
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        <select
  className="form-control mb-3"
  onChange={e => setForm({ ...form, institution_type: e.target.value })}
>
  <option value="">Select Institution Type</option>
  <option value="school">School</option>
  <option value="college">College</option>
</select>

{form.institution_type && (
  <input
    className="form-control mb-4"
    placeholder={
      form.institution_type === "college"
        ? "Enter College Name"
        : "Enter School Name"
    }
    onChange={e =>
      setForm({ ...form, institution_name: e.target.value })
    }
  />
)}


        <button
          className="btn btn-gradient w-100"
          onClick={submitForm}
        >
          Register & Pay
        </button>
      </div>
    </div>
  );
};

export default RegisterWorkshop;