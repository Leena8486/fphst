import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResidentPayments = () => {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/residents/payments', {
        withCredentials: true,
      })
      .then((res) => {
        setPayments(res.data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <button
          onClick={() => navigate('/resident/dashboard')}
          className="mb-6 inline-block text-indigo-700 hover:text-indigo-900 font-semibold transition"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-3xl font-extrabold mb-6 text-indigo-800 text-center">
          Your Payments
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-indigo-100 text-indigo-700">
              <tr>
                <th className="py-3 px-6 text-left font-semibold">Category</th>
                <th className="py-3 px-6 text-left font-semibold">Amount</th>
                <th className="py-3 px-6 text-left font-semibold">Status</th>
                <th className="py-3 px-6 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No payments found.
                  </td>
                </tr>
              )}
              {payments.map((pay) => (
                <tr
                  key={pay._id}
                  className="border-t border-gray-200 hover:bg-indigo-50 transition"
                >
                  <td className="py-3 px-6">{pay.category}</td>
                  <td className="py-3 px-6 font-semibold text-indigo-700">
                    ₹{pay.amount}
                  </td>
                  <td
                    className={`py-3 px-6 font-semibold ${
                      pay.status === 'Paid'
                        ? 'text-green-600'
                        : pay.status === 'Pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {pay.status}
                  </td>
                  <td className="py-3 px-6">
                    {new Date(pay.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResidentPayments;
