import React, { useState } from 'react';
import './App.css';
import ProductionForm from './components/ProductionForm';
import ProductionList from './components/ProductionList';

function App() {
  const [slips, setSlips] = useState([
    {
      id: 1,
      date: '2026-06-25',
      product: 'Widget A',
      quantity: 500,
      status: 'Completed',
      operator: 'John Doe'
    }
  ]);

  const addSlip = (slip) => {
    setSlips([...slips, { ...slip, id: Date.now() }]);
  };

  const updateSlip = (id, updatedSlip) => {
    setSlips(slips.map(slip => slip.id === id ? { ...slip, ...updatedSlip } : slip));
  };

  const deleteSlip = (id) => {
    setSlips(slips.filter(slip => slip.id !== id));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📋 Production Slip Management System</h1>
        <p>Track and manage production activities</p>
      </header>
      
      <main className="app-main">
        <div className="container">
          <div className="form-section">
            <ProductionForm onAddSlip={addSlip} />
          </div>
          
          <div className="list-section">
            <ProductionList 
              slips={slips} 
              onUpdate={updateSlip}
              onDelete={deleteSlip}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2026 Production Slip System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
