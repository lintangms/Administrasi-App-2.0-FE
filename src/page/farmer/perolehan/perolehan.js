import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../../app.css";

const PerolehanFarming = () => {
  const [NIP, setNIP] = useState("");
  const [koin, setKoin] = useState("");
  const [koinTake, setKoinTake] = useState(""); // State for Koin di Take
  const [ket, setKet] = useState("");
  const [namaGame, setNamaGame] = useState(""); // State untuk nama game
  const [games, setGames] = useState([]); // State untuk daftar game
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Remove previous overflow settings
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    const storedNIP = localStorage.getItem("NIP");
    if (storedNIP) {
      setNIP(storedNIP);
    } else {
      toast.error("NIP tidak ditemukan di localStorage.");
      navigate("/");
    }

    // Fetch daftar game dari backend
    const fetchGames = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/game/get`);
        const data = await response.json();
        
        // Pastikan data adalah array
        if (Array.isArray(data.data)) { // Akses data dari objek
          setGames(data.data); // Set daftar game
        } else {
          toast.error("Data game tidak valid.");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.");
      }
    };

    fetchGames();
  }, [navigate, backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/farming/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          NIP, 
          koin, 
          koin_take: koinTake, // Add koin_take to the request
          ket, 
          nama_game: namaGame 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setKoin("");
        setKoinTake(""); // Reset koin take
        setKet(""); 
        setNamaGame(""); 
      } else {
        toast.error(data.message || "Gagal menambahkan data farming.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="w-100 min-vh-100 py-4"
    >
      <div className="container" style={{ maxWidth: "100%" }}>
        {/* Warning Card - Full Width */}
        <div className="row mx-0 mb-4">
          <div className="col-12 px-3">
            <div className="card border-primary">
              <div className="card-body">
                <h5 className="card-title text-primary">
                  <strong>PERUBAHAN SISTEM, MOHON DIBACA!</strong>
                </h5>
                <div className="card-text">
                  <p><strong>1.</strong> Koin yang diisi adalah TOTAL KOIN, bukan koin di tas dan perolehan koin.</p>
                  <p><strong>2.</strong> Cara mengisi adalah dengan mengupdate koin yang ada di tas.</p>
                  <p><strong>3.</strong> Contoh : Hari senin koin total 3.000, maka isilah 3.000. Hari selasa koin total 6.000, di take 2.000 dan di tas sisa 4.000, maka tetap mengisi sejumlah 6.000 karena total koinnya 6.000.</p>
                  <p><strong>4.</strong> Mohon diisi setiap hari karena akan ada slip gaji. Keterangan diisi dengan koin yang ada di tas dan koin yang di take</p>
                  <p><strong>5.</strong> Mohon mengisi target terlebih dahulu sebelum mengisi total koin!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mx-0">
          <div className="col-sm-12 col-md-8 col-lg-6 col-xl-5 px-3">

            <div className="text-center mt-2 mb-3">
              <h1 className="h2">Perolehan Farming</h1>
              <p>Silahkan Isi Data Dibawah</p>
            </div>

            <div className="card shadow-lg mb-4">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">NIP</label>
                    <input className="form-control" type="text" value={NIP} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total Koin</label>
                    <input
                      className="form-control"
                      placeholder="Contoh mengisi = 3000, bukan 3K ! "
                      type="number"
                      value={koin}
                      onChange={(e) => setKoin(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Keterangan </label>
                    <textarea
                      className="form-control"
                      value={ket}
                      onChange={(e) => setKet(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nama Game</label>
                    <select
                      className="form-control"
                      value={namaGame}
                      onChange={(e) => setNamaGame(e.target.value)}
                      required
                    >
                      <option value="">Pilih Nama Game</option>
                      {games.map((game) => (
                        <option key={game.id_game} value={game.nama_game}>
                          {game.nama_game}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <button type="submit" className="btn btn-lg btn-primary" disabled={isLoading}>
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        "Tambah"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* <div className="card mb-4">
              <div className="card-body text-center">
                <h5 className="card-title">TERDAPAT PERUBAHAN SISTEM. MOHON DIBACA!</h5>
                <p className="card-text">1. Pengisian koin diisi sesuai dengan koin yang ada ditas. Bukan perolehan dan bukan total koin!</p>
                <p className="card-text">2. Pengisian koin wajib diisi SETIAP HARI ketika mau pulang.</p>
                <p className="card-text">3. Kolom keterangan diisi koin yang ditake jika ada.</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PerolehanFarming;