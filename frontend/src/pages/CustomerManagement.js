import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerManagement.css';
import loadingIcon from '../Icon/loading.png';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading,setLoading] = useState(true);
    const [newCustomer, setNewCustomer] = useState({
        phone_number: '',
        name: ''  // Adding name field for better customer identification
    });
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [isAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

    useEffect(() => {
        fetchCustomers();
        setLoading(false);
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/customers',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            setCustomers(response.data);
            console.log(response,'this is response');//debuggingggggg
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingCustomer) {
            setEditingCustomer({
                ...editingCustomer,
                [name]: value
            });
        } else {
            setNewCustomer({
                ...newCustomer,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/customers', newCustomer,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            console.log(newCustomer,'Testingggggggggg Customer');
            setNewCustomer({ phone_number: '', name: '' });
            fetchCustomers();
        } catch (error) {
            console.error('Error creating customer:', error);
            alert('Error creating customer. Phone number might already exist.');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/customers/${editingCustomer.id}`, editingCustomer,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            setEditingCustomer(null);
            fetchCustomers();
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) return;
        
        try {
            await axios.delete(`http://localhost:5000/customers/${id}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };
    if (loading) return <div className = 'loading-container'><div className="loading-spinner"><img src={loadingIcon} alt='LoadingIcon'/></div></div>;
    return (
        <div className="customer-management">
            <h2>Customer Management</h2>

            {/* Registration Form */}
            <div className="registration-form">
                <h3>{editingCustomer ? 'Edit Customer' : 'Register New Customer'}</h3>
                <form onSubmit={editingCustomer ? handleUpdate : handleSubmit}>
                    <div className="CM-form-group">
                        <input
                            type="tel"
                            name="phone_number"
                            value={editingCustomer ? editingCustomer.phone_number : newCustomer.phone_number}
                            onChange={handleInputChange}
                            placeholder="Phone Number"
                            pattern="[0-9]{6,15}"
                            required
                        />
                        <input
                            type="text"
                            name="name"
                            value={editingCustomer ? editingCustomer.name : newCustomer.name}
                            onChange={handleInputChange}
                            placeholder="Customer Name"
                            required
                        />{
                            editingCustomer && (
                                <input
                                    type="text"
                                    name="points"
                                    value={editingCustomer.points}
                                    onChange={handleInputChange}
                                    placeholder="Customer Point"
                                    required
                                />)
                        }
                        <button type="submit" className='btn-primary-a'>
                            {editingCustomer ? 'Update Customer' : 'Register Customer'}
                        </button>
                        {editingCustomer && (
                            <button 
                                type="button" 
                                onClick={() => setEditingCustomer(null)}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Customers List */}
            <div className="customers-list">
                <h3>Registered Customers</h3>
                <div className="customers-grid">
                    <div className="customer-header">
                        <span>Name</span>
                        <span>Phone Number</span>
                        <span>Points</span>
                        <span>Total Spent</span>
                        {isAdmin && <span>Actions</span>}
                    </div>
                    {customers.map(customer => (
                        <div key={customer.id} className="customer-row">
                            <span>{customer.name}</span>
                            <span>{customer.phone_number}</span>
                            <span>{customer.points}</span>
                            <span>${customer.total_spent}</span>
                            {isAdmin && (
                                <div className="customer-actions">
                                    <button 
                                        onClick={() => setEditingCustomer(customer)}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(customer.id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerManagement; 