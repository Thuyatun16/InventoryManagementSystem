import './index.css';
//import HandleBarcodeScanner from './HandleBarcodeScanner';
import { useState } from 'react';
import { createBrowserRouter, RouterProvider, Routes, Route, BrowserRouter } from 'react-router-dom';
import OrderHistory from './pages/OrderHistory';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Nopage from './pages/Nopage';
import Layout from './pages/Layout';
import Login from './pages/Login';
import InventoryList from './InventoryList';
import Register from './pages/Register';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "inventoryList", element: <InventoryList /> },
      { path: "orderHistory", element: <OrderHistory /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <Nopage /> },
    ],
  },
]);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <RouterProvider router={router} />
      )}
    </div>
  );
}

export default App;
