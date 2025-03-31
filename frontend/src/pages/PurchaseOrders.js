import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PurchaseOrders.css';
import loadingIcon from '../Icon/loading.png';

const PurchaseOrders = () => {
    const [orders, setOrders] = useState([]);
    const[loading,setLoading] = useState(true);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [emailStatus, setEmailStatus] = useState('');
    const [newOrder, setNewOrder] = useState({
        item_id: '',
        quantity: '',
        supplier_id: '',
        expected_date: ''
    });
    

    useEffect(() => {
        fetchPurchaseOrders();
        fetchInventoryItems();
        fetchSupplier();
       
    }, []);

    // Existing fetch functions remain the same
    const fetchInventoryItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/read');
            // Sort items by quantity (lowest first)
            const sortedItems = response.data.sort((a, b) => a.quantity - b.quantity);
            setInventoryItems(sortedItems);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };
    
    const fetchSupplier = async () => {
        const response = await axios.get('http://localhost:5000/suppliers',{
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'user-id': localStorage.getItem('userId'),
            'is-admin': localStorage.getItem('isAdmin')
    }});
        setSupplier(response.data);
    };
    
    const fetchPurchaseOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/purchase-orders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching purchase orders:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder(prev => ({
            ...prev,
            [name]: name === 'item_id' ? Number(value) : value
        }));
    };

    // Modified submit handler to include email functionality
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEmailStatus('');
        
        try {
            // First, get the item and supplier details for the email
            const selectedItem = inventoryItems.find(item => item.id === newOrder.item_id);
            const selectedSupplier = supplier.find(sup => sup.id === parseInt(newOrder.supplier_id));
            
            if (!selectedItem || !selectedSupplier) {
                throw new Error('Item or supplier not found');
            }
            
            // Create the order
            const orderResponse = await axios.post('http://localhost:5000/purchase-orders', newOrder, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            
            // Prepare email data
            const emailData = {
                to: selectedSupplier.email,
                subject: `Purchase Order for ${selectedItem.name}`,
                orderDetails: {
                    item: selectedItem.name,
                    quantity: newOrder.quantity,
                    expectedDate: new Date(newOrder.expected_date).toLocaleDateString(),
                    supplier: selectedSupplier.name,
                    orderId: orderResponse.data.orderId || 'New Order'
                }
            };
            
            // Send the email
            await axios.post('http://localhost:5000/send-order-email', emailData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            
            setEmailStatus('Order created and email sent to supplier successfully!');
            setNewOrder({
                item_id: '',
                quantity: '',
                supplier_id: '',
                expected_date: ''
            });
            fetchPurchaseOrders();
        } catch (error) {
            console.error('Error processing order:', error);
            setEmailStatus(`Error: ${error.response?.data?.message || error.message || 'Failed to process order'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderArrived = async (orderId) => {
        try {
            await axios.put(`http://localhost:5000/purchase-orders/${orderId}/receive`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            fetchPurchaseOrders();
            fetchInventoryItems(); // Refresh inventory after receiving order
        } catch (error) {
            console.error('Error marking order as received:', error);
        }
    };

    if (loading) return <div className='loading-container'><div className='loading-spinner'><img src={loadingIcon} alt='loadingIcon'/></div></div>;

    return (
        <div className="purchase-orders">
            <h2>Purchase Orders</h2>

            {/* Create New Order Form */}
            <div className="create-order-form">
                <h3>Create New Purchase Order</h3>
                {emailStatus && <div className={emailStatus.includes('Error') ? 'error-message' : 'success-message'}>{emailStatus}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="PO-form-group">
                        <select
                            name="item_id"
                            value={newOrder.item_id}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Item</option>
                            {inventoryItems.map(item => (
                                <option 
                                    key={item.id} 
                                    value={item.id}
                                    className={item.quantity <= 10 ? 'low-stock' : ''}
                                >
                                    {item.name} (Stock: {item.quantity})
                                    {item.quantity <= 10 ? ' - LOW STOCK!' : ''}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={newOrder.quantity}
                            onChange={handleInputChange}
                            required
                        />
                        <select
                            name="supplier_id"
                            value={newOrder.supplier_id}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Supplier</option>
                            {supplier.map(supplier => (
                                <option 
                                    key={supplier.id} 
                                    value={supplier.id}
                                >
                                    {supplier.name} (Ph: {supplier.phone_number})
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            name="expected_date"
                            value={newOrder.expected_date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Create Order</button>
                </form>
            </div>

            {/* Orders List - remains the same */}
            <div className="orders-list">
                <h3>Current Orders</h3>
                {orders.map(order => (
                    <div key={order.id} className={`order-card ${order.status.toLowerCase()}`}>
                        <div className="order-header">
                            <span className="order-id">Order #{order.id}</span>
                            <span className={`status ${order.status.toLowerCase()}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="order-details">
                            <p><strong>Item:</strong> {order.item_name}</p>
                            <p><strong>Quantity:</strong> {order.quantity}</p>
                            <p><strong>Supplier:</strong> {order.supplier_name}</p>
                            <p><strong>Expected Date:</strong> {new Date(order.expected_date).toLocaleDateString()}</p>
                            <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                        </div>
                        {order.status === 'PENDING' && (
                            <button 
                                className="receive-btn"
                                onClick={() => handleOrderArrived(order.id)}
                            >
                                Mark as Received
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PurchaseOrders;