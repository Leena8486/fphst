import React, { useEffect, useState } from "react";
import { getAuthHeaders } from "../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminPaymentSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/payments/summary`,
        {
          headers: getAuthHeaders(),
        }
      );
      const data = await res.json();
      setSummary(data);
    };
    fetchSummary();
  }, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 shadow rounded border mt-10">
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        Revenue Summary
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Total by Category
        </h3>
        <ul className="space-y-1">
          {summary.categoryTotals.map((item) => (
            <li key={item._id} className="text-gray-700">
              {item._id}: ₹{item.totalAmount}
            </li>
          ))}
        </ul>
      </div>

      <h3 className="text-lg font-semibold text-gray-600 mb-2">
        Monthly Revenue
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={summary.monthlyRevenue}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalAmount" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminPaymentSummary;
