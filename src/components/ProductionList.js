import React from 'react';
import './ProductionList.css';
import ProductionItem from './ProductionItem';

function ProductionList({ slips, onUpdate, onDelete }) {
  return (
    <div className="production-list">
      <h2>📊 Production Slips</h2>
      {slips.length === 0 ? (
        <p className="empty-message">No production slips yet. Add one to get started!</p>
      ) : (
        <div className="slips-container">
          {slips.map(slip => (
            <ProductionItem
              key={slip.id}
              slip={slip}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      <div className="stats">
        <p><strong>Total Slips:</strong> {slips.length}</p>
        <p><strong>Completed:</strong> {slips.filter(s => s.status === 'Completed').length}</p>
        <p><strong>In Progress:</strong> {slips.filter(s => s.status === 'In Progress').length}</p>
      </div>
    </div>
  );
}

export default ProductionList;
