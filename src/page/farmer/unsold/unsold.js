import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../../app.css";

const PerolehanUnsold = () => {
  const [NIP, setNIP] = useState("");
  const [koin, setKoin] = useState("");
  const [ket, setKet] = useState("");
  const [namaGame, setNamaGame] = useState(""); // State untuk nama game
  const [usernameSteam, setUsernameSteam] = useState(""); // State untuk username steam
  const [games, setGames] = useState([]); // State untuk daftar game
  const [users, setUsers] = useState([]); // State untuk daftar username steam
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

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
        
        if (Array.isArray(data.data)) {
          setGames(data.data);
        } else {
          toast.error("Data game tidak valid.");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.");
      }
    };

    // Fetch daftar username steam dari backend
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/akun/get`);
        const data = await response.json();
        
        if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          toast.error("Data akun tidak valid.");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.");
      }
    };

    fetchGames();
    fetchUsers();
  }, [navigate, backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/unsold/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ NIP, koin, nama_game: namaGame, username_steam: usernameSteam }), // Mengirim nama_game dan username_steam
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setKoin("");
        setKet(""); // Reset keterangan
        setNamaGame(""); // Reset nama game
        setUsernameSteam(""); // Reset username steam
      } else {
        toast.error(data.message || "Gagal menambahkan data unsold.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.");
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
              <h1 className="h2">Perolehan Unsold</h1>
              <p>Silahkan Isi Data Dibawah</p>
            </div>

            <div className="card shadow-lg">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">NIP</label>
                    <input className="form-control" type="text" value={NIP} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Koin</label>
                    <input
                      className="form-control"
                      type="number"
                      value={koin}
                      onChange={(e) => setKoin(e.target.value)}
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
                  <div className="mb-3">
                    <label className="form-label">Username Steam</label>
                    <select
                      className="form-control"
                      value={usernameSteam}
                      onChange={(e) => setUsernameSteam(e.target.value)}
                      required
                    >
                      <option value="">Pilih Username Steam</option>
                      {users.map((user) => (
                        <option key={user.id_akun} value={user.username_steam}>
                          {user.username_steam}
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default PerolehanUnsold;