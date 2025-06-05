import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const MonthlyRevenueChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
  try {
    const res = await axios.get('/api/payments/summary/monthly', {
      withCredentials: true
    });
    setData(res.data);
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
  }
};
    fetchSummary();
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Monthly Revenue Summary</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="total" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyRevenueChart;
