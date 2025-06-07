import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createPaymentSession = async (paymentData) => {
  const res = await fetch(`${API_BASE_URL}/payments/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(paymentData),
  });
  if (!res.ok) throw new Error("Payment session creation failed");
  return await res.json();
};

export const confirmPayment = async (sessionId) => {
  const res = await fetch(`${API_BASE_URL}/payments/confirm?session_id=${sessionId}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Payment confirmation failed");
  return await res.json();
};

export const getAllPayments = async () => {
  const res = await fetch(`${API_BASE_URL}/payments`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch payments");
  return await res.json();
};

const API = {
  getAuthHeaders,
  createPaymentSession,
  confirmPayment,
  getAllPayments,
};

export default API;
