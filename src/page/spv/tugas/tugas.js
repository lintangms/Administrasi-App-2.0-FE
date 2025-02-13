import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../../app.css";

const TugasForm = () => {
  const [NIP, setNIP] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalTenggat, setTanggalTenggat] = useState("");
  const [ket, setKet] = useState("");
  const [karyawanList, setKaryawanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/karyawan/get`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        
        // Handle the case where data might be directly in result or in result.data
        const karyawanData = result.data || result;
        
        if (Array.isArray(karyawanData)) {
          // Filter only employees with jabatan "Booster"
          const boosterKaryawan = karyawanData.filter(
            karyawan => karyawan.nama_jabatan === "booster"
          );
          
          if (boosterKaryawan.length === 0) {
            console.log("No Booster employees found");
            toast.info("Tidak ada karyawan dengan jabatan Booster");
          }
          
          setKaryawanList(boosterKaryawan);
          console.log("Booster karyawan loaded:", boosterKaryawan);
        } else {
          console.error("Invalid data format:", result);
          toast.error("Format data tidak sesuai");
        }
      } catch (error) {
        console.error("Error fetching karyawan:", error);
        toast.error("Gagal mengambil data karyawan");
      }
    };

    fetchKaryawan();
  }, [backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/tugas/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NIP,
          deskripsi,
          tanggal_mulai: tanggalMulai,
          tanggal_tenggat: tanggalTenggat,
          ket,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Tugas berhasil ditambahkan");
        setNIP("");
        setDeskripsi("");
        setTanggalMulai("");
        setTanggalTenggat("");
        setKet("");
      } else {
        toast.error(data.message || "Gagal menambahkan tugas");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Terjadi kesalahan saat mengirim data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="d-flex w-100 vh-100 align-items-center justify-content-center"
      style={{ overflow: "hidden" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="text-center mt-4">
              <h1 className="h2">Form Tugas</h1>
              <p>Silahkan Isi Data Dibawah</p>
            </div>

            <div className="card shadow-lg">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">NIP (Booster)</label>
                    <select
                      className="form-select"
                      value={NIP}
                      onChange={(e) => setNIP(e.target.value)}
                      required
                    >
                      <option value="">Pilih Karyawan Booster</option>
                      {karyawanList && karyawanList.map((karyawan) => (
                        <option 
                          key={karyawan.id_karyawan} 
                          value={karyawan.NIP}
                        >
                          {karyawan.NIP} - {karyawan.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                      className="form-control"
                      value={deskripsi}
                      onChange={(e) => setDeskripsi(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tanggal Mulai</label>
                    <input
                      className="form-control"
                      type="date"
                      value={tanggalMulai}
                      onChange={(e) => setTanggalMulai(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tanggal Tenggat</label>
                    <input
                      className="form-control"
                      type="date"
                      value={tanggalTenggat}
                      onChange={(e) => setTanggalTenggat(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Keterangan</label>
                    <textarea
                      className="form-control"
                      value={ket}
                      onChange={(e) => setKet(e.target.value)}
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
                        />
                      ) : (
                        "Tambah Tugas"
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

export default TugasForm;