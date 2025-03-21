import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SupplierManagement.css';
import loadingIcon from '../Icon/loading.png';
import editIcon from '../Icon/edit.png';
import deleteIcon from '../Icon/delete.png';

const SupplierManagement = () => {
    const [suppliers, setSupplier] = useState([]);
    const [loading,setLoading] = useState(true);
    const [newSupplier, setNewSupplier] = useState({ 
        name: '' ,
        phone_number: '',
        email: '',
        address: '' 
    });
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [isAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

    useEffect(() => {
        fetchSupplier();
        setLoading(false);
    }, []);

    const fetchSupplier = async () => {
        try {
            const response = await axios.get('http://localhost:5000/suppliers',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            setSupplier(response.data);
            console.log(response,'this is response');//debuggingggggg
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex pattern
            if (!emailPattern.test(value)) {
                e.target.setCustomValidity('Please enter a valid email address.'); // Set custom validity message
            } else {
                e.target.setCustomValidity(''); // Clear the error message
            }
        }
    
        if (editingSupplier) {
            setEditingSupplier({
                ...editingSupplier,
                [name]: value
            });
        } else {
            setNewSupplier({
                ...newSupplier,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/suppliers', newSupplier,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            console.log(newSupplier,'Testingggggggggg Supplier');
            setNewSupplier({ name: '', phone_number: '',email: '', address: '' });
            fetchSupplier();
        } catch (error) {
            console.error('Error creating Supplier:', error);
            alert('Error creating Supplier. Phone number might already exist.');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/suppliers/${editingSupplier.id}`, editingSupplier,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            setEditingSupplier(null);
            fetchSupplier();
        } catch (error) {
            console.error('Error updating Supplier:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Supplier?')) return;
        
        try {
            await axios.delete(`http://localhost:5000/suppliers/${id}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            fetchSupplier();
        } catch (error) {
            console.error('Error deleting Supplier:', error);
        }
    };
    if (loading) return <div className = 'loading-container'><div className="loading-spinner"><img src={loadingIcon} alt='LoadingIcon'/></div></div>;
    // SupplierManagement.js (Modified Sections)
return (
    <div className="Supplier-management">
      <h2>Supplier Management</h2>  
      {/* Registration Form */}
      <div className="registration-card">
        <h3>{editingSupplier ? 'Edit Supplier' : 'Register New Supplier'}</h3>
        <form onSubmit={editingSupplier ? handleUpdate : handleSubmit}>
          <div className="form-grid">
            <input
              type="text"
              name="name"
              value={editingSupplier ? editingSupplier.name : newSupplier.name}
              onChange={handleInputChange}
              placeholder="Supplier Name"
              required
            />
            <input
              type="tel"
              name="phone_number"
              value={editingSupplier ? editingSupplier.phone_number : newSupplier.phone_number}
              onChange={handleInputChange}
              placeholder="Phone Number"
              pattern="[0-9]{6,15}"
              required
            />
            <input
              type="email"
              name="email"
              value={editingSupplier ? editingSupplier.email : newSupplier.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              required
            />
            <input
              type="text"
              name="address"
              value={editingSupplier ? editingSupplier.address : newSupplier.address}
              onChange={handleInputChange}
              placeholder="Physical Address"
              required
            />
            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {editingSupplier ? 'Update Supplier' : 'Register Supplier'}
              </button>
              {editingSupplier && (
                <button 
                  type="button" 
                  onClick={() => setEditingSupplier(null)}
                  className="secondary-btn"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
  
      {/* Suppliers List */}
      <div className="suppliers-grid">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="supplier-card">
            <div className="card-header">
              <h4>{supplier.name}</h4>
              {isAdmin && (
                <div className="card-actions">
                    <img src={editIcon} alt='Edit' onClick={() => setEditingSupplier(supplier)}
                    />
                    <img src={deleteIcon} alt='Delete' onClick={() => handleDelete(supplier.id)}
                    />
                  {/* <button 
                    onClick={() => setEditingSupplier(supplier)}
                    className="edit-btn"
                  >
                
                  </button> */}
                  {/* <button 
                    onClick={() => handleDelete(supplier.id)}
                    className="delete-btn"
                  >
                    🗑️ Delete
                  </button> */}
                </div>
              )}
            </div>
            <div className="card-body">
              <p><strong>Phone:</strong> {supplier.phone_number}</p>
              <p><strong>Email:</strong> {supplier.email}</p>
              <p><strong>Address:</strong> {supplier.address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierManagement; 