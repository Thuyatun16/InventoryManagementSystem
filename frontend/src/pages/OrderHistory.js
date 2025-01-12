import { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    console.log('localStorage isAdmin:', localStorage.getItem('isAdmin'));
    console.log('isAdmin value:', isAdmin);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            try {
                // Use different endpoint based on admin status
                const endpoint = isAdmin ? '/orders/all' : `/orders/${userId}`;
                const response = await axios.get(`http://localhost:5000${endpoint}`);
                console.log('response:', response.data);//debug
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId, isAdmin]);

    if (!userId) return <div>Please login to view order history</div>;
    if (loading) return <div>Loading...</div>;

    return (
        <div className="order-history">
            <h2>{isAdmin ? 'All Orders History' : 'Order History'}</h2>
            <div className="orders-container">
                {orders.length === 0 ? (
                    <div className="no-orders">No orders found</div>
                ) : (
                    orders.map((order) => (
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