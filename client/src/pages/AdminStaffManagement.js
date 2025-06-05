import React, { useState } from 'react';
import StaffList from '../components/StaffList';
import StaffForm from '../components/StaffForm';

export default function AdminStaffManagement() {
  const [editingStaff, setEditingStaff] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const handleEdit = (staff) => {
    setEditingStaff(staff);
  };

  const handleSaved = () => {
    setEditingStaff(null);
    setRefreshToggle(!refreshToggle); // to refresh staff list
  };

  const handleCancel = () => {
    setEditingStaff(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Staff Management</h1>
      <StaffList key={refreshToggle} onEdit={handleEdit} />
      <StaffForm staffToEdit={editingStaff} onSaved={handleSaved} onCancel={handleCancel} />
    </div>
  );
}
