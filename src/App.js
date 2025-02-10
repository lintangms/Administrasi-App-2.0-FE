import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import SidebarManager from "./component/sidebar/sidebar_manager";
import SidebarFarmer from "./component/sidebar/sidebar_farmer";
import SidebarDirektur from "./component/sidebar/sidebar_direktur";
import Login from "./page/login/login";
import DashboardManager from "./page/manager/dashboard/dashboardmanager";
import DashboardSPV from "./page/spv/dashboard/dashboard";
import DashboardFarmer from "./page/farmer/dashboard/dashboard";
import DashboardDirektur from "./page/direktur/dashboard/dashboard";
import Jabatan_Divisi from "./page/manager/jabatan_divisi/jabatan_divisi";
import Shift_Game from "./page/manager/shift_game/shift_game";
import AbsensiFarmer from "./page/farmer/absensi/absensi";
import Karyawan from "./page/manager/karyawan/karyawan";
import DetailKaryawan from "./page/manager/karyawan/detail_karyawan";
import DashboardBooster from "./page/booster/dashboard/dashboard";
import AbsensiBooster from "./page/booster/absensi/absensi";
import PerolehanBoosting from "./page/booster/perolehan/perolehan";
import PerolehanFarming from "./page/farmer/perolehan/perolehan";
import Profile from "./page/farmer/profile/profile";
import SidebarSPV from "./component/sidebar/sidebar_spv";
import Jabatan_Divisi_Direktur from "./page/direktur/jabatan_divisi/jabatan_divisi";
import Shift_Game_Direktur from "./page/direktur/shift_game/shift_game";
import Karyawan_Direktur from "./page/direktur/karyawan/karyawan";
import Inventaris from "./page/manager/inventaris/inventaris";
import Farming from "./page/direktur/perolehan/farming";
import Boosting from "./page/direktur/perolehan/boosting";
import ScanQR from "./page/manager/scan/scan";
import Akun from "./page/manager/akun/akun";
import Akun_Direktur from "./page/direktur/akun/akun";
import Pengeluaran from "./page/manager/pengeluaran/pengeluaran";
import Pengeluaran_Direktur from "./page/direktur/pengeluaran/pengeluaran";
import Kasbon from "./page/farmer/kasbon/kasbon";
import RiwayatFarming from "./page/farmer/riwayat/riwayatperolehan";
import RiwayatBoosting from "./page/booster/riwayatperolehan/riwayatbooster";
import AbsensiScan from "./page/manager/scan/absensiscan";
import RiwayatAbsen from "./page/farmer/riwayatabsen/riwayatabsensi";
import RiwayatKasbon from "./page/farmer/riwayatkasbon/riwayatkasbon";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [jabatan, setJabatan] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedJabatan = localStorage.getItem("jabatan");

    // Pengecualian untuk halaman scan dan absensi scan
    if (location.pathname === "/scan_absensi" && storedJabatan !== "manager" && storedJabatan !== "spv") {
      navigate("/login");
      return;
    }

    if ((location.pathname === "/scan" || location.pathname === "/scan_absensi") || (token && storedJabatan)) {
      if (token && storedJabatan) {
        setIsLoggedIn(true);
        setJabatan(storedJabatan);
      }
    } else if (location.pathname !== "/login" && location.pathname !== "/scan_absensi" && location.pathname !== "/scan") {
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  const handleLoginSuccess = (userjabatan) => {
    setJabatan(userjabatan);
    setIsLoggedIn(true);
    localStorage.setItem("jabatan", userjabatan);
    navigate(`/${userjabatan}/dashboard`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "row",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {isLoggedIn && location.pathname !== "/login" && (
        <>
          {jabatan === "manager" && (
            <SidebarManager
              jabatan={jabatan}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
            />
          )}
          {jabatan === "spv" && (
            <SidebarSPV
              jabatan={jabatan}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
            />
          )}
          {jabatan === "farmer" && (
            <SidebarFarmer
              jabatan={jabatan}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
            />
          )}
          {jabatan === "booster" && (
            <SidebarFarmer
              jabatan={jabatan}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
            />
          )}
          {jabatan === "direktur" && (
            <SidebarDirektur
              jabatan={jabatan}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
            />
          )}
        </>
      )}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          marginTop: location.pathname === "/login" ? "0" : "50px",
          marginLeft: "-20px",
          transition: "all 0.3s ease",
        }}
      >
        <Routes>
          <Route path="/scan_absensi" element={<AbsensiScan />} />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/manager/dashboard" element={<DashboardManager />} />
          <Route path="/manager/scan" element={<ScanQR />} />
          <Route path="/manager/jabatandivisi" element={<Jabatan_Divisi />} />
          <Route path="/manager/shiftgame" element={<Shift_Game />} />
          <Route path="/manager/karyawan" element={<Karyawan />} />
          <Route path="/manager/detail_karyawan/:id" element={<DetailKaryawan />} />
          <Route path="/manager/profile" element={<Profile />} />
          <Route path="/manager/inventaris" element={<Inventaris />} />
          <Route path="/manager/akun" element={<Akun />} />
          <Route path="/manager/pengeluaran" element={<Pengeluaran />} />
          <Route path="/manager/perolehan_farming" element={<Farming />} />
          <Route path="/manager/perolehan_boosting" element={<Boosting />} />

          <Route path="/spv/dashboard" element={<DashboardSPV />} />
          <Route path="/spv/scan" element={<ScanQR />} />
          <Route path="/spv/jabatandivisi" element={<Jabatan_Divisi />} />
          <Route path="/spv/shiftgame" element={<Shift_Game />} />
          <Route path="/spv/karyawan" element={<Karyawan />} />
          <Route path="/spv/detail_karyawan/:id" element={<DetailKaryawan />} />
          <Route path="/spv/profile" element={<Profile />} />
          <Route path="/spv/inventaris" element={<Inventaris />} />
          <Route path="/spv/akun" element={<Akun />} />
          <Route path="/spv/pengeluaran" element={<Pengeluaran />} />
          <Route path="/spv/perolehan_farming" element={<Farming />} />
          <Route path="/spv/perolehan_boosting" element={<Boosting />} />

          <Route path="/farmer/dashboard" element={<DashboardFarmer />} />
          <Route path="/farmer/absensi" element={<AbsensiFarmer />} />
          <Route path="/farmer/perolehan" element={<PerolehanFarming />} />
          <Route path="/farmer/profile" element={<Profile />} />
          <Route path="/farmer/kasbon" element={<Kasbon />} />
          <Route path="/farmer/riwayatperolehan" element={<RiwayatFarming />} />
          <Route path="/farmer/riwayatabsen" element={<RiwayatAbsen />} />
          <Route path="/farmer/riwayatkasbon" element={<RiwayatKasbon />} />

          <Route path="/booster/dashboard" element={<DashboardBooster />} />
          <Route path="/booster/absensi" element={<AbsensiBooster />} />
          <Route path="/booster/perolehan" element={<PerolehanBoosting />} />
          <Route path="/booster/profile" element={<Profile />} />
          <Route path="/booster/kasbon" element={<Kasbon />} />
          <Route path="/booster/riwayatperolehan" element={<RiwayatBoosting />} />
          <Route path="/booster/riwayatabsen" element={<RiwayatAbsen />} />
          <Route path="/booster/riwayatkasbon" element={<RiwayatKasbon />} />

          <Route path="/direktur/dashboard" element={<DashboardDirektur />} />
          <Route path="/direktur/jabatandivisi" element={<Jabatan_Divisi_Direktur />} />
          <Route path="/direktur/shiftgame" element={<Shift_Game_Direktur />} />
          <Route path="/direktur/karyawan" element={<Karyawan_Direktur />} />
          <Route path="/direktur/detail_karyawan/:id" element={<DetailKaryawan />} />
          <Route path="/direktur/profile" element={<Profile />} />
          <Route path="/direktur/perolehan_farming" element={<Farming />} />
          <Route path="/direktur/perolehan_boosting" element={<Boosting />} />
          <Route path="/direktur/akun" element={<Akun_Direktur />} />
          <Route path="/direktur/pengeluaran" element={<Pengeluaran_Direktur />} />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}