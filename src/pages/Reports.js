import React from 'react';
import { useAuthStore } from '../store/authStore';

function Reports() {
  const { user } = useAuthStore();
  const canDownload = ['supervisor', 'ops_head', 'quality_check', 'company_admin'].includes(user?.role);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 chivo-font mb-8">Reports & Analytics</h1>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-600">Reports module is being developed...</p>
      </div>
    </div>
  );
}

export default Reports;
