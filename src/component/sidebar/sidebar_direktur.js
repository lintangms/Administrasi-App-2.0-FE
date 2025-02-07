import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaGamepad,
  FaBook,
  FaSquare,
  FaCheckSquare,
  FaCoffee,
  FaSignOutAlt,
  FaBars,
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
        <Link to="/direktur/profile" style={{ color: "#fff", textDecoration: "none" }}>
          <button
            className="btn btn-outline-light"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            <FaUser />
          </button>
        </Link>
      </div>
    </header>
  );
};

const SidebarDirektur = () => {
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
          <span className="align-middle">HarvestSync</span>
        </a>
        <ul className="sidebar-nav" style={{ padding: 0, listStyle: 'none' }}>
          <li className="sidebar-header">Pages</li>
          <li className={`sidebar-item ${location.pathname === "/direktur/dashboard" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/dashboard">
              <FaHome className="align-middle" />{" "}
              <span className="align-middle">Dashboard</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/jabatandivisi" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/jabatandivisi">
              <FaUser className="align-middle" />{" "}
              <span className="align-middle">Jabatan & Divisi</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/shiftgame" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/shiftgame">
              <FaGamepad className="align-middle" />{" "}
              <span className="align-middle">Shift & Game</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/karyawan" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/karyawan">
              <FaUser className="align-middle" />{" "}
              <span className="align-middle">Karyawan</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/inventaris" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/inventaris">
              <FaBook className="align-middle" />{" "}
              <span className="align-middle">Inventaris</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/scan_absensi" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/scan_absensi">
              <FaSquare className="align-middle" />{" "}
              <span className="align-middle">Scan</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/akun" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/akun">
              <FaCheckSquare className="align-middle" />{" "}
              <span className="align-middle">Akun</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/pengeluaran" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/pengeluaran">
              <FaCoffee className="align-middle" />{" "}
              <span className="align-middle">Pengeluaran</span>
            </Link>
          </li>
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
          {/* Add your main content here */}
        </div>
      </div>
    </div>
  );
};

export default SidebarDirektur;