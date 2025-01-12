import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

const Layout = () => {
  const [activeLink, setActiveLink] = useState(null);

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  return (
    <>
      <nav className="nav-container">
        <Link
          to="/"
          onClick={() => handleLinkClick('home')}
          className={`nav-item ${activeLink === 'home' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/orderHistory"
          onClick={() => handleLinkClick('orderHistory')}
          className={`nav-item ${activeLink === 'orderHistory' ? 'active' : ''}`}
        >
          Order History
        </Link>
        <Link
          to="/contact"
          onClick={() => handleLinkClick('contact')}
          className={`nav-item ${activeLink === 'contact' ? 'active' : ''}`}
        >
          Contact
        </Link>
        <Link
          to="/inventoryList"
          onClick={() => handleLinkClick('inventoryList')}
          className={`nav-item ${activeLink === 'inventoryList' ? 'active' : ''}`}
        >
          Inventory List
        </Link>
      </nav>

      <div className="content-container">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
