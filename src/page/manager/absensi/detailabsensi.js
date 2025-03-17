import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../../../app.css";
import axios from 'axios';
import ModalUpdateKeterangan from './modalupdate'; // Import the modal component

const DetailAbsensi = () => {
  const { NIP } = useParams(); // Ambil NIP dari URL params
  const [date, setDate] = useState(new Date());
  const [absensiData, setAbsensiData] = useState([]);
  const [rekapData, setRekapData] = useState(null);
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAbsen, setSelectedAbsen] = useState(null); // State for selected absen
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [bulan, setBulan] = useState(new Date().getMonth() + 1); // Set default to current month
  const [tahun, setTahun] = useState(new Date().getFullYear()); // Set default to current year
  const [status, setStatus] = useState('');
  const token = localStorage.getItem('token');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAbsensiByNIP = async () => {
      if (NIP) {
        try {
          const response = await fetch(`${backendUrl}/api/absen/status/${NIP}`);
          const data = await response.json();
          if (response.ok) {
            setAbsensiData(data);
          } else {
            console.error("Gagal mendapatkan data absen:", data.message);
          }
        } catch (error) {
          console.error("Terjadi kesalahan saat mengambil data absen:", error);
        }
      }
    };

    const fetchRekapAbsensi = async () => {
      if (NIP) {
        try {
          const response = await fetch(`${backendUrl}/api/absen/rekap/${NIP}`);
          const data = await response.json();
          if (response.ok) {
            const transformedData = {
              total_masuk: data.data.total_hadir || 0,
              total_izin: data.data.total_izin || 0,
              total_tidak_absen: data.data.total_tidak_masuk || 0
            };
            setRekapData(transformedData);
          } else {
            console.error("Gagal mendapatkan rekap absen:", data.message);
          }
        } catch (error) {
          console.error("Terjadi kesalahan saat mengambil rekap absen:", error);
        }
      }
    };

    const fetchAttendanceDetails = async () => {
      if (NIP) {
        setLoading(true);
        try {
          const response = await axios.get(`${backendUrl}/api/absen/absensi/${NIP}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { bulan, tahun, status }
          });
          if (response.data && response.data.data) {
            setAttendanceDetails(response.data.data);
          } else {
            setAttendanceDetails([]);
          }
        } catch (err) {
          console.error('Error saat mengambil data riwayat absensi:', err);
          setError('Gagal mengambil data riwayat absensi');
          setAttendanceDetails([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAbsensiByNIP();
    fetchRekapAbsensi();
    fetchAttendanceDetails();
  }, [backendUrl, NIP, token, bulan, tahun, status]);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    const dateObj = new Date(dateTime);
    if (isNaN(dateObj)) return "-";
    return dateObj.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'masuk':
        return 'bg-success text-white rounded px-2 py-1';
      case 'izin':
        return 'bg-warning text-dark rounded px-2 py-1';
      case 'tidak_masuk':
        return 'bg-danger text-white rounded px-2 py-1';
      default:
        return 'bg-secondary text-white rounded px-2 py-1';
    }
  };

  const handleOpenModal = (absen) => {
    setSelectedAbsen(absen);
    setShowModal(true);
  };

  return (
    <main className="content">
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">Absensi</h1>
        <div className="calendar-section mt-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: "100%", maxWidth: "560px", height: "auto", overflow: "hidden", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <Calendar
              onChange={setDate}
              value={date}
              className="custom-calendar"
              tileContent={({ date }) => {
                const formattedDate = date.toISOString().split("T")[0];
                const absensi = absensiData.find(
                  (item) => item.tanggal && item.tanggal.startsWith(formattedDate)
                );

                let statusText = "";
                if (absensi) {
                  statusText = absensi.status; // Ambil status dari data
                } else {
                  statusText = ""; // Jika tidak ada data, anggap tidak masuk
                }

                let backgroundColor = "";
                if (statusText === "hadir") {
                  backgroundColor = "rgba(0, 181, 0, 0.75)"; // Hijau untuk hadir
                } else if (statusText === "izin") {
                  backgroundColor = "rgba(236, 236, 0, 0.66)"; // Kuning untuk izin
                } else if (statusText === "Tidak Masuk") {
                  backgroundColor = "rgba(255, 0, 0, 0.75)"; // Merah untuk tidak masuk
                }

                return (
                  <div
                    style={{
                      backgroundColor,
                      padding: "4px",
                      textAlign: "center",
                      color: "white",
                      borderRadius: "4px",
                    }}
                  >
                    <p style={{ margin: 0 }}>{statusText}</p>
                  </div>
                );
              }}
            />
          </div>

          <div className="rekap-card" style={{ width: "100%", maxWidth: "550px", height: "auto", marginLeft: "10px" }}>
            <div className="card" style={{ height: "100%", padding: "20px", borderRadius: "15px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
              <div className="card-header">
                <h5 className="card-title">Rekap Absensi</h5>
              </div>
              <div className="card-body">
                {rekapData ? (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", paddingBottom: "8px", marginBottom: "8px" }}>
                      <strong>Total Masuk:</strong>
                      <span style={{ backgroundColor: "green", color: "white", padding: "2px 8px", borderRadius: "4px" }}>{rekapData.total_masuk}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", paddingBottom: "8px", marginBottom: "8px" }}>
                      <strong>Total Izin:</strong>
                      <span style={{ backgroundColor: "yellow", color: "black", padding: "2px 8px", borderRadius: "4px" }}>{rekapData.total_izin}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", marginBottom: "8px" }}>
                      <strong>Total Tidak Absen:</strong>
                      <span style={{ backgroundColor: "red", color: "white", padding: "2px 8px", borderRadius: "4px" }}>{rekapData.total_tidak_absen}</span>
                    </div>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add margin to the attendance details section */}
        <div className="attendance-details mt-4 mb-4"> {/* Added mb-4 for margin */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Detail Absensi</h6>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              {/* Filter Form */}
              <div className="filter-form mb-4 px-3 py-2 bg-light">
                <div className="row">
                  <div className="col-md-4">
                    <select
                      className="form-control"
                      value={bulan}
                      onChange={(e) => setBulan(e.target.value)}
                    >
                      <option value="">Pilih Bulan</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{`Bulan ${i + 1}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-control"
                      value={tahun}
                      onChange={(e) => setTahun(e.target.value)}
                    >
                      <option value="">Pilih Tahun</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={tahun - i} value={tahun - i}>{tahun - i}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Pilih Status</option>
                      <option value="masuk">Masuk</option>
                      <option value="izin">Izin</option>
                      <option value="tidak_masuk">Tidak Masuk</option>
                      <option value="belum absen">Belum Absen</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">No</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">NIP</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nama</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Waktu Masuk</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Waktu Pulang</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Ket</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center">Loading...</td>
                      </tr>
                    ) : attendanceDetails.length > 0 ? (
                      attendanceDetails.map((absen, index) => (
                        <tr key={`${absen.NIP}-${index}`}>
                          <td>{index + 1}</td>
                          <td>{absen.NIP}</td>
                          <td>{absen.nama}</td>
                          <td>{formatDateTime(absen.waktu_masuk)}</td>
                          <td>{formatDateTime(absen.waktu_pulang)}</td>
                          <td>
                            <span className={getStatusStyle(absen.status)}>
                              {absen.status || '-'}
                            </span>
                          </td>
                          <td>{absen.ket}</td>
                          <td>
                          
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">Tidak ada data untuk ditampilkan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for updating keterangan */}
        <ModalUpdateKeterangan 
          showModal={showModal} 
          setShowModal={setShowModal} 
          selectedAbsen={selectedAbsen} 
          setAttendanceDetails={setAttendanceDetails} 
          token={token} 
        />

      </div>

      <style>{`
        .custom-calendar {
          width: 100%;
          max-width: 100%;
          height: auto;
        }

        .react-calendar {
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .react-calendar__tile {
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .calendar-section {
          margin-top: 20px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .bg-gradient-dark { 
          background: linear-gradient(180deg, #1a1a1a 0%, #343a40 100%); 
        }
        .border-radius-lg { border-radius: 0.5rem; }
        .text-uppercase { text-transform: uppercase; }
        .text-secondary { color: #6c757d; }
        .text-xxs { font-size: 0.75rem; }
        .font-weight-bolder { font-weight: bolder; }
        .bg-success {
          background-color: #28a745 !important;
        }
        .bg-warning {
          background-color: #ffc107 !important;
        }
        .bg-danger {
          background-color: #dc3545 !important;
        }
        .btn-outline-primary {
          color: #007bff;
          border-color: #007bff;
        }
        .btn-outline-primary:hover {
          color: #fff;
          background-color: #007bff;
          border-color: #007bff;
        }
      `}</style>
    </main>
  );
};

export default DetailAbsensi;