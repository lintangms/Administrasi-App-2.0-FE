import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../../app.css";

const AbsensiFarmer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [absensiData, setAbsensiData] = useState([]);
  const [rekapData, setRekapData] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAbsensiByNIP = async () => {
      const NIP = localStorage.getItem("NIP");
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
      const NIP = localStorage.getItem("NIP");
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

    fetchAbsensiByNIP();
    fetchRekapAbsensi();
  }, [backendUrl]);

  return (
    <main className="content">
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">Absensi</h1>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Absensi</h5>
              </div>
              <div className="card-body text-center">
                <div style={{ marginBottom: "10px", backgroundColor: "red", color: "white", padding: "20px", borderRadius: "10px" }}>
                  <strong>Silahkan absen menggunakan scan QR dari ID Card! Temui Manager atau SPV untuk melakukan absensi!</strong>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              } else if (statusText === "Tidak Masuk ") {
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

        @media (max-width: 768px) {
          .calendar-section {
            flex-direction: column;
          }
          .calendar-section > div {
            max-width: 100% !important;
            width: 100% !important;
            margin-left: 0 !important;
          }
          .rekap-card {
            margin-top: 20px;
            width: 100% !important;
            margin-left: 0 !important;
          }
        }
      `}</style>
    </main>
  );
};

export default AbsensiFarmer;