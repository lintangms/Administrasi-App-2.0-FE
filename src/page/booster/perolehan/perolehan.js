import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import toast dari react-toastify
import { useNavigate } from "react-router-dom";
import "../../../app.css"; // Pastikan untuk mengimpor CSS yang diperlukan

const PerolehanBoosting = () => {
  const [NIP, setNIP] = useState(""); // State untuk NIP
  const [nominal, setNominal] = useState("");
  const [ket, setKet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/boosting/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ NIP, nominal, ket }), // Hanya mengirim NIP, nominal, dan ket
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Reset form setelah berhasil
        setNominal("");
        setKet("");
      } else {
        toast.error(data.message || "Gagal menambahkan data boosting.");
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
            <h1 className="h2">Perolehan Boosting</h1>
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
                    <label className="form-label">Keterangan</label>
                    <textarea
                      className="form-control"
                      value={ket}
                      onChange={(e) => setKet(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        "Tambah"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PerolehanBoosting;