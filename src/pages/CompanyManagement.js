import React from 'react';
import { useAuthStore } from '../store/authStore';

function CompanyManagement() {
  const { user } = useAuthStore();

  if (user?.role !== 'super_admin') {
    return (
      <div className="p-8">
        <p className="text-red-600">Access Denied. Super Admin only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 chivo-font mb-8">Company Management</h1>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-600">Company management module is being developed...</p>
        <p className="text-gray-500 text-sm mt-4">Super Admin can create and manage multiple companies here</p>
      </div>
    </div>
  );
}

export default CompanyManagement;
