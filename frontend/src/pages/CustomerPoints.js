import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerPoints.css';

const CustomerPoints = () => {
    const [settings, setSettings] = useState({
        points_per_amount: 0,
        discount_per_point: 0,
        minimum_points_for_discount: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [isAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
    const [isEditing, setIsEditing] = useState(false);
    const [editedSettings, setEditedSettings] = useState({});

    useEffect(() => {
        fetchPointSettings();
        fetchTransactions();
    }, []);

    const fetchPointSettings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/point-settings',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            setSettings(response.data);
            setEditedSettings(response.data);
        } catch (error) {
            console.error('Error fetching point settings:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/point-transactions',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleSettingChange = (e) => {
        const { name, value } = e.target;
        setEditedSettings(prev => ({
            ...prev,
            [name]: parseFloat(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5000/point-settings', editedSettings, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            setSettings(editedSettings);
            setIsEditing(false);
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Error updating settings');
        }
    };

    return (
        <div className="customer-points">
            <h2>Customer Points System</h2>

            {/* Point Settings Section */}
            <div className="point-settings-section">
                <h3>Point Settings</h3>
                {isAdmin && !isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="edit-btn">
                        Edit Settings
                    </button>
                ) : null}

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="settings-form">
                        <div className="CP-form-group">
                            <label>Points per Amount ($):</label>
                            <input
                                type="number"
                                name="points_per_amount"
                                value={editedSettings.points_per_amount}
                                onChange={handleSettingChange}
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                        <div className="CP-form-group">
                            <label>Discount per Point ($):</label>
                            <input
                                type="number"
                                name="discount_per_point"
                                value={editedSettings.discount_per_point}
                                onChange={handleSettingChange}
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                        <div className="CP-form-group">
                            <label>Minimum Points for Discount:</label>
                            <input
                                type="number"
                                name="minimum_points_for_discount"
                                value={editedSettings.minimum_points_for_discount}
                                onChange={handleSettingChange}
                                min="0"
                                required
                            />
                        </div>
                        <div className="button-group">
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => {
                                setIsEditing(false);
                                setEditedSettings(settings);
                            }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="settings-display">
                        <p>Points earned per $1: {settings.points_per_amount}</p>
                        <p>Discount per point: ${settings.discount_per_point}</p>
                        <p>Minimum points needed: {settings.minimum_points_for_discount}</p>
                    </div>
                )}
            </div>

            {/* Transactions Section */}
            <div className="transactions-section">
                <h3>Recent Point Transactions</h3>
                <div className="transactions-grid">
                    <div className="transaction-header">
                        <span>Date</span>
                        <span>Customer</span>
                        <span>Points Earned</span>
                        <span>Points Redeemed</span>
                        <span>Order Amount</span>
                    </div>
                    {transactions.map(transaction => (
                        <div key={transaction.id} className="transaction-row">
                            <span>{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                            <span>{transaction.customer_name}</span>
                            <span>{transaction.points_earned || 0}</span>
                            <span>{transaction.points_redeemed || 0}</span>
                            <span>${transaction.total_amount}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerPoints; 