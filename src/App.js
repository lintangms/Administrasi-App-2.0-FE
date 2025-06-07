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
import DataAbsensi from "./page/manager/absensi/data_absensi";
import TugasForm from "./page/spv/tugas/tugas";
import DaftarTugas from "./page/booster/tugas/daftar_tugas";
import DaftarKasbon from "./page/manager/kasbon/daftar_kasbon";
import Penjualan from "./page/spv/penjualan/penjualan";
import TotalKoin from "./page/spv/koin/totalkoin";
import DataGaji from "./page/spv/gaji/data_gaji";
import PerolehanUnsold from "./page/farmer/unsold/unsold";
import RiwayatUnsold from "./page/farmer/unsold/riwayatunsold";
import Unsold from "./page/spv/unsold/unsold";
import DataGaji_Direktur from "./page/direktur/gaji/gaji";
import Unsold_Direktur from "./page/direktur/unsold/unsold";
import TargetFarming from "./page/farmer/target/target";
import RiwayatTarget from "./page/farmer/target/riwayattarget";
import DataTarget from "./page/manager/target/data_target";
import Kasbon_Direktur from "./page/direktur/kasbon/kasbon";
import Inventaris_Direktur from "./page/direktur/inventaris/inventaris";
import FarmingDetails from "./page/direktur/perolehan/detailfarming";
import RekapAbsensi from "./page/manager/absensi/rekapabsensi";
import DetailAbsensi from "./page/manager/absensi/detailabsensi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./page/manager/dashboard/dashboardmanager";

// Komponen untuk proteksi route berdasarkan role
const ProtectedRoute = ({ children, allowedRoles, currentRole }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentRole || !allowedRoles.includes(currentRole)) {
      toast.error("Anda tidak memiliki akses ke halaman ini!");
      navigate("/login");
    }
  }, [currentRole, allowedRoles, navigate]);

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Komponen untuk redirect ke dashboard sesuai role
const RoleBasedRedirect = ({ currentRole }) => {
  if (currentRole) {
    return <Navigate to={`/${currentRole}/dashboard`} replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  const [jabatan, setJabatan] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedJabatan = localStorage.getItem("jabatan");

    // Halaman yang bisa diakses tanpa login
    const publicRoutes = ["/login", "/scan_absensi"];
    
    // Jika di halaman publik, tidak perlu pengecekan token
    if (publicRoutes.includes(location.pathname)) {
      setIsLoading(false);
      return;
    }

    // Jika ada token dan jabatan tersimpan
    if (token && storedJabatan) {
      setIsLoggedIn(true);
      setJabatan(storedJabatan);
      
      // Validasi akses berdasarkan role dan path
      const pathSegments = location.pathname.split('/');
      const roleFromPath = pathSegments[1];
      
      // Jika role di URL tidak sesuai dengan role user
      if (roleFromPath && roleFromPath !== storedJabatan && !publicRoutes.includes(location.pathname)) {
        toast.error("Anda tidak memiliki akses ke halaman ini!");
        navigate(`/${storedJabatan}/dashboard`);
        setIsLoading(false);
        return;
      }
    } else {
      // Jika tidak ada token atau jabatan, redirect ke login
      setIsLoggedIn(false);
      setJabatan(null);
      navigate("/login");
    }
    
    setIsLoading(false);
  }, [navigate, location.pathname]);

  const handleLoginSuccess = (userjabatan) => {
    setJabatan(userjabatan);
    setIsLoggedIn(true);
    localStorage.setItem("jabatan", userjabatan);
    navigate(`/${userjabatan}/dashboard`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jabatan");
    setIsLoggedIn(false);
    setJabatan(null);
    navigate("/login");
    toast.success("Berhasil logout!");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

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

      {isLoggedIn && location.pathname !== "/login" && location.pathname !== "/scan_absensi" && (
        <>
          {jabatan === "manager" && (
            <SidebarManager
              jabatan={jabatan}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
              onLogout={handleLogout}
            />
          )}
          {jabatan === "spv" && (
            <SidebarSPV
              jabatan={jabatan}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
              onLogout={handleLogout}
            />
          )}
          {jabatan === "farmer" && (
            <SidebarFarmer
              jabatan={jabatan}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
              onLogout={handleLogout}
            />
          )}
          {jabatan === "booster" && (
            <SidebarFarmer
              jabatan={jabatan}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
              onLogout={handleLogout}
            />
          )}
          {jabatan === "direktur" && (
            <SidebarDirektur
              jabatan={jabatan}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
              onLogout={handleLogout}
            />
          )}
        </>
      )}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          marginTop: location.pathname === "/login" || location.pathname === "/scan_absensi" ? "0" : "50px",
          marginLeft: "-20px",
          transition: "all 0.3s ease",
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/scan_absensi" element={<AbsensiScan />} />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <DashboardManager />
            </ProtectedRoute>
          } />
          <Route path="/manager/scan" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <ScanQR />
            </ProtectedRoute>
          } />
          <Route path="/manager/jabatandivisi" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <Jabatan_Divisi />
            </ProtectedRoute>
          } />
          <Route path="/manager/shiftgame" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <Shift_Game />
            </ProtectedRoute>
          } />
          <Route path="/manager/karyawan" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <Karyawan />
            </ProtectedRoute>
          } />
          <Route path="/manager/detail_karyawan/:id" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <DetailKaryawan />
            </ProtectedRoute>
          } />
          <Route path="/manager/profile" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/manager/inventaris" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <Inventaris />
            </ProtectedRoute>
          } />
          <Route path="/manager/akun" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <Akun />
            </ProtectedRoute>
          } />
          <Route path="/manager/pengeluaran" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <Pengeluaran />
            </ProtectedRoute>
          } />
          <Route path="/manager/perolehan_farming" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <Farming />
            </ProtectedRoute>
          } />
          <Route path="/manager/perolehan_boosting" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <Boosting />
            </ProtectedRoute>
          } />
          <Route path="/manager/data_absensi" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <DataAbsensi />
            </ProtectedRoute>
          } />
          <Route path="/manager/data_kasbon" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <DaftarKasbon />
            </ProtectedRoute>
          } />
          <Route path="/manager/penjualan" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <Penjualan />
            </ProtectedRoute>
          } />
          <Route path="/manager/data_koin" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <TotalKoin />
            </ProtectedRoute>
          } />
          <Route path="/manager/data_gaji" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <DataGaji />
            </ProtectedRoute>
          } />
          <Route path="/manager/data_unsold" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <Unsold />
            </ProtectedRoute>
          } />
          <Route path="/manager/data_target" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <DataTarget />
            </ProtectedRoute>
          } />
          <Route path="/manager/detail/:NIP" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <FarmingDetails />
            </ProtectedRoute>
          } />
          <Route path="/manager/rekap_absensi" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <RekapAbsensi />
            </ProtectedRoute>
          } />
          <Route path="/manager/detail_absensi/:NIP" element={
            <ProtectedRoute allowedRoles={["manager"]} currentRole={jabatan}>
              <DetailAbsensi />
            </ProtectedRoute>
          } />

          {/* SPV Routes */}
          <Route path="/spv/dashboard" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <DashboardSPV />
            </ProtectedRoute>
          } />
          <Route path="/spv/scan" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <ScanQR />
            </ProtectedRoute>
          } />
          <Route path="/spv/jabatandivisi" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <Jabatan_Divisi />
            </ProtectedRoute>
          } />
          <Route path="/spv/shiftgame" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <Shift_Game />
            </ProtectedRoute>
          } />
          <Route path="/spv/karyawan" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <Karyawan />
            </ProtectedRoute>
          } />
          <Route path="/spv/detail_karyawan/:id" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <DetailKaryawan />
            </ProtectedRoute>
          } />
          <Route path="/spv/profile" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/spv/inventaris" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <Inventaris />
            </ProtectedRoute>
          } />
          <Route path="/spv/akun" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <Akun />
            </ProtectedRoute>
          } />
          <Route path="/spv/perolehan_farming" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <Farming />
            </ProtectedRoute>
          } />
          <Route path="/spv/perolehan_boosting" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <Boosting />
            </ProtectedRoute>
          } />
          <Route path="/spv/data_absensi" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <DataAbsensi />
            </ProtectedRoute>
          } />
          <Route path="/spv/tugas" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <TugasForm />
            </ProtectedRoute>
          } />
          <Route path="/spv/penjualan" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <Penjualan />
            </ProtectedRoute>
          } />
          <Route path="/spv/data_koin" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <TotalKoin />
            </ProtectedRoute>
          } />
          <Route path="/spv/data_gaji" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <DataGaji />
            </ProtectedRoute>
          } />
          <Route path="/spv/data_unsold" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <Unsold />
            </ProtectedRoute>
          } />
          <Route path="/spv/data_target" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <DataTarget />
            </ProtectedRoute>
          } />
          <Route path="/spv/kasbon" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <Kasbon />
            </ProtectedRoute>
          } />
          <Route path="/spv/riwayatkasbon" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <RiwayatKasbon />
            </ProtectedRoute>
          } />
          <Route path="/spv/rekap_absensi" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <RekapAbsensi />
            </ProtectedRoute>
          } />
          <Route path="/spv/perolehan" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <PerolehanFarming />
            </ProtectedRoute>
          } />
          <Route path="/spv/riwayatperolehan" element={
            <ProtectedRoute allowedRoles={["spv"]} currentRole={jabatan}>
              <RiwayatFarming />
            </ProtectedRoute>
          } />

          {/* Farmer Routes */}
          <Route path="/farmer/dashboard" element={
            <ProtectedRoute allowedRoles={["farmer"]} currentRole={jabatan}>
              <DashboardFarmer />
            </ProtectedRoute>
          } />
          <Route path="/farmer/absensi" element={
            <ProtectedRoute allowedRoles={["farmer"]} currentRole={jabatan}>
              <AbsensiFarmer />
            </ProtectedRoute>
          } />
          <Route path="/farmer/perolehan" element={
            <ProtectedRoute allowedRoles={["farmer"]} currentRole={jabatan}>
              <PerolehanFarming />
            </ProtectedRoute>
          } />
          <Route path="/farmer/profile" element={
            <ProtectedRoute allowedRoles={["farmer"]} currentRole={jabatan}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/farmer/kasbon" element={
            <ProtectedRoute allowedRoles={["farmer"]} currentRole={jabatan}>
              <Kasbon />
            </ProtectedRoute>
          } />
          <Route path="/farmer/riwayatperolehan" element={
            <ProtectedRoute allowedRoles={["farmer"]} currentRole={jabatan}>
              <RiwayatFarming />
            </ProtectedRoute>
          } />
          <Route path="/farmer/riwayatabsen" element={
            <ProtectedRoute allowedRoles={["farmer"]} currentRole={jabatan}>
              <RiwayatAbsen />
            </ProtectedRoute>
          } />
          <Route path="/farmer/riwayatkasbon" element={
            <ProtectedRoute allowedRoles={["farmer"]} currentRole={jabatan}>
              <RiwayatKasbon />
            </ProtectedRoute>
          } />
          <Route path="/farmer/unsold" element={
            <ProtectedRoute allowedRoles={["farmer"]} currentRole={jabatan}>
              <PerolehanUnsold />
            </ProtectedRoute>
          } />
          <Route path="/farmer/riwayatunsold" element={
            <ProtectedRoute allowedRoles={["farmer"]} currentRole={jabatan}>
              <RiwayatUnsold />
            </ProtectedRoute>
          } />
          <Route path="/farmer/target" element={
            <ProtectedRoute allowedRoles={["farmer"]} currentRole={jabatan}>
              <TargetFarming />
            </ProtectedRoute>
          } />
          <Route path="/farmer/riwayattarget" element={
            <ProtectedRoute allowedRoles={["farmer"]} currentRole={jabatan}>
              <RiwayatTarget />
            </ProtectedRoute>
          } />

          {/* Booster Routes */}
          <Route path="/booster/dashboard" element={
            <ProtectedRoute allowedRoles={["booster"]} currentRole={jabatan}>
              <DashboardBooster />
            </ProtectedRoute>
          } />
          <Route path="/booster/absensi" element={
            <ProtectedRoute allowedRoles={["booster"]} currentRole={jabatan}>
              <AbsensiBooster />
            </ProtectedRoute>
          } />
          <Route path="/booster/perolehan" element={
            <ProtectedRoute allowedRoles={["booster"]} currentRole={jabatan}>
              <PerolehanBoosting />
            </ProtectedRoute>
          } />
          <Route path="/booster/profile" element={
            <ProtectedRoute allowedRoles={["booster"]} currentRole={jabatan}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/booster/kasbon" element={
            <ProtectedRoute allowedRoles={["booster"]} currentRole={jabatan}>
              <Kasbon />
            </ProtectedRoute>
          } />
          <Route path="/booster/riwayatperolehan" element={
            <ProtectedRoute allowedRoles={["booster"]} currentRole={jabatan}>
              <RiwayatBoosting />
            </ProtectedRoute>
          } />
          <Route path="/booster/riwayatabsen" element={
            <ProtectedRoute allowedRoles={["booster"]} currentRole={jabatan}>
              <RiwayatAbsen />
            </ProtectedRoute>
          } />
          <Route path="/booster/riwayatkasbon" element={
            <ProtectedRoute allowedRoles={["booster"]} currentRole={jabatan}>
              <RiwayatKasbon />
            </ProtectedRoute>
          } />
          <Route path="/booster/daftar_tugas" element={
            <ProtectedRoute allowedRoles={["booster"]} currentRole={jabatan}>
              <DaftarTugas />
            </ProtectedRoute>
          } />

          {/* Direktur Routes */}
          <Route path="/direktur/dashboard" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <DashboardDirektur />
            </ProtectedRoute>
          } />
          <Route path="/direktur/jabatandivisi" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <Jabatan_Divisi_Direktur />
            </ProtectedRoute>
          } />
          <Route path="/direktur/shiftgame" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <Shift_Game_Direktur />
            </ProtectedRoute>
          } />
          <Route path="/direktur/karyawan" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <Karyawan_Direktur />
            </ProtectedRoute>
          } />
          <Route path="/direktur/detail_karyawan/:id" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <DetailKaryawan />
            </ProtectedRoute>
          } />
          <Route path="/direktur/profile" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/direktur/perolehan_farming" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <Farming />
            </ProtectedRoute>
          } />
          <Route path="/direktur/perolehan_boosting" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <Boosting />
            </ProtectedRoute>
          } />
          <Route path="/direktur/akun" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <Akun_Direktur />
            </ProtectedRoute>
          } />
          <Route path="/direktur/pengeluaran" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <Pengeluaran_Direktur />
            </ProtectedRoute>
          } />
          <Route path="/direktur/data_absensi" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <DataAbsensi />
            </ProtectedRoute>
          } />
          <Route path="/direktur/data_unsold" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <Unsold_Direktur />
            </ProtectedRoute>
          } />
          <Route path="/direktur/data_penjualan" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <Penjualan />
            </ProtectedRoute>
          } />
          <Route path="/direktur/data_gaji" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <DataGaji_Direktur />
            </ProtectedRoute>
          } />
          <Route path="/direktur/data_target" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <DataTarget />
            </ProtectedRoute>
          } />
          <Route path="/direktur/inventaris" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <Inventaris_Direktur />
            </ProtectedRoute>
          } />
          <Route path="/direktur/data_kasbon" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <Kasbon_Direktur />
            </ProtectedRoute>
          } />
          <Route path="/direktur/rekap_absensi" element={
            <ProtectedRoute allowedRoles={["direktur"]} currentRole={jabatan}>
              <RekapAbsensi />
            </ProtectedRoute>
          } />

          {/* Root redirect berdasarkan role */}
          <Route path="/" element={<RoleBasedRedirect currentRole={jabatan} />} />
          
          {/* Fallback untuk semua route lainnya */}
          <Route path="*" element={<Navigate to="/login" replace />} />
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