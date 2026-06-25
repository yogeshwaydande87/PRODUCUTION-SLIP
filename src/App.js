import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Batches from './pages/Batches';
import Products from './pages/Products';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import CompanyManagement from './pages/CompanyManagement';
import Navbar from './components/Navbar';

// Store
import { useAuthStore } from './store/authStore';
import { useCompanyStore } from './store/companyStore';

function App() {
  const [loading, setLoading] = useState(true);
  const { setUser, user } = useAuthStore();
  const { setCurrentCompany, currentCompany } = useCompanyStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();
        
        setUser({
          id: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          role: userData?.role || 'worker',
          photoURL: currentUser.photoURL,
          companyAccess: userData?.companyAccess || []
        });

        // Set first company as default
        if (userData?.companyAccess && userData.companyAccess.length > 0) {
          setCurrentCompany(userData.companyAccess[0]);
        }
      } else {
        setUser(null);
        setCurrentCompany(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setCurrentCompany]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {user && currentCompany ? (
        <div className="flex h-screen bg-gray-50">
          <Navbar />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/batches" element={<Batches />} />
              <Route path="/products" element={<Products />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/reports" element={<Reports />} />
              {user.role === 'super_admin' && (
                <Route path="/companies" element={<CompanyManagement />} />
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      ) : user ? (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center">
            <p className="text-gray-600 text-lg">No company access. Contact administrator.</p>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
