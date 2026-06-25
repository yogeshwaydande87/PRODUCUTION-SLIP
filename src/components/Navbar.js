import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuthStore } from '../store/authStore';
import { useCompanyStore } from '../store/companyStore';
import { collection, getDocs, query } from 'firebase/firestore';
import { Home, Package, Users, FileText, LogOut, Menu, X, Building2, ChevronDown } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuthStore();
  const { currentCompany, setCurrentCompany } = useCompanyStore();
  const [companies, setCompanies] = useState([]);
  const [showMobile, setShowMobile] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!user?.companyAccess || user.companyAccess.length === 0) return;
      
      try {
        const companiesRef = collection(db, 'companies');
        const snapshot = await getDocs(companiesRef);
        const allCompanies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter only companies user has access to
        const userCompanies = allCompanies.filter(c => user.companyAccess.includes(c.id));
        setCompanies(userCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    logout();
    navigate('/login');
  };

  const getCurrentCompanyName = () => {
    const company = companies.find(c => c.id === currentCompany);
    return company?.name || 'Select Company';
  };

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/batches', icon: Package, label: 'Batches' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/employees', icon: Users, label: 'Employees' },
    { path: '/reports', icon: FileText, label: 'Reports' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold chivo-font">PMS</h1>
          <p className="text-xs text-blue-300 mt-1">Production System</p>
        </div>

        {/* Company Selector */}
        <div className="p-4 border-b border-blue-700">
          <div className="relative">
            <button
              onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
              className="w-full flex items-center justify-between bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="truncate">{getCurrentCompanyName()}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showCompanyDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-blue-700 rounded-lg shadow-lg z-50">
                {companies.map(company => (
                  <button
                    key={company.id}
                    onClick={() => {
                      setCurrentCompany(company.id, company.name);
                      setShowCompanyDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-600 text-sm text-white hover:font-semibold transition-colors"
                  >
                    {company.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-6 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}

          {/* Super Admin Menu */}
          {user?.role === 'super_admin' && (
            <button
              onClick={() => navigate('/companies')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/companies')
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-semibold">Companies</span>
            </button>
          )}
        </div>

        <div className="p-6 border-t border-blue-700">
          <div className="mb-4">
            <p className="text-xs text-blue-300 uppercase tracking-wider">User</p>
            <p className="text-sm font-semibold text-white mt-1">{user?.displayName || user?.email}</p>
            <p className="text-xs text-blue-300 capitalize mt-1">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 z-40">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">PMS</h1>
          <button onClick={() => setShowMobile(!showMobile)}>
            {showMobile ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobile && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-blue-900 text-white p-4 space-y-2 z-30">
          <div className="mb-4">
            <select
              value={currentCompany || ''}
              onChange={(e) => setCurrentCompany(e.target.value)}
              className="w-full bg-blue-800 text-white px-3 py-2 rounded-lg"
            >
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setShowMobile(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-800"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg mt-4"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;
