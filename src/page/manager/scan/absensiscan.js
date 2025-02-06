import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../../app.css";

const AbsensiScan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [nip, setNip] = useState("");
  const [nama, setNama] = useState("");

  useEffect(() => {
    // Ambil query parameter dari URL
    const params = new URLSearchParams(window.location.search);
    const nipFromQuery = params.get("nip");
    const namaFromQuery = params.get("nama");

    if (nipFromQuery && namaFromQuery) {
      // Simpan di localStorage
      localStorage.setItem("NIP", nipFromQuery);
      localStorage.setItem("nama", namaFromQuery);
      toast.success("Data Karyawan Berhasil Diambil");
    }

    // Ambil data dari localStorage
    const storedNip = localStorage.getItem("NIP");
    const storedNama = localStorage.getItem("nama");
    if (storedNip && storedNama) {
      setNip(storedNip);
      setNama(storedNama);
    }
  }, []);

  const handleAbsenMasuk = async () => {
    setIsLoading(true);
    const NIP = localStorage.getItem("NIP");

    try {
      const response = await fetch(`${backendUrl}/api/absen/absen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ NIP, tipe: 'masuk' }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Hapus localStorage setelah 3 detik
        setTimeout(() => {
          localStorage.removeItem("NIP");
          localStorage.removeItem("nama");
          setNip("");
          setNama("");
        }, 3000);
      } else {
        toast.error(data.message || "Absen masuk gagal. Coba lagi!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePulang = async () => {
    setIsLoading(true);
    const NIP = localStorage.getItem("NIP");

    try {
      const response = await fetch(`${backendUrl}/api/absen/absen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ NIP, tipe: 'pulang' }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Hapus localStorage setelah 3 detik
        setTimeout(() => {
          localStorage.removeItem("NIP");
          localStorage.removeItem("nama");
          setNip("");
          setNama("");
        }, 3000);
      } else {
        toast.error(data.message || "Pulang gagal. Coba lagi!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="content">
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">Absensi</h1>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Informasi Karyawan</h5>
              </div>
              <div className="card-body text-center">
                <div style={{ marginBottom: "10px" }}>
                  <h6>NIP: <span style={{ fontWeight: "bold" }}>{nip}</span></h6>
                  <h6>Nama: <span style={{ fontWeight: "bold" }}>{nama}</span></h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Absensi</h5>
              </div>
              <div className="card-body text-center">
                <div style={{ marginBottom: "10px" }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleAbsenMasuk} 
                    disabled={isLoading} 
                    style={{ width: "100%" }} // Set width to 100%
                  >
                    Masuk
                  </button>
                </div>
                <div>
                  <button 
                    className="btn btn-success" 
                    onClick={handlePulang} 
                    disabled={isLoading} 
                    style={{ width: "100%" }} // Set width to 100%
                  >
                    Pulang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AbsensiScan;