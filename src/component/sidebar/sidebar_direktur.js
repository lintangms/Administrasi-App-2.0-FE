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
          <span className="align-middle">Harvest</span>
        </a>
        <ul className="sidebar-nav" style={{ padding: 0, listStyle: 'none' }}>
          <li className="sidebar-header">Pages</li>
          <li className={`sidebar-item ${location.pathname === "/direktur/dashboard" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/dashboard">
              <FaHome className="align-middle" />{" "}
              <span className="align-middle">Dashboard</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/data_absensi" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/data_absensi">
              <FaCheckCircle className="align-middle" />{" "}
              <span className="align-middle">Data Absensi</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/rekap_absensi" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/rekap_absensi">
              <FaCalendarCheck className="align-middle" />{" "}
              <span className="align-middle">Rekap Absensi</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/data_target" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/data_target">
              <FaBullseye className="align-middle" />{" "}
              <span className="align-middle">Target</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/perolehan_farming" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/perolehan_farming">
              <FaCoins className="align-middle" />{" "}
              <span className="align-middle">Perolehan Farming</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/perolehan_boosting" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/perolehan_boosting">
              <FaDatabase className="align-middle" />{" "}
              <span className="align-middle">Perolehan Boosting</span>
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
              <FaUsers className="align-middle" />{" "}
              <span className="align-middle">Karyawan</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/inventaris" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/inventaris">
              <FaBook className="align-middle" />{" "}
              <span className="align-middle">Inventaris</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/akun" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/akun">
              <FaUser className="align-middle" />{" "}
              <span className="align-middle">Akun</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/pengeluaran" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/pengeluaran">
              <FaMoneyBillWave className="align-middle" />{" "}
              <span className="align-middle">Pengeluaran</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/data_kasbon" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/data_kasbon">
              <FaMoneyBillAlt className="align-middle" />{" "}
              <span className="align-middle">Kasbon</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/data_penjualan" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/data_penjualan">
              <FaSellcast className="align-middle" />{" "}
              <span className="align-middle">Data Penjualan</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/data_gaji" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/data_gaji">
              <FaMoneyCheckAlt className="align-middle" />{" "}
              <span className="align-middle">Data Gaji</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === "/direktur/data_unsold" ? "active" : ""}`}>
            <Link className="sidebar-link" to="/direktur/data_unsold">
              <FaMoneyBillWave className="align-middle" />{" "}
              <span className="align-middle">Data Unsold</span>
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