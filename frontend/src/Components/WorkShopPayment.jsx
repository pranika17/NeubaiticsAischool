import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./WorkShopPayment.css";

const WorkshopPayment = () => {
  const { registrationId } = useParams();
  const [amount, setAmount] = useState(null);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentInfo();

    // 🔄 auto-refresh every 5 seconds to check admin approval
    const interval = setInterval(fetchPaymentInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPaymentInfo = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/workshops/payment-info/${registrationId}/`
      );
      setAmount(res.data.payable_amount);
      setStatus(res.data.status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="payment-page">Loading...</div>;
  }

  return (
    <div className="payment-page">
      <div className="payment-card">
        {status === "paid" || status === "approved" ? (
          <>
            <h2 className="success-text">✅ Payment Successful</h2>
            <p>Your workshop seat is confirmed.</p>
          </>
        ) : (
          <>
            <h3 className="mb-3">Scan & Pay</h3>

            <img
              src="/qr/qrcode.jpeg"
              alt="UPI QR"
              className="qr-image"
            />

            <h4 className="amount-text">
              Pay exactly ₹{amount}
            </h4>

            <p className="warning-text">
              ⚠️ Please pay the <strong>exact amount</strong>.  
              Your payment will be confirmed automatically after verification.
            </p>

            <p className="status-text">
              Current Status: <strong>{status.toUpperCase()}</strong>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkshopPayment;
