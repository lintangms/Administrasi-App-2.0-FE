import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser ,
  FaGamepad,
  FaBook,
  FaSquare,
  FaCheckSquare,
  FaCoffee,
  FaSignOutAlt,
  FaBars,
  FaMoneyBill,
  FaHistory,
  FaCoins,
  FaBookDead,
  FaBookOpen,
  FaMoneyBillAlt,
  FaUncharted,
  FaUnderline,
  FaNotEqual,
  FaBitcoin,
  FaViacoin,
  FaMoneyBillWave,
} from "react-icons/fa";

// Komponen Header
const Header = ({ toggleSidebar, userName }) => {
  return (
    <header
      className="header"
      style={{
        width: "100%",
        background: "#222e3c",
        padding: "10px 20px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1001,
      }}
    >
      <div>
        <button
          className="toggle-btn"
          onClick={toggleSidebar}
          style={{
            color: "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
          }}
        >
          <FaBars />
        </button>
      </div>
      <div></div>
      <div>
        <Link to="/farmer/profile" style={{ color: "#fff", textDecoration: "none" }}>
          <button
            className="btn btn-outline-light"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            <FaUser  />
          </button>
        </Link>
      </div>
    </header>
  );
};

const SidebarFarmer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("Admin");
  const [userRole, setUserRole] = useState(localStorage.getItem("jabatan"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jabatan");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isMobile = window.innerWidth <= 768;

  const sidebarContent = (
    <div className="sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div>
        <a className="sidebar-brand" href="/">
          <span className="align-middle">Harvest</span>
        </a>
        <ul className="sidebar-nav" style={{ padding: 0, listStyle: 'none' }}>
          <li className="sidebar-header">Pages</li>
          {userRole === "farmer" && (
            <>
              <li className={`sidebar-item ${location.pathname === "/farmer/dashboard" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/farmer/dashboard">
                  <FaHome className="align-middle" />{" "}
                  <span className="align-middle">Dashboard</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/farmer/absensi" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/farmer/absensi">
                  <FaBook className="align-middle" />{" "}
                  <span className="align-middle">Absensi</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/farmer/perolehan" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/farmer/perolehan">
                  <FaCoins className="align-middle" />{" "}
                  <span className="align-middle">Perolehan Farmer</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/farmer/unsold" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/farmer/unsold">
                  <FaMoneyBillWave className="align-middle" />{" "}
                  <span className="align-middle">Unsold</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/farmer/kasbon" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/farmer/kasbon">
                  <FaMoneyBillAlt className="align-middle" />{" "}
                  <span className="align-middle">Kasbon</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/farmer/riwayatabsen" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/farmer/riwayatabsen">
                  <FaHistory className="align-middle" />{" "}
                  <span className="align-middle">Riwayat Absensi</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/farmer/riwayatperolehan" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/farmer/riwayatperolehan">
                  <FaHistory className="align-middle" />{" "}
                  <span className="align-middle">Riwayat Perolehan</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/farmer/riwayatkasbon" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/farmer/riwayatkasbon">
                  <FaHistory className="align-middle" />{" "}
                  <span className="align-middle">Riwayat Kasbon</span>
                </Link>
              </li>
            </>
          )}
          {userRole === "booster" && (
            <>
              <li className={`sidebar-item ${location.pathname === "/booster/dashboard" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/booster/dashboard">
                  <FaHome className="align-middle" />{" "}
                  <span className="align-middle">Dashboard</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/booster/absensi" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/booster/absensi">
                  <FaBook className="align-middle" />{" "}
                  <span className="align-middle">Absensi</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/booster/perolehan" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/booster/perolehan">
                  <FaCoins className="align-middle" />{" "}
                  <span className="align-middle">Perolehan booster</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/booster/unsold" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/booster/unsold">
                  <FaMoneyBillWave className="align-middle" />{" "}
                  <span className="align-middle">Unsold</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/booster/kasbon" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/booster/kasbon">
                  <FaMoneyBillAlt className="align-middle" />{" "}
                  <span className="align-middle">Kasbon</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/booster/riwayatabsen" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/booster/riwayatabsen">
                  <FaHistory className="align-middle" />{" "}
                  <span className="align-middle">Riwayat Absensi</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/booster/riwayatperolehan" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/booster/riwayatperolehan">
                  <FaHistory className="align-middle" />{" "}
                  <span className="align-middle">Riwayat Perolehan</span>
                </Link>
              </li>
              <li className={`sidebar-item ${location.pathname === "/booster/riwayatkasbon" ? "active" : ""}`}>
                <Link className="sidebar-link" to="/booster/riwayatkasbon">
                  <FaHistory className="align-middle" />{" "}
                  <span className="align-middle">Riwayat Kasbon</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      {/* Logout button container */}
      <div style={{ 
        marginTop: 'auto', 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '15px 0'
      }}>
        <button 
          className="sidebar-link" 
          onClick={handleLogout} 
          style={{ 
            background: 'none', 
            border: 'none', 
            width: '100%', 
            textAlign: 'left',
            color: '#fff',
            padding: '10px 15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <FaSignOutAlt className="align-middle" />
          <span className="align-middle">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <Header toggleSidebar={toggleSidebar} userName={userName} />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <nav
            id="sidebar"
            className={`sidebar ${isSidebarOpen ? "" : "collapsed"}`}
            style={{
              height: "calc(100vh - 50px)",
              overflowY: "auto",
              position: "fixed",
              top: "50px",
              left: isSidebarOpen ? 0 : "-250px",
              width: "250px",
              background: "#34a40",
              transition: "left 0.3s ease",
              zIndex: 1000,
            }}
          >
            {sidebarContent}
          </nav>
        )}

        {/* Mobile Sidebar */}
        {isMobile && (
          <div
            className="mobile-sidebar"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.7)",
              zIndex: 999,
              display: isSidebarOpen ? "block" : "none",
            }}
            onClick={toggleSidebar}
          >
            <nav
              style={{
                background: "#34a40",
                width: "250px",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                transition: "transform 0.3s ease",
                transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {sidebarContent}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div
          style={{
            marginLeft: isSidebarOpen && !isMobile ? "250px" : "0px",
            transition: "margin-left 0.3s ease",
            padding: "15px",
            width: "100%",
            minHeight: "100vh",
            marginTop: "50px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Tambahkan konten utama Anda di sini */}
        </div>
      </div>
    </div>
  );
};

export default SidebarFarmer;