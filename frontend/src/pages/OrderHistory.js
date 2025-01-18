import { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userFilter, setUserFilter] = useState('');
    const userId = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    console.log('OrderHistory Debug:');
    console.log('userId:', userId);
    console.log('isAdmin raw value:', localStorage.getItem('isAdmin'));
    console.log('isAdmin parsed value:', isAdmin);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            try {
                const endpoint = isAdmin ? '/orders/all' : `/orders/${userId}`;
                const response = await axios.get(`http://localhost:5000${endpoint}`, {
                    params: { 
                        isAdmin: isAdmin,
                        userFilter: userFilter
                    }
                });
                console.log('response:', response.data);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId, isAdmin, userFilter]);

    const filteredOrders = orders.filter(order => 
        !userFilter || 
        order.customer_name?.toLowerCase().includes(userFilter.toLowerCase())
    );

    if (!userId) return <div>Please login to view order history</div>;
    if (loading) return <div>Loading...</div>;

    return (
        <div className="order-history">
            <h2>{isAdmin ? 'All Orders History' : 'Order History'}</h2>
            
            {isAdmin && (
                <div className="filter-section">
                    <input
                        type="text"
                        placeholder="Filter by customer name..."
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        className="filter-input"
                    />
                </div>
            )}

            <div className="orders-container">
                {filteredOrders.length === 0 ? (
                    <div className="no-orders">No orders found</div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.order_id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <span>Order #{order.order_id}</span>
                                    {isAdmin && (
                                        <span className="customer-name">
                                            Ordered by: {order.customer_name}
                                        </span>
                                    )}
                                    <span className="order-date">
                                        {new Date(order.order_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="order-items">
                                {order.items && order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span>{item.name}</span>
                                        <span>{item.quantity}x</span>
                                        <span>${item.price}</span>
                                        <span>${item.subtotal}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total">
                                Total: ${order.total_amount}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderHistory;