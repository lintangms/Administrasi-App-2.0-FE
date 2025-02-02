import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Calendar from 'react-calendar'; // Import Calendar
import 'react-calendar/dist/Calendar.css'; // Import CSS untuk Calendar
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../../app.css";

const AbsensiFarmer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [absensiStatus, setAbsensiStatus] = useState(null); // Menyimpan status absensi
  const [date, setDate] = useState(new Date()); // State untuk tanggal yang dipilih
  const [absensiData, setAbsensiData] = useState([]); // Menyimpan data absensi
  const [rekapData, setRekapData] = useState(null); // Menyimpan data rekap
  const [izinStatus, setIzinStatus] = useState(false); // Menyimpan status izin
  const [buttonsVisible, setButtonsVisible] = useState(true); // Menyimpan status visibilitas tombol
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env

  useEffect(() => {
    // Cek status absensi saat komponen dimuat
    const checkAbsensiStatus = async () => {
      const id_absensi = localStorage.getItem("id_absensi");
      if (id_absensi) {
        const response = await fetch(`${backendUrl}/api/absensi/get/${id_absensi}`);
        const data = await response.json();
        if (response.ok) {
          setAbsensiStatus(data);
        } else {
          console.error("Gagal mendapatkan status absensi:", data.message);
        }
      }

      // Cek waktu pulang dari localStorage
      const waktuPulang = localStorage.getItem("waktu_pulang");
      if (waktuPulang) {
        const pulangDate = new Date(waktuPulang);
        const currentDate = new Date();
        const timeDiff = currentDate - pulangDate; // Selisih waktu dalam milidetik

        // Jika sudah lebih dari 1 jam, reset status
        if (timeDiff > 6000) { // 1 jam dalam milidetik
          setAbsensiStatus(null);
          localStorage.removeItem("waktu_pulang");
        } else {
          // Jika belum lebih dari 1 jam, set status menjadi "Sudah Absen"
          setAbsensiStatus({ jam_masuk: true });
        }
      }
    };

    // Ambil data absensi berdasarkan NIP
    const fetchAbsensiByNIP = async () => {
      const NIP = localStorage.getItem("NIP");
      if (NIP) {
        try {
          const response = await fetch(`${backendUrl}/api/absensi/status/${NIP}`);
          const data = await response.json();
          if (response.ok) {
            setAbsensiData(data); // Simpan data absensi
          } else {
            console.error("Gagal mendapatkan data absensi:", data.message);
          }
        } catch (error) {
          console.error("Terjadi kesalahan saat mengambil data absensi:", error);
        }
      }
    };

    // Ambil rekap absensi berdasarkan NIP
    const fetchRekapAbsensi = async () => {
      const NIP = localStorage.getItem("NIP");
      if (NIP) {
        try {
          const response = await fetch(`${backendUrl}/api/absensi/absensi/${NIP}`);
          const data = await response.json();
          if (response.ok) {
            setRekapData(data.data); // Simpan data rekap
          } else {
            console.error("Gagal mendapatkan rekap absensi:", data.message);
          }
        } catch (error) {
          console.error("Terjadi kesalahan saat mengambil rekap absensi:", error);
        }
      }
    };

    checkAbsensiStatus();
    fetchAbsensiByNIP();
    fetchRekapAbsensi();
  }, [backendUrl]);

  const handleAbsenMasuk = async () => {
    setIsLoading(true);
    setButtonsVisible(false); // Sembunyikan tombol
    const NIP = localStorage.getItem("NIP"); // Ambil NIP dari localStorage
    const id_jabatan = localStorage.getItem("id_jabatan"); // Ambil id_jabatan dari localStorage

    try {
      const response = await fetch(`${backendUrl}/api/absensi/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ NIP, id_jabatan }), // Kirim NIP dan id_jabatan
      });

      const data = await response.json();

      if (response.ok) {
        if (data.id_absensi) {
          localStorage.setItem("id_absensi", data.id_absensi);
        }
        toast.success(data.message);
        setAbsensiStatus({ jam_masuk: true }); // Set status absensi setelah berhasil
      } else {
        toast.error(data.message || "Absensi masuk gagal. Coba lagi!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.");
    } finally {
      setTimeout(() => {
        setButtonsVisible(true); // Tampilkan kembali tombol setelah 5 detik
      }, 5000);
      setIsLoading(false);
    }
  };

  const handleAbsenIzin = async () => {
    setIsLoading(true);
    setButtonsVisible(false); // Sembunyikan tombol
    const NIP = localStorage.getItem("NIP"); // Ambil NIP dari localStorage
    const id_jabatan = localStorage.getItem("id_jabatan"); // Ambil id_jabatan dari localStorage

    try {
      const response = await fetch(`${backendUrl}/api/absensi/izin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ NIP, id_jabatan }), // Kirim NIP dan id_jabatan
      });

      const data = await response.json();

      if (response.ok) {
        setIzinStatus(true); // Set status izin
        toast.success(data.message);
      } else {
        toast.error(data.message || "Absensi izin gagal. Coba lagi!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.");
    } finally {
      setTimeout(() => {
        setButtonsVisible(true); // Tampilkan kembali tombol setelah 5 detik
      }, 5000);
      setIsLoading(false);
    }
  };

  const handlePulang = async () => {
    setIsLoading(true);
    setButtonsVisible(false); // Sembunyikan tombol
    const id_absensi = localStorage.getItem("id_absensi"); // Ambil id_absensi dari localStorage

    if (!id_absensi) {
      toast.error("ID Absensi tidak ditemukan. Harap lakukan absen masuk terlebih dahulu.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/absensi/update/${id_absensi}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        localStorage.removeItem("id_absensi");
        
        // Simpan waktu pulang di localStorage
        const currentTime = new Date();
        localStorage.setItem("waktu_pulang", currentTime.toISOString());
        
        // Tetap tampilkan status "Sudah Absen"
        setAbsensiStatus({ jam_masuk: true });
      } else {
        toast.error(data.message || "Pulang gagal. Coba lagi!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.");
    } finally {
      setTimeout(() => {
        setButtonsVisible(true); // Tampilkan kembali tombol setelah 5 detik
      }, 5000);
      setIsLoading(false);
    }
  };

  return (
    <main className="content">
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">Absensi</h1>
        <div className="row">
          <div className="col-12">
            <div className="card" style={{ backgroundColor: absensiStatus?.jam_masuk ? "#d4edda" : "#f8d7da", color: absensiStatus?.jam_masuk ? "#155724" : "#721c24" }}>
              <div className="card-header">
                <h5 className="card-title mb-0">{absensiStatus?.jam_masuk ? "Sudah Absen" : "Belum Absen"}</h5>
              </div>
              <div className="card-body text-center">
                {absensiStatus?.jam_masuk ? (
                  buttonsVisible && (
                    <button 
                      className="btn btn-success" 
                      onClick={handlePulang} 
                      disabled={isLoading} 
                      style={{ width: "200px" }} // Atur lebar tombol
                    >
                      Pulang
                    </button>
                  )
                ) : (
                  buttonsVisible && (
                    <div className="d-flex flex-column gap-2 align-items-center"> {/* Pusatkan tombol */}
                      <button 
                        className="btn btn-primary" 
                        onClick={handleAbsenMasuk} 
                        disabled={isLoading} 
                        style={{ width: "100%" }} // Atur lebar tombol
                      >
                        Masuk
                      </button>
                      <button 
                        className="btn btn-warning" 
                        onClick={handleAbsenIzin} 
                        disabled={isLoading} 
                        style={{ width: "100%" }} // Atur lebar tombol
                      >
                        Izin
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tampilkan Kalender dan Card Rekap */}
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

              // Menentukan background berdasarkan status
              let backgroundColor = "";
              if (absensi) {
                if (absensi.status === "masuk") {
                  backgroundColor = "rgba(0, 181, 0, 0.75)"; // Hijau pudar
                } else if (absensi.status === "izin") {
                  backgroundColor = "rgba(236, 236, 0, 0.66)"; // Kuning pudar
                }
              }

              return (
                <div
                  style={{
                    backgroundColor,
                    padding: "4px",
                    textAlign: "center",
                    color: "white",
                    borderRadius: "4px", // Rounded corner
                  }}
                >
                  <p style={{ margin: 0 }}>{absensi ? absensi.status : ""}</p>
                </div>
              );
            }}
          />
        </div>

        {/* Card Rekap */}
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

      {/* Inline CSS untuk modal */}
      <style>{`
        .custom-calendar {
          width: 100%; /* Atur lebar sesuai kebutuhan */
          max-width: 100%; /* Maksimal lebar untuk responsive */
          height: auto; /* Biarkan tinggi menyesuaikan secara otomatis */
        }

        .react-calendar {
          border-radius: 10px; /* Tambahkan border radius jika diperlukan */
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Bayangan kalender */
        }

        .react-calendar__tile {
          height: 60px; /* Atur tinggi setiap tile (tanggal) */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .calendar-section {
          margin-top: 20px;
          display: flex;
          flex-direction: row; /* Sejajarkan kalender dan card rekap */
          justify-content: space-between;
        }

        @media (max-width: 768px) {
          .calendar-section {
            flex-direction: column; /* Ubah menjadi kolom pada tampilan mobile */
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