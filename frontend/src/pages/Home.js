import {useState} from 'react';
import axios from 'axios';
import HandleBarcodeScanner from '../HandleBarcodeScanner';
import './Home.css';

const Home = () => {
    const [sellScan, setSellScan] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(null);

    const handleSellData = async(barcode) => {
        try {
            const response = await axios.get(`http://localhost:5000/sell/${barcode}`);
            const item = response.data;
            
            setCartItems(prev => [...prev, {
                ...item,
                sellQuantity: 1,
                subtotal: Number(item.sellPrice)
            }]);
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

    const calculateTotal = () => {
        const sum = cartItems.reduce((acc, item) => acc + Number(item.subtotal), 0);
        console.log(sum);//debug total
        setTotal(sum);
    }

    const handleCheckout = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('User not found. Please login again.');
                return;
            }

            // Update quantities in database
            for (const item of cartItems) {
                await axios.post('http://localhost:5000/sell', {
                    id: item.id,
                    soldQuantity: item.sellQuantity
                });
            }
            
            // Save order to history with actual user ID
            await axios.post('http://localhost:5000/checkout', {
                userId: parseInt(userId),
                items: cartItems,
                totalAmount: total
            });
            
            setCartItems([]);
            setTotal(0);
            alert('Sale completed successfully!');
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Error processing sale');
        }
    }
    const handleRemoveItem = (index) => {
        setCartItems(prev => prev.filter((_, i) => i !== index));
    }


    return (
        <div className="containerHome">   
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
                    />
                </div>
           
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
                        <button onClick={calculateTotal} className="calculate-btn">
                            Calculate Total
                        </button>
                        {total !== null && (
                            <>
                                <div className="total">Total: ${total}</div>
                                <button onClick={handleCheckout} className="checkout-btn">
                                    Complete Sale
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    ); 
}

export default Home;