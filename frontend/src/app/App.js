import "../styles/index.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OrderHistory from "../features/orders/pages/OrderHistory";
import Home from "../features/home/pages/Home";
import Nopage from "../pages/Nopage";
import Layout from "../layouts/Layout";
import Login from "../features/auth/pages/Login";
import InventoryList from "../features/inventory/pages/InventoryList";
import Register from "../features/auth/pages/Register";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard";
import PurchaseOrders from "../features/orders/pages/PurchaseOrders";
import CustomerPoints from "../features/customers/pages/CustomerPoints";
import CustomerManagement from "../features/customers/pages/CustomerManagement";
import SupplierManagement from "../features/suppliers/pages/SupplierManagement";
import AddStaff from "../features/staff/pages/AddStaff";
import { CartProvider } from "../context/CartContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    setIsLoggedIn(!!isAdmin);
    setIsAdmin(isAdmin === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  };

  return (
    <div className="app">
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {!isLoggedIn ? (
              <>
                <Route
                  path="/"
                  element={<Login onLoginSuccess={handleLoginSuccess} />}
                />
                <Route
                  path="/register"
                  element={<Register onLoginSuccess={handleLoginSuccess} />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <Route path="/" element={<Layout onLogout={handleLogout} />}>
                <Route index element={<Home />} />
                <Route
                  path="dashboard"
                  element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
                />
                <Route path="inventoryList" element={<InventoryList />} />
                <Route path="orderHistory" element={<OrderHistory />} />
                <Route
                  path="purchase-orders"
                  element={isAdmin ? <PurchaseOrders /> : <Navigate to="/" />}
                />
                <Route path="customer-points" element={<CustomerPoints />} />
                <Route
                  path="customer-management"
                  element={<CustomerManagement />}
                />
                <Route
                  path="supplier-management"
                  element={<SupplierManagement />}
                />
                <Route path="add-staff" element={<AddStaff />} />
                <Route path="*" element={<Nopage />} />
              </Route>
            )}
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
