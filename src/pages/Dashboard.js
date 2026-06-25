import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { useCompanyStore } from '../store/companyStore';
import { Activity, Package, Users, Zap, Calendar } from 'lucide-react';
import { format } from 'date-fns';

function Dashboard() {
  const { user } = useAuthStore();
  const { currentCompany } = useCompanyStore();
  const [stats, setStats] = useState({
    totalBatches: 0,
    runningBatches: 0,
    completedBatches: 0,
    totalProducts: 0,
    totalEmployees: 0,
    todayBatches: 0
  });
  const [recentBatches, setRecentBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentCompany) return;
      
      try {
        // Fetch company-specific data
        const batchesRef = collection(db, 'companies', currentCompany, 'batches');
        const productsRef = collection(db, 'companies', currentCompany, 'products');
        const employeesRef = collection(db, 'companies', currentCompany, 'employees');

        const [batchesSnap, productsSnap, employeesSnap] = await Promise.all([
          getDocs(batchesRef),
          getDocs(productsRef),
          getDocs(employeesRef)
        ]);

        const batches = batchesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const todayBatches = batches.filter(b => b.date === today).length;
        const running = batches.filter(b => b.status === 'Running').length;
        const completed = batches.filter(b => b.status === 'Completed').length;

        setStats({
          totalBatches: batches.length,
          runningBatches: running,
          completedBatches: completed,
          totalProducts: productsSnap.docs.length,
          totalEmployees: employeesSnap.docs.length,
          todayBatches: todayBatches
        });

        // Get recent batches
        const recent = batches
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setRecentBatches(recent);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentCompany]);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${color.replace('border-', 'bg-')} bg-opacity-10 p-3 rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 chivo-font">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.displayName || user?.email}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Activity} label="Total Batches" value={stats.totalBatches} color="border-blue-600" />
        <StatCard icon={Zap} label="Running Batches" value={stats.runningBatches} color="border-orange-500" />
        <StatCard icon={Package} label="Completed Batches" value={stats.completedBatches} color="border-green-500" />
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="border-purple-600" />
        <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees} color="border-indigo-600" />
        <StatCard icon={Calendar} label="Today's Batches" value={stats.todayBatches} color="border-pink-500" />
      </div>

      {/* Recent Batches */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 chivo-font">Recent Batches</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Batch</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Products</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Workers</th>
              </tr>
            </thead>
            <tbody>
              {recentBatches.map(batch => (
                <tr key={batch.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-semibold text-blue-600 mono-font">{batch.tableNumber}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{format(new Date(batch.date), 'MMM dd, yyyy')}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      batch.status === 'Running' ? 'bg-orange-100 text-orange-800' :
                      batch.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {batch.status === 'Running' && '🔵'} {batch.status === 'Completed' && '🟢'} {batch.status === 'Pending' && '🟡'}
                      {' '}{batch.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{batch.products?.length || 0} SKUs</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{batch.workers?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
