import './index.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OrderHistory from './pages/OrderHistory';
import Home from './pages/Home';
import Nopage from './pages/Nopage';
import Layout from './pages/Layout';
import Login from './pages/Login';
import InventoryList from './pages/Inventory Item/InventoryList';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import PurchaseOrders from './pages/PurchaseOrders';
import CustomerPoints from './pages/CustomerPoints';
import CustomerManagement from './pages/CustomerManagement';
import SupplierManagement from './pages/SupplierManagement';
import AddStaff from './pages/AddStaff';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    setIsLoggedIn(!!isAdmin);
    setIsAdmin(isAdmin === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
  };

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <Route path="/" element={<Layout onLogout={handleLogout} />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={
                isAdmin ? <AdminDashboard /> : <Navigate to="/"/>
              } />
              <Route path="inventoryList" element={<InventoryList />} />
              <Route path="orderHistory" element={<OrderHistory />} />
              <Route path="purchase-orders" element={
                isAdmin ? <PurchaseOrders /> : <Navigate to="/"/>
              } />
              <Route path="customer-points" element={<CustomerPoints />} />
              <Route path="customer-management" element={<CustomerManagement />} />
              <Route path="supplier-management" element={<SupplierManagement />} />
              <Route path="add-staff" element={<AddStaff />} />
              <Route path="*" element={<Nopage />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;