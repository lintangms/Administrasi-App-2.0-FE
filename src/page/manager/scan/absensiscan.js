import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../../app.css";

const AbsensiScan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [absensiStatus, setAbsensiStatus] = useState(null); // Menyimpan status absensi
  const [buttonsVisible, setButtonsVisible] = useState(true); // Menyimpan status visibilitas tombol
  const [karyawanNIP, setKaryawanNIP] = useState(''); // Menyimpan NIP karyawan
  const [karyawanNama, setKaryawanNama] = useState(''); // Menyimpan nama karyawan
  const [idJabatan, setIdJabatan] = useState(''); // Menyimpan ID Jabatan
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env

  useEffect(() => {
    // Ambil NIP, nama karyawan, dan ID Jabatan dari localStorage
    const NIP = localStorage.getItem("NIP");
    const nama = localStorage.getItem("nama");
    const id_jabatan = localStorage.getItem("id_jabatan");
    
    if (NIP && nama) {
      setKaryawanNIP(NIP);
      setKaryawanNama(nama);
    }
    
    if (id_jabatan) {
      setIdJabatan(id_jabatan);
    }

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
        if (timeDiff > 5000) { // 1 jam dalam milidetik
          setAbsensiStatus(null);
          localStorage.removeItem("waktu_pulang");
        } else {
          // Jika belum lebih dari 1 jam, set status menjadi "Sudah Absen"
          setAbsensiStatus({ jam_masuk: true });
        }
      }
    };

    checkAbsensiStatus();
  }, [backendUrl]);

  const handleAbsenMasuk = async () => {
    setIsLoading(true);
    setButtonsVisible(false); // Sembunyikan tombol

    try {
      const response = await fetch(`${backendUrl}/api/absensi/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ NIP: karyawanNIP, id_jabatan: idJabatan }), // Kirim NIP dan id_jabatan
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

    try {
      const response = await fetch(`${backendUrl}/api/absensi/izin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ NIP: karyawanNIP, id_jabatan: idJabatan }), // Kirim NIP dan id_jabatan
      });

      const data = await response.json();

      if (response.ok) {
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
                <p className="font-semibold">Data Karyawan:</p>
                <p>NIP: {karyawanNIP}</p>
                <p>Nama: {karyawanNama}</p>
                <p>ID Jabatan: {idJabatan}</p> {/* Menampilkan ID Jabatan */}
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
    </main>
  );
};

export default AbsensiScan;