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
  FaPeopleArrows,
  FaPeopleCarry,
  FaUsers,
  FaSprayCan,
  FaIdCard,
  FaMoneyCheck,
  FaMoneyBillWave,
  FaMoneyBillAlt,
  FaIdCardAlt,
  FaCheckCircle,
  FaCoins,
  FaSellcast,
  FaMoneyCheckAlt,
  FaDatabase,
  FaBullseye,
  FaCalendarCheck,
} from "react-icons/fa";

// Komponen Header remains the same
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
        <Link to="/manager/profile" style={{ color: "#fff", textDecoration: "none" }}>
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

const SidebarManager = () => {
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
    <div className="sidebar-content" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto',
      position: 'relative',
      paddingBottom: '70px' // Increased padding to account for logout button
    }}>
      <div style={{ flex: '1 0 auto' }}>
        <a className="sidebar-brand" href="/">
          <span className="align-middle">Harvest</span>
        </a>
        <ul className="sidebar-nav" style={{ padding: 0, listStyle: 'none' }}>
          {/* All list items remain the same */}
          <li className="sidebar-header">Pages</li>
          <li className={`sidebar-item ${location.pathname === "/manager/dashboard" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/dashboard">
              <FaHome className="align-middle" />{" "}
              <span className="align-middle">Dashboard</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/scan" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/scan">
              <FaIdCardAlt className="align-middle" />{" "}
              <span className="align-middle">Scan Absensi</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/data_absensi" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/data_absensi">
              <FaCheckCircle className="align-middle" />{" "}
              <span className="align-middle">Data Absensi</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/rekap_absensi" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/rekap_absensi">
              <FaCalendarCheck className="align-middle" />{" "}
              <span className="align-middle">Rekap Absensi</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/data_target" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/data_target">
              <FaBullseye className="align-middle" />{" "}
              <span className="align-middle">Target</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/perolehan_farming" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/perolehan_farming">
              <FaCoins className="align-middle" />{" "}
              <span className="align-middle">Perolehan Farming</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/perolehan_boosting" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/perolehan_boosting">
              <FaDatabase className="align-middle" />{" "}
              <span className="align-middle">Perolehan Boosting</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/jabatandivisi" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/jabatandivisi">
              <FaUser className="align-middle" />{" "}
              <span className="align-middle">Jabatan & Divisi</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/shiftgame" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/shiftgame">
              <FaGamepad className="align-middle" />{" "}
              <span className="align-middle">Shift & Game</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/karyawan" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/karyawan">
              <FaUsers className="align-middle" />{" "}
              <span className="align-middle">Karyawan</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/inventaris" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/inventaris">
              <FaBook className="align-middle" />{" "}
              <span className="align-middle">Inventaris</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/akun" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/akun">
              <FaUser className="align-middle" />{" "}
              <span className="align-middle">Akun</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/pengeluaran" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/pengeluaran">
              <FaMoneyBillWave className="align-middle" />{" "}
              <span className="align-middle">Pengeluaran</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/data_kasbon" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/data_kasbon">
              <FaMoneyBillAlt className="align-middle" />{" "}
              <span className="align-middle">Kasbon</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/data_koin" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/data_koin">
              <FaSellcast className="align-middle" />{" "}
              <span className="align-middle">Jual Koin</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/penjualan" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/penjualan">
              <FaSellcast className="align-middle" />{" "}
              <span className="align-middle">Data Penjualan</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/data_gaji" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/data_gaji">
              <FaMoneyCheckAlt className="align-middle" />{" "}
              <span className="align-middle">Data Gaji</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/manager/data_unsold" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/manager/data_unsold">
              <FaMoneyBillWave className="align-middle" />{" "}
              <span className="align-middle">Data Unsold</span>
            </Link>
          </li>
        </ul>
      </div>
      {/* Updated Logout button container */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        width: '250px',
        background: '#34a40',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        height: '60px', // Fixed height
        display: 'flex',
        alignItems: 'center',
        zIndex: 1002,
      }}>
        <button
          className="sidebar-link"
          onClick={handleLogout}
          style={{
            background: '#34a40',
            border: 'none',
            width: '230px',
            height: '100%',
            textAlign: 'left',
            color: '#fff',
            padding: '0 20px',
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
                display: 'flex',
                flexDirection: 'column'
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

export default SidebarManager;