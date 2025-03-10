import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const Farming = () => {
  const [farmingList, setFarmingList] = useState([]); // State untuk data farming
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    periode: '',
    nama_shift: '',
    nama_game: '',
    nama: '', // New field for filtering by name
  });
  const [games, setGames] = useState([]);
  const [shifts, setShifts] = useState([]);

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env
  const navigate = useNavigate();

  // Fetch Farming data
  const fetchFarming = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/farming/get`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          periode: filter.periode,
          nama_shift: filter.nama_shift,
          nama_game: filter.nama_game,
          nama: filter.nama, // Include the new filter parameter
        },
      });
      if (response.data) {
        setFarmingList(response.data.data); // Mengambil data dari response
      } else {
        setFarmingList([]);
      }
    } catch (err) {
      console.error('Error saat mengambil data farming:', err);
      setError('Tidak ada data farming');
      setFarmingList([]);
      toast.error('Gagal memuat data farming');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Games
  const fetchGames = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/game/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        setGames(response.data.data);
      } else {
        setGames([]);
      }
    } catch (err) {
      console.error('Error fetching games:', err);
      toast.error('Gagal memuat data game');
    }
  };

  // Fetch Shifts
  const fetchShifts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/shift/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        setShifts(response.data.data);
      } else {
        setShifts([]);
      }
    } catch (err) {
      console.error('Error fetching shifts:', err);
      toast.error('Gagal memuat data shift');
    }
  };

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

  // Effect untuk mem-fetch data saat filter berubah
  useEffect(() => {
    if (!token) {
      toast.error('Silakan login kembali');
      navigate('/login');
      return;
    }
    fetchFarming();
    fetchGames();
    fetchShifts();
  }, [token, navigate, filter]);

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="farming-container">
      {error && <p className="error-message">{error}</p>}

      <div className="card my-4">
        <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
          <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
            <h6 className="text-white text-capitalize ps-3">Farming Table</h6>
          </div>
        </div>
        <div className="card-body px-0 pb-2">
          {/* Filter Form */}
          <div className="filter-form mb-4 px-3 py-2 bg-light">
            <div className="row">
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  name="periode"
                  placeholder="Cari Periode"
                  value={filter.periode}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-control"
                  name="nama_shift"
                  value={filter.nama_shift}
                  onChange={handleFilterChange}
                >
                  <option value="">Pilih Shift</option>
                  {shifts.length > 0 ? (
                    shifts.map((shift) => (
                      <option key={shift.id_shift} value={shift.nama_shift}>
                        {shift.nama_shift}
                      </option>
                    ))
                  ) : (
                    <option value="">Tidak ada shift tersedia</option>
                  )}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-control"
                  name="nama_game"
                  value={filter.nama_game}
                  onChange={handleFilterChange}
                >
                  <option value="">Pilih Nama Game</option>
                  {games.length > 0 ? (
                    games.map((game) => (
                      <option key={game.id_game} value={game.nama_game}>
                        {game.nama_game}
                      </option>
                    ))
                  ) : (
                    <option value="">Tidak ada game tersedia</option>
                  )}
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  name="nama"
                  placeholder="Cari Nama"
                  value={filter.nama}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-responsive p-0">
              <table className="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">No</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">NIP</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nama</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Koin</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Periode</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Keterangan</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nama Shift</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nama Game</th>
                  </tr>
                </thead>

                <tbody>
                  {farmingList && farmingList.length > 0 ? (
                    farmingList.map((farming, index) => (
                      <tr key={farming.id_farming}>
                        <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                        <td>{farming.NIP}</td>
                        <td>{farming.nama}</td>
                        <td>{farming.koin}</td>
                        <td>{formatDateTime(farming.periode)}</td>
                        <td>{farming.ket}</td>
                        <td>{farming.nama_shift}</td>
                        <td>{farming.nama_game}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">Tidak ada data farming tersedia</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Inline CSS */}
      <style>{`
        .table {
          width: 100%;
          margin-bottom: 1rem;
          color: #212529;
        }

        .table th,
        .table td {
          padding: 0.75rem;
          vertical-align: top;
          border-top: 1px solid #dee2e6;
        }

        .table thead th {
          vertical-align: bottom;
          border-bottom: 2px solid #dee2e6;
        }

        .text-uppercase {
          text-transform: uppercase;
        }

        .text-secondary {
          color: #6c757d;
        }

        .text-xxs {
          font-size: 0.75rem;
        }

        .font-weight-bolder {
          font-weight: bolder;
        }

        .bg-gradient-dark {
          background: linear-gradient(180deg, #1a1a1a 0%, #343a40 100%);
        }

        .border-radius-lg {
          border-radius: 0.5rem;
        }

        .filter-form { 
          background-color: #f8f9fa; 
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
};

export default Farming;