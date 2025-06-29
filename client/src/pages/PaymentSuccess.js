import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const markPaymentAsCompleted = async () => {
      const token = localStorage.getItem('token');

      try {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/payments/complete-latest`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        alert("✅ Payment marked as completed!");
      } catch (err) {
        console.error("Error marking payment as completed", err);
        alert("⚠️ Failed to mark payment. Please contact admin.");
      }

      setTimeout(() => {
        navigate("/resident/payments");
      }, 2000);
    };

    markPaymentAsCompleted();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 text-green-700 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Payment Successful</h1>
      <p>Thank you! You will be redirected shortly...</p>
    </div>
  );
};

export default PaymentSuccess;
