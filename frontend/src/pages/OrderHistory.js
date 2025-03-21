import { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderHistory.css';
import loadingIcon from '../Icon/loading.png';
const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        userFilter: '',
        orderId: '',
        startDate: '',
        endDate: ''
    });
    const userId = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    // console.log('OrderHistory Debug:');
    // console.log('userId:', userId);
    // console.log('isAdmin raw value:', localStorage.getItem('isAdmin'));
    // console.log('isAdmin parsed value:', isAdmin);

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
                        ...filters
                    }
                });
                //console.log('response:', response.data);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId, isAdmin, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            userFilter: '',
            orderId: '',
            startDate: '',
            endDate: ''
        });
    };

    const filteredOrders = orders.filter(order => {
        const matchesName = !filters.userFilter || 
            order.customer_name?.toLowerCase().includes(filters.userFilter.toLowerCase());
        
        const matchesOrderId = !filters.orderId ||
            order.order_id.toString().includes(filters.orderId);
        
        const orderDate = new Date(order.order_date);
        const matchesStartDate = !filters.startDate || 
            orderDate >= new Date(filters.startDate);
        const matchesEndDate = !filters.endDate || 
            orderDate <= new Date(filters.endDate);

        return matchesName && matchesOrderId && matchesStartDate && matchesEndDate;
    });
 
    if (!userId) return <div>Please login to view order history</div>;
    if (loading) return <div className='loading-container'><div className='loading-spinner'><img src={loadingIcon} alt='loadingIcon'/></div></div>;

    return (
        <div className="order-history">
            <h2>{isAdmin ? 'All Orders History' : 'Order History'}</h2>
            
            {isAdmin && (
                <div className="filter-section">
                    <div className="filter-group">
                        <input
                            type="text"
                            name="userFilter"
                            placeholder="Filter by customer name..."
                            value={filters.userFilter}
                            onChange={handleFilterChange}
                            className="filter-input"
                        />
                        <input
                            type="text"
                            name="orderId"
                            placeholder="Filter by order ID..."
                            value={filters.orderId}
                            onChange={handleFilterChange}
                            className="filter-input"
                        />
                    </div>
                    <div className="filter-group">
                        <div className="date-filter">
                            <label>Start Date:</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="filter-input"
                            />
                        </div>
                        <div className="date-filter">
                            <label>End Date:</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="filter-input"
                            />
                        </div>
                    </div>
                    <button onClick={clearFilters} className="clear-filters-btn">
                        Clear Filters
                    </button>
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
                                <span>Total: ${order.total_amount}</span>
                                <span>Discount: ${order.discount}</span>
                                <span>Final Amount: ${order.final_amount}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderHistory;