import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import toast dari react-toastify
import { useNavigate } from "react-router-dom";
import "../../../app.css"; // Pastikan untuk mengimpor CSS yang diperlukan

const Kasbon = () => {
  const [NIP, setNIP] = useState(""); // State untuk NIP
  const [nominal, setNominal] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [status, setStatus] = useState("belum_lunas"); // Default status
  const [dari, setDari] = useState(""); // State untuk "Dari"
  const [ket, setKet] = useState("");
  const [tanggal, setTanggal] = useState(""); // State untuk tanggal
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]); // State untuk menyimpan opsi ENUM
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env

  useEffect(() => {
    // Ambil NIP dari localStorage saat komponen dimuat
    const storedNIP = localStorage.getItem("NIP");
    if (storedNIP) {
      setNIP(storedNIP); // Set NIP dari localStorage
    } else {
      toast.error("NIP tidak ditemukan di localStorage.");
      navigate("/"); // Navigasi ke halaman lain jika NIP tidak ada
    }

    // Ambil opsi ENUM untuk "Dari" dari backend
    const fetchOptions = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/kasbon/options`);
        const data = await response.json();
        if (response.ok) {
          setOptions(data); // Set opsi ENUM dari backend
        } else {
          toast.error(data.message || "Gagal mengambil opsi.");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat menghubungi server.");
      }
    };

    fetchOptions();
  }, [navigate, backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validasi tanggal
    if (!tanggal) {
      toast.error("Tanggal wajib diisi.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/kasbon/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ NIP, nominal, keperluan, status, dari, ket, tanggal }), // Mengirim data kasbon
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Reset form setelah berhasil
        setNominal("");
        setKeperluan("");
        setDari("");
        setKet("");
        setTanggal(""); // Reset tanggal
      } else {
        toast.error(data.message || "Gagal menambahkan kasbon.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="d-flex w-100" style={{ justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="container d-flex flex-column">
        <div className="row">
          <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto">
            <div className="text-center mt-4">
              <h1 className="h2">Pengajuan Kasbon</h1>
              <p>Silahkan Isi Data Dibawah</p>
            </div>

            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">NIP</label>
                    <input
                      className="form-control"
                      type="text"
                      value={NIP}
                      readOnly // NIP tidak dapat diubah
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nominal</label>
                    <input
                      className="form-control"
                      type="number"
                      value={nominal}
                      onChange={(e) => setNominal(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Keperluan</label>
                    <input
                      className="form-control"
                      type="text"
                      value={keperluan}
                      onChange={(e) => setKeperluan(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tanggal</label>
                    <input
                      className="form-control"
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dari</label>
                    <select
                      className="form-select"
                      value={dari}
                      onChange={(e) => setDari(e.target.value)}
                      required
                    >
                      <option value="">Pilih Dari</option>
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Keterangan</label>
                    <textarea
                      className="form-control"
                      value={ket}
                      onChange={(e) => setKet(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Mengirim..." : "Kirim"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Kasbon;