import React, { useState } from 'react';
import './ProductionForm.css';

function ProductionForm({ onAddSlip }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    product: '',
    quantity: '',
    status: 'In Progress',
    operator: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.product || !formData.quantity || !formData.operator) {
      alert('Please fill in all fields');
      return;
    }

    onAddSlip(formData);
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      product: '',
      quantity: '',
      status: 'In Progress',
      operator: ''
    });
  };

  return (
    <div className="production-form">
      <h2>📝 Add Production Slip</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="product"
            value={formData.product}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-group">
          <label>Operator Name</label>
          <input
            type="text"
            name="operator"
            value={formData.operator}
            onChange={handleChange}
            placeholder="Enter operator name"
            required
          />
        </div>

        <button type="submit" className="submit-btn">Add Slip</button>
      </form>
    </div>
  );
}

export default ProductionForm;
