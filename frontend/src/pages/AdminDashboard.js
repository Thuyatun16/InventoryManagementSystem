    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';
    import loadingIcon from '../Icon/loading.png';
    import {
        XAxis, YAxis, CartesianGrid, Tooltip, Legend,
        BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell,
        AreaChart, Area
    } from 'recharts';
    import './AdminDashboard.css';


    const AdminDashboard = () => {
        const [analytics, setAnalytics] = useState({
            productAnalytics: [],
            monthlyProfits: [],
            topProducts: [],
            salesSummary: {
              totalRevenue: 0,
              activeProducts: 0,
              revenueGrowth: 0,
              orderGrowth: 0,
              totalOrders: 0,
              averageOrderValue: 0
            },
            recentOrders: [],
            inventoryAlerts: []
          });
        const [loading, setLoading] = useState(true);
        const [timeRange, setTimeRange] = useState('month');
        const navigate = useNavigate();
        const isAdmin = localStorage.getItem('isAdmin') === 'true';

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

        useEffect(() => {

            if (!isAdmin) {
                navigate('/');
                return;
            }

            const fetchAnalytics = async () => {
                try {
                    const data = await axios.get(
                        `http://localhost:5000/analytics?timeRange=${timeRange}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                'user-id': localStorage.getItem('userId'),
                                'is-admin': localStorage.getItem('isAdmin')
                            }
                        }
                    );

                    setAnalytics(data.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching analytics:', error);
                    setLoading(false);
                }
            };

            fetchAnalytics();
        }, [isAdmin, navigate, timeRange]);
        console.log('This is analytics data result', analytics);
        const formattedTopProducts = analytics.topProducts?.map(item => ({
            ...item,
            sales: Number(item.sales) // Convert sales to a number
        }));
        const mergedData = React.useMemo(() => {
            // Check if both datasets exist and have the same length
            if (
              !analytics.monthlyProfits?.length ||
              !analytics.salesSummary?.totalRevenue // Assuming salesSummary has totalRevenue
            ) {
              return [];
            }
          
            return analytics.monthlyProfits.map((monthProfit, index) => ({
              month: monthProfit.month,
              total_profit: monthProfit.total_profit,
              // Use salesSummary.totalRevenue if it's a single value
              totalRevenue: analytics.salesSummary.totalRevenue
            }));
          }, [analytics.monthlyProfits, analytics.salesSummary]);

        if (loading) return <div className = 'loading-container'><div className="loading-spinner"><img src={loadingIcon} alt='LoadingIcon'/></div></div>;if (loading) return <div className = 'loading-container'><div className="loading-spinner"><img src={loadingIcon} alt='LoadingIcon'/></div></div>;

        return (
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <h1>Dashboard Overview</h1>
                    <div className="time-filter">
                        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="year">Last Year</option>
                        </select>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="summary-cards">
                    <div className="summary-card">
                        <h3>Total Revenue</h3>
                        <p className="amount">${analytics.salesSummary.totalRevenue}</p>
                        <span className="trend positive">+{analytics.salesSummary.revenueGrowth}%</span>
                    </div>
                    <div className="summary-card">
                        <h3>Total Orders</h3>
                        <p className="amount">{analytics.salesSummary.totalOrders}</p>
                        <span className="trend positive">+{analytics.salesSummary.orderGrowth}%</span>
                    </div>
                    <div className="summary-card">
                        <h3>Average Order Value</h3>
                        <p className="amount">${analytics.salesSummary.averageOrderValue}</p>
                    </div>
                    <div className="summary-card">
                        <h3>Active Products</h3>
                        <p className="amount">{analytics.salesSummary.activeProducts}</p>
                    </div>
                </div>

                {/* Revenue Trend */}
                <div className="chart-container">
                    <h2>Revenue Trends</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={mergedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="totalRevenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                            <Area
        type="monotone"
        dataKey="total_profit"
        stroke={mergedData.total_profit < 0 ? '#ff4d4f' : '#82ca9d'}
        fill={mergedData.total_profit < 0 ? '#ff4d4f' : '#82ca9d'}
        fillOpacity={0.3}
    />

                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="dashboard-grid">
                    {/* Top Products */}
                    <div className="chart-container">
                        <h2>Top Selling Products</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={formattedTopProducts}
                                    dataKey="sales"
                                    nameKey="item_name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {analytics.topProducts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name, props) => [`${value} sales`, `Product: ${props.payload.item_name}`]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Inventory Levels */}
                    <div className="chart-container">
                        <h2>Current Stock Levels</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.productAnalytics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="item_name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="stock_level" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders & Alerts Section */}
                <div className="dashboard-grid">

                    <div className="inventory-alerts">
                        <h2>Inventory Alerts</h2>
                        <div className="alerts-container">
                            {analytics.inventoryAlerts.map(alert => (
                                <div key={alert.id} className={`alert-item ${alert.type}`}>
                                    <span className="alert-icon">⚠️</span>
                                    <div className="alert-content">
                                        <h4>{alert.product_name}</h4>
                                        <p>{alert.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    export default AdminDashboard;