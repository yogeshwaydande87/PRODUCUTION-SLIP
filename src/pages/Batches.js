import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { useCompanyStore } from '../store/companyStore';
import { Plus, Edit2, Trash2 } from 'lucide-react';

function Batches() {
  const { user } = useAuthStore();
  const { currentCompany } = useCompanyStore();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const canCreate = ['supervisor', 'ops_head', 'company_admin'].includes(user?.role);

  useEffect(() => {
    const fetchBatches = async () => {
      if (!currentCompany) return;
      try {
        const batchesRef = collection(db, 'companies', currentCompany, 'batches');
        const snapshot = await getDocs(batchesRef);
        setBatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching batches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [currentCompany]);

  const filteredBatches = filterStatus === 'all' 
    ? batches 
    : batches.filter(b => b.status === filterStatus);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 chivo-font">Production Batches</h1>
        {canCreate && (
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" /> Add Batch
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        {['all', 'Running', 'Completed', 'Pending'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBatches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No batches found</p>
          </div>
        ) : (
          filteredBatches.map(batch => (
            <div key={batch.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mono-font">{batch.tableNumber}</h3>
                  <p className="text-sm text-gray-500 mt-1">{batch.date}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  batch.status === 'Running' ? 'bg-orange-100 text-orange-800' :
                  batch.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {batch.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">Workers: {batch.workerNames?.join(', ') || 'None'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Batches;
