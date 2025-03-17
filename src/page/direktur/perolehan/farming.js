import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { FaInfoCircle } from 'react-icons/fa';

const Farming = () => {
  const [farmingList, setFarmingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    bulan: new Date().getMonth() + 1, // Set to current month
    tahun: new Date().getFullYear(),   // Set to current year
    minggu_bulan: '',
    nama_shift: '',
    nama_game: '',
    nama: '',
  });
  const [games, setGames] = useState([]);
  const [shifts, setShifts] = useState([]);

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const fetchFarming = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/farming/get`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          bulan: filter.bulan,
          tahun: filter.tahun,
          minggu_bulan: filter.minggu_bulan,
          nama_shift: filter.nama_shift,
          nama_game: filter.nama_game,
          nama: filter.nama,
        },
      });
      setFarmingList(response.data.data || []);
    } catch (err) {
      console.error('Error saat mengambil data farming:', err);
      setError('Tidak ada data farming');
      toast.error('Gagal memuat data farming');
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/game/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGames(response.data.data || []);
    } catch (err) {
      console.error('Error fetching games:', err);
      toast.error('Gagal memuat data game');
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/shift/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShifts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching shifts:', err);
      toast.error('Gagal memuat data shift');
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    const dateObj = new Date(dateTime);
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

  const handleViewDetails = (nip) => {
    navigate(`/manager/detail/${nip}`); // Navigate to the details page
  };

  // Generate years for dropdown
  const years = [2025, 2026, 2027, 2028];

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
          <div className="filter-form mb-4 px-3 py-2 bg-light">
            <div className="row">
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
              <div className="col-md-3">
                <select
                  className="form-control"
                  name="bulan"
                  value={filter.bulan}
                  onChange={handleFilterChange}
                >
                  <option value="">Pilih Bulan</option>
                  {[...Array(12).keys()].map((month) => (
                    <option key={month + 1} value={month + 1}>
                      {new Date(0, month).toLocaleString('id-ID', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-control"
                  name="tahun"
                  value={filter.tahun}
                  onChange={handleFilterChange}
                >
                  <option value="">Pilih Tahun</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-control"
                  name="minggu_bulan"
                  value={filter.minggu_bulan}
                  onChange={handleFilterChange}
                >
                  <option value="">Pilih Minggu</option>
                  {[1, 2, 3, 4].map((week) => (
                    <option key={week} value={week}>
                      Minggu {week}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-control"
                  name="nama_shift"
                  value={filter.nama_shift}
                  onChange={handleFilterChange}
                >
                  <option value="">Pilih Shift</option>
                  {shifts.map((shift) => (
                    <option key={shift.id_shift} value={shift.nama_shift}>
                      {shift.nama_shift}
                    </option>
                  ))}
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
                  {games.map((game) => (
                    <option key={game.id_game} value={game.nama_game}>
                      {game.nama_game}
                    </option>
                  ))}
                </select>
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
                    <th>No</th>
                    <th>NIP</th>
                    <th>Nama</th>
                    <th>Akun Steam</th>
                    <th>Saldo Koin</th>
                    <th>Total Koin</th>
                    <th>Periode</th>
                    <th>Nama Shift</th>
                    <th>Nama Game</th>
                    <th>Keterangan</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {farmingList.length > 0 ? (
                    farmingList.map((farming, index) => (
                      <tr key={farming.id_farming}>
                        <td>{index + 1}</td>
                        <td>{farming.nip}</td>
                        <td>{farming.nama}</td>
                        <td>{farming.username_steam}</td>
                        <td>{farming.saldo_koin}</td>
                        <td>{farming.jumlah}</td>
                        <td>{formatDateTime(farming.periode)}</td>
                        <td>{farming.nama_shift}</td>
                        <td>{farming.nama_game}</td>
                        <td>{farming.ket}</td>
                        <td>
                          <button 
                            className="btn btn-primary btn-sm rounded" 
                            onClick={() => handleViewDetails(farming.nip)}
                          >
                            <FaInfoCircle />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11">Tidak ada data farming tersedia</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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