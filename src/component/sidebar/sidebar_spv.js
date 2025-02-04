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
  FaUserCircle, // Import ikon untuk profil
} from "react-icons/fa";

// Komponen Header
const Header = ({ toggleSidebar, userName }) => {
  return (
    <header
      className="header"
      style={{
        width: "100%",
        background: "#222e3c", // Warna header
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
      <div>
      </div>
      <div>
        <Link to="/spv/profile" style={{ color: "#fff", textDecoration: "none" }}>
          <button
            className="btn btn-outline-light"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            <FaUser Circle />
          </button>
        </Link>
      </div>
    </header>
  );
};

const SidebarSPV = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Set default sidebar state to open
  const [userName, setUserName] = useState("Admin"); // Set default username
  const [userRole, setUserRole] = useState(localStorage.getItem("jabatan")); // Ambil jabatan dari localStorage

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jabatan");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} userName={userName} />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar for Desktop */}
        {!isMobile && (
          <nav
            id="sidebar"
            className={`sidebar ${isSidebarOpen ? "" : "collapsed"}`}
            style={{
              height: "100vh",
              overflowY: "auto",
              position: "fixed",
              top: "50px", // Posisi sidebar di bawah header
              left: isSidebarOpen ? 0 : "-250px", // Sidebar muncul dari kiri
              width: "250px",
              background: "#34a40", // Warna sidebar
              transition: "left 0.3s ease", // Animation for sidebar
              zIndex: 1000,
            }}
          >
            <div className="sidebar-content">
              <a className="sidebar-brand" href="/">
                <span className="align-middle">HarvestSync</span>
              </a>
              <ul className="sidebar-nav">
                <li className="sidebar-header">Pages</li>
                <li className={`sidebar-item ${location.pathname === "/spv/dashboard" ? "active" : ""}`}>
                  <Link className="sidebar-link" to="/spv/dashboard">
                    <FaHome className="align-middle" />{" "}
                    <span className="align-middle">Dashboard</span>
                  </Link>
                </li>
                <li className={`sidebar-item ${location.pathname === "/spv/jabatandivisi" ? "active" : ""}`}>
                  <Link className="sidebar-link" to="/spv/jabatandivisi">
                    <FaUser className="align-middle" />{" "}
                    <span className="align-middle">Jabatan & Divisi</span>
                  </Link>
                </li>
                <li className={`sidebar-item ${location.pathname === "/spv/shiftgame" ? "active" : ""}`}>
                  <Link className="sidebar-link" to="/spv/shiftgame">
                    <FaGamepad className="align-middle" />{" "}
                    <span className="align-middle">Shift & Game</span>
                  </Link>
                </li>
                <li className={`sidebar-item ${location.pathname === "/spv/karyawan" ? "active" : ""}`}>
                  <Link className="sidebar-link" to="/spv/karyawan">
                    <FaUser className="align-middle" />{" "}
                    <span className="align-middle">Karyawan</span>
                  </Link>
                </li>
                <li className={`sidebar-item ${location.pathname === "/blank" ? "active" : ""}`}>
                  <Link className="sidebar-link" to="/blank">
                    <FaBook className="align-middle" />{" "}
                    <span className="align-middle">Blank</span>
                  </Link>
                </li>
                <li className="sidebar-header">Tools & Components</li>
                <li className={`sidebar-item ${location.pathname === "/buttons" ? "active" : ""}`}>
                  <Link className="sidebar-link" to="/buttons">
                    <FaSquare className="align-middle" />{" "}
                    <span className="align-middle">Buttons</span>
                  </Link>
                </li>
                <li className={`sidebar-item ${location.pathname === "/forms" ? "active" : ""}`}>
                  <Link className="sidebar-link" to="/forms">
                    <FaCheckSquare className="align-middle" />{" "}
                    <span className="align-middle">Forms</span>
                  </Link>
                </li>
                <li className="sidebar-header">Plugins & Addons</li>
                <li className={`sidebar-item ${location.pathname === "/charts" ? "active" : ""}`}>
                  <Link className="sidebar-link" to="/charts">
                    <FaCoffee className="align-middle" />{" "}
                    <span className="align-middle">Charts</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" to="#" onClick={handleLogout}>
                    <FaSignOutAlt className="align-middle" />{" "}
                    <span className="align-middle">Logout</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        )}

        {/* Sidebar for Mobile */}
        {isMobile && (
          <>
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
                  transition: "transform 0.3s ease", // Animation for mobile sidebar
                  transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
                }}
              >
                <div className="sidebar-content">
                  <a className="sidebar-brand" href="/">
                    <span className="align-middle">HarvestSync</span>
                  </a>
                  <ul className="sidebar-nav">
                    <li className="sidebar-header">Pages</li>
                    <li className={`sidebar-item ${location.pathname === "/spv/dashboard" ? "active" : ""}`}>
                      <Link className="sidebar-link" to="/spv/dashboard">
                        <FaHome className="align-middle" />{" "}
                        <span className="align-middle">Dashboard</span>
                      </Link>
                    </li>
                    <li className={`sidebar-item ${location.pathname === "/spv/jabatandivisi" ? "active" : ""}`}>
                      <Link className="sidebar-link" to="/spv/jabatandivisi">
                        <FaUser className="align-middle" />{" "}
                        <span className="align-middle">Jabatan & Divisi</span>
                      </Link>
                    </li>
                    <li className={`sidebar-item ${location.pathname === "/spv/shiftgame" ? "active" : ""}`}>
                      <Link className="sidebar-link" to="/spv/shiftgame">
                        <FaGamepad className="align-middle" />{" "}
                        <span className="align-middle">Shift & Game</span>
                      </Link>
                    </li>
                    <li className={`sidebar-item ${location.pathname === "/spv/karyawan" ? "active" : ""}`}>
                      <Link className="sidebar-link" to="/spv/karyawan">
                        <FaUser className="align-middle" />{" "}
                        <span className="align-middle">Karyawan</span>
                      </Link>
                    </li>
                    <li className={`sidebar-item ${location.pathname === "/sign-up" ? "active" : ""}`}>
                      <Link className="sidebar-link" to="/sign-up">
                        <FaUser className="align-middle" />{" "}
                        <span className="align-middle">Sign Up</span>
                      </Link>
                    </li>
                    <li className={`sidebar-item ${location.pathname === "/blank" ? "active" : ""}`}>
                      <Link className="sidebar-link" to="/blank">
                        <FaBook className="align-middle" />{" "}
                        <span className="align-middle">Blank</span>
                      </Link>
                    </li>
                    <li className="sidebar-header">Tools & Components</li>
                    <li className={`sidebar-item ${location.pathname === "/buttons" ? "active" : ""}`}>
                      <Link className="sidebar-link" to="/buttons">
                        <FaSquare className="align-middle" />{" "}
                        <span className="align-middle">Buttons</span>
                      </Link>
                    </li>
                    <li className={`sidebar-item ${location.pathname === "/forms" ? "active" : ""}`}>
                      <Link className="sidebar-link" to="/forms">
                        <FaCheckSquare className="align-middle" />{" "}
                        <span className="align-middle">Forms</span>
                      </Link>
                    </li>
                    <li className="sidebar-header">Plugins & Addons</li>
                    <li className={`sidebar-item ${location.pathname === "/charts" ? "active" : ""}`}>
                      <Link className="sidebar-link" to="/charts">
                        <FaCoffee className="align-middle" />{" "}
                        <span className="align-middle">Charts</span>
                      </Link>
                    </li>
                    <li className="sidebar-item">
                      <button className="sidebar-link" onClick={handleLogout}>
                        <FaSignOutAlt className="align-middle" />{" "}
                        <span className="align-middle">Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </>
        )}

        {/* Konten Utama */}
        <div
          style={{
            marginLeft: isSidebarOpen && !isMobile ? "250px" : "0px", // Konten tidak tergeser
            transition: "margin-left 0.3s ease", // Animation for main content
            padding: "15px",
            width: "100%",
            minHeight: "100vh",
            marginTop: "50px", // Pastikan konten mulai di bawah header
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

export default SidebarSPV;