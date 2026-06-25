import React, { useState } from 'react';
import './ProductionItem.css';

function ProductionItem({ slip, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(slip);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(slip.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(slip);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return '#4CAF50';
      case 'In Progress': return '#FF9800';
      case 'On Hold': return '#2196F3';
      case 'Cancelled': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="production-item">
      {isEditing ? (
        <div className="item-edit-mode">
          <div className="edit-field">
            <label>Product:</label>
            <input
              type="text"
              name="product"
              value={editData.product}
              onChange={handleChange}
            />
          </div>
          <div className="edit-field">
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={editData.quantity}
              onChange={handleChange}
            />
          </div>
          <div className="edit-field">
            <label>Status:</label>
            <select name="status" value={editData.status} onChange={handleChange}>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="item-view-mode">
          <div className="item-header">
            <h3>{slip.product}</h3>
            <span className="status-badge" style={{ backgroundColor: getStatusColor(slip.status) }}>
              {slip.status}
            </span>
          </div>
          <div className="item-details">
            <p><strong>Date:</strong> {slip.date}</p>
            <p><strong>Quantity:</strong> {slip.quantity} units</p>
            <p><strong>Operator:</strong> {slip.operator}</p>
          </div>
          <div className="item-actions">
            <button className="edit-btn" onClick={handleEdit}>✏️ Edit</button>
            <button className="delete-btn" onClick={() => onDelete(slip.id)}>🗑️ Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductionItem;
