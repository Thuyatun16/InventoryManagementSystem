import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [usePoints, setUsePoints] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [showPointsMessage, setShowPointsMessage] = useState(false);

    const calculateTotal = () => {
        const sum = cartItems.reduce((acc, item) => acc + Number(item.subtotal), 0);
        setTotal(sum);
        return sum;
    };

    return (
        <CartContext.Provider value={{
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
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 