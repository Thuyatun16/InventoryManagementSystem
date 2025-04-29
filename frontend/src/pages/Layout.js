import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import './Layout.css';
import logoIcon from '../Icon/Logo.png';
import homeIcon from '../Icon/home.png';
import dashboardIcon from '../Icon/dashboard.png';
import orderIcon from '../Icon/history.png';
import inventoryIcon from '../Icon/inventory.png';
import pointsIcon from '../Icon/points.png';
import customerIcon from '../Icon/customer (1).png';
import supplierIcon from '../Icon/delivery.png';
import logoutIcon from '../Icon/logout.png';
import purchaseIcon from '../Icon/checklist.png';
import staffIcon from '../Icon/staff.png';


const Layout = ({ onLogout }) => {
    const [activeLink, setActiveLink] = useState(null);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const isAdmin = localStorage.getItem('isAdmin')==='true';
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/')[1] || 'home';
        setActiveLink(path);
    }, [location]);

    const handleLinkClick = (linkName) => {
        setActiveLink(linkName);
    };

    return (
        <div className="layout-container">
            <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header ">
                    <div className="logo-container">
                        <Link to="/" className="logo">
                            <img src={logoIcon} alt="Logo Icon" />
                            <span className="logo-text">IMSfOS</span>
                        </Link>
                    </div>
                    <button 
                        className="collapse-btn"
                        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                    >
                        {isSidebarCollapsed ? '→' : '←'}
                    </button>
                </div>

                <div className="sidebar-links">
                    <Link
                        to="/"
                        onClick={() => handleLinkClick('home')}
                        className={`sidebar-item ${activeLink === 'home' ? 'active' : ''}`}
                    >
                        <img src={homeIcon} alt="Home icon" />
                        <span>Home</span>
                    </Link>

                     
                       {isAdmin &&<Link
                            to="/dashboard"
                            onClick={() => handleLinkClick('dashboard')}
                            className={`sidebar-item ${activeLink === 'dashboard' ? 'active' : ''}`}
                        >
                            <img src={dashboardIcon} alt="Dashboard Icon" />
                            <span>Dashboard</span>
                        </Link>
                       }

                    <Link
                        to="/orderHistory"
                        onClick={() => handleLinkClick('orderHistory')}
                        className={`sidebar-item ${activeLink === 'orderHistory' ? 'active' : ''}`}
                    >
                        <img src={orderIcon} alt="Order Icon" />
                        <span>Sale History</span>
                    </Link>

                    <Link
                        to="/inventoryList"
                        onClick={() => handleLinkClick('inventoryList')}
                        className={`sidebar-item ${activeLink === 'inventoryList' ? 'active' : ''}`}
                    >
                        <img src={inventoryIcon} alt="Inventory Icon" />
                        <span>Inventory</span>
                    </Link>

                    {isAdmin && 
                        <Link
                            to="/purchase-orders"
                            onClick={() => handleLinkClick('purchase-orders')}
                            className={`sidebar-item ${activeLink === 'purchase-orders' ? 'active' : ''}`}
                        >
                            <img src={purchaseIcon} alt="Purchase Icon" />
                            <span>Purchase Orders</span>
                        </Link>
                    }

                    <Link
                        to="/customer-points"
                        onClick={() => handleLinkClick('customer-points')}
                        className={`sidebar-item ${activeLink === 'customer-points' ? 'active' : ''}`}
                    >
                        <img src={pointsIcon} alt="Points Icon" />
                        <span>Customer Points</span>
                    </Link>

                    <Link
                        to="/customer-management"
                        onClick={() => handleLinkClick('customer-management')}
                        className={`sidebar-item ${activeLink === 'customer-management' ? 'active' : ''}`}
                    >
                        <img src={customerIcon} alt="Customer Icon" />
                        <span>Customers</span>
                    </Link>
                   {isAdmin && <Link
                        to="/supplier-management"
                        onClick={() => handleLinkClick('supplier-management')}
                        className={`sidebar-item ${activeLink === 'supplier-management' ? 'active' : ''}`}
                    >
                        <img src={supplierIcon} alt="Supplier" />
                        <span>Suppliers</span>
                    </Link>
                    }
                   {isAdmin&& <Link
                        to="/add-staff"
                        onClick={() => handleLinkClick('add-staff')}
                        className={`sidebar-item ${activeLink === 'add-staff' ? 'active' : ''}`}
                    >
                        <img src={staffIcon} alt="Staff" />
                        <span>Staffs</span>
                    </Link>
}
                </div>

                <div className="sidebar-footer">
                    
                    <button 
                        onClick={onLogout} 
                        className="sidebar-item logout-item"
                    >
                        <img src={logoutIcon} alt="Logout Icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
                <Outlet context={{ onLogout }} />
            </div>
        </div>
    );
};

export default Layout;