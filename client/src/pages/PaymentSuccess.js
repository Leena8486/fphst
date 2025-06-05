import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { confirmPayment } from "../utils/api";

const PaymentSuccess = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    const confirm = async () => {
      const session_id = params.get("session_id");
      if (session_id) await confirmPayment(session_id);
    };
    confirm();
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="p-6 bg-white border shadow rounded-xl text-center">
        <h1 className="text-3xl font-bold text-green-700">Payment Successful!</h1>
        <p className="text-gray-700 mt-2">Thank you for your payment.</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
