import React from 'react';

export default function StaffList({ staffList = [], onEdit, onDelete }) {
  if (staffList.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No staff members found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-indigo-100 text-indigo-800 text-left text-sm uppercase tracking-wider">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
           
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr
              key={staff._id}
              className="border-b hover:bg-indigo-50 transition duration-150"
            >
              <td className="px-4 py-3 font-medium text-gray-800">{staff.name}</td>
              <td className="px-4 py-3 text-gray-700">{staff.email}</td>
              <td className="px-4 py-3 text-gray-700">{staff.phone || '-'}</td>
              <td className="px-4 py-3">
              </td>
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => onEdit(staff)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(staff._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

