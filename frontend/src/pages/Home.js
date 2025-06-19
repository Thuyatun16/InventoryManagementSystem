import { useState, useEffect } from 'react';
import axios from 'axios';
import HandleBarcodeScanner from './Inventory Item/HandleBarcodeScanner';
import './Home.css';
import 'animate.css';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [sellScan, setSellScan] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [settings, setSettings] = useState({
        minimum_points_for_discount: 0
    });
    const {
        cartItems,
        setCartItems,
        total,
        setTotal,
        customer,
        setCustomer,
        usePoints,
        setUsePoints,
        pointsEarned,
        setPointsEarned,
        showPointsMessage,
        setShowPointsMessage,
        calculateTotal
    } = useCart();

    useEffect(() => {
        fetchPointSettings();
        if (showPointsMessage) {
            setSellScan('');
            setCustomerPhone('');
            setCustomer(null);
            setUsePoints(false);
            setShowPointsMessage(false);
        }
    }, [showPointsMessage]);

    // Add useEffect to auto-calculate total when cart items change
    useEffect(() => {
        calculateTotal();
    }, [cartItems, calculateTotal]);
    const fetchPointSettings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/point-settings', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            console.log(response.data,'This is setting response');
            setSettings(response.data);
        } catch (error) {
            console.error('Error fetching point settings:', error);
        }
    }; 

    const handleSellData = async (barcode) => {
        try {
            const response = await axios.get(`http://localhost:5000/sell/${barcode}`);
            const item = response.data;

            setCartItems(prev => {
                // Check if item already exists in cart
                const existingItemIndex = prev.findIndex(cartItem => cartItem.id === item.id);
                
                if (existingItemIndex !== -1) {
                    // Item exists, create new array with updated quantity
                    const newItems = [...prev];
                    const newQuantity = newItems[existingItemIndex].sellQuantity + 1;
                    
                    // Make sure we don't exceed available stock
                    if (newQuantity <= item.quantity) {
                        newItems[existingItemIndex].sellQuantity = newQuantity;
                        newItems[existingItemIndex].subtotal = newQuantity * Number(item.sellPrice);
                    } else {
                        alert('Cannot add more items than available in stock');
                    }
                    return newItems;
                } else {
                    // Item doesn't exist, add new item
                    return [...prev, {
                        ...item,
                        sellQuantity: 1,
                        subtotal: Number(item.sellPrice)
                    }];
                }
            });
            
            setSellScan('');
        } catch (error) {
            console.error('Error fetching item:', error);
            alert('Item not found');
        }
    }

    const handleQuantityChange = (index, value) => {
        setCartItems(prev => {
            const newItems = [...prev];
            const quantity = parseInt(value);
            const price = Number(newItems[index].sellPrice);
            newItems[index].sellQuantity = quantity;
            newItems[index].subtotal = quantity * price;
            return newItems;
        });
    }

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/customers/find-or-create`, {
                phone_number: customerPhone
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin')
                }
            });
            setCustomer(response.data);
            setCustomerPhone('');
        } catch (error) {
            console.error('Error finding/creating customer:', error);
            alert(error.message);
        }
    };

    const handleCheckout = async () => {
        try {
            let discount = 0;
            let final_amount = total;
            const orderData = {
                items: cartItems.map(item => ({
                    id: item.id,
                    quantity: item.sellQuantity,
                    price: Number(item.sellPrice),
                    subtotal: item.subtotal
                })),
                total_amount: calculateTotal(),
                customer_id: customer? customer.id : null,
                use_points: customer && usePoints,
                userId: localStorage.getItem('userId')
            };
            for (const item of cartItems) {
                    const res =  await axios.post('http://localhost:5000/sell', {
                    id: item.id,
                    soldQuantity: item.sellQuantity
                });
                console.log (res.data.message);
            }
            
            const response = await axios.post('http://localhost:5000/checkout', orderData);
            // console.log(cartItems, 'This is cart items');
            // console.log(response.data, 'This is response data');
            if (customer && usePoints && response.data.discount > 0) {
                discount = response.data.discount;
                final_amount = total - discount;
            }
    
            if (customer && response.data.points_earned) {
                setPointsEarned(response.data.points_earned);
                setShowPointsMessage(true);
            }
    
            // Clear cart and reset total
            setCartItems([]);
            setTotal(0);
    
            // Display appropriate success message
            if (customer && pointsEarned > 0) {
                alert(`Sale completed successfully! Discount applied: $${discount}. ${customer.name} earned ${pointsEarned} points from this purchase!`);
            } else {
                alert(`Sale completed successfully! Discount applied: $${discount}. The Total Amount is $${final_amount}`);
            }
    
            // Update analytics
           const updateResponse =  await axios.post('http://localhost:5000/update-analytics', {
                orderId: response.data.orderId
            });
             console.log(updateResponse.data, 'This is update response data');
        } catch (error) {
            console.error('Error during checkout:', error);
            alert(error.response?.data?.message || 'An error occurred during checkout');
        }
        
    };

    const handleRemoveItem = (index) => {
        setCartItems(prev => prev.filter((_, i) => i !== index));
    }
    return (
        <div className="containerHome">
            <div className="main-content-wrapper">
                {/* Left Section - Scanner and Customer */}
                <div className="left-section">
                    <div className="scan-container">
                        <div className="manual-input">
                            <input
                                type="text"
                                value={sellScan}
                                onChange={(e) => setSellScan(e.target.value)}
                                placeholder="Enter or scan barcode"
                                className="barcode-input"
                            />
                            <button
                                onClick={() => handleSellData(sellScan)}
                                className="submit-btn"
                                disabled={!sellScan}
                            >
                                Add Item
                            </button>
                        </div>
                        <div className="scanner-divider">
                            <span>Scan Barcode</span>
                        </div>
                        <HandleBarcodeScanner
                            setSellScan={setSellScan}
                             sellData={handleSellData} 
                             className = "home-barcode-scanner"
                             mode = "button"
                        />
                    </div>

                    <div className="customer-section">
                        <form onSubmit={handlePhoneSubmit}>
                            <input
                                type="tel"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                placeholder="Enter customer phone"
                                pattern="[0-9]{6,15}"
                            />
                            <button type="submit">Find Customer</button>
                        </form>
                    </div>

                    {customer && (
                        <div className="customer-info">
                            <p className='customer-name'>Name :{customer.name}</p>
                            <p className = 'available-points'>Points Available: {customer.points}</p>
                            {customer.points >= settings.minimum_points_for_discount && (
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={usePoints}
                                        onChange={(e) => setUsePoints(e.target.checked)}
                                    />
                                    Use points for discount
                                </label>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Section - Shopping Cart */}
                <div className="right-section">
                    <div className="cart-container">
                        <h2>Shopping Cart</h2>
                        <div className="cart-items">
                            <div className="cart-item-header">
                                <span>Product</span>
                                <span>Price</span>
                                <span>Quantity</span>
                                <span>Subtotal</span>
                                <span></span>
                            </div>
                            {cartItems.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <div className="item-details">
                                        <span>{item.name}</span>
                                        <span>SKU: {item.barcode}</span>
                                    </div>
                                    <span>${item.sellPrice}</span>
                                    <div className="quantity-control">
                                        <input
                                            type="number"
                                            min="1"
                                            max={item.quantity}
                                            value={item.sellQuantity}
                                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        />
                                    </div>
                                    <span>${item.subtotal}</span>
                                    <button onClick={() => handleRemoveItem(index)} className="remove-btn">
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        {cartItems.length > 0 && (
                            <div className="cart-actions">
                                <div className="total">Total: ${total}</div>
                                <button onClick={handleCheckout} className="checkout-btn">
                                    Complete Sale
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showPointsMessage && pointsEarned > 0 && (
                <div className="points-earned">
                    <p>{customer?.name} earned {pointsEarned} points from this purchase!</p>
                </div>
            )}
        </div>
    );
}

export default Home;
