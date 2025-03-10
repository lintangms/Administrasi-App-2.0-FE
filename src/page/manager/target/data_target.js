import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';

const DataTarget = () => {
  const [targetList, setTargetList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
    nama_game: '',
    persentase: '',
    nama_shift: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [games, setGames] = useState([]);
  const [shifts, setShifts] = useState([]);

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const fetchTargets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/target/get`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          bulan: filter.bulan || undefined,
          tahun: filter.tahun || undefined,
          nama_game: filter.nama_game || undefined,
          persentase: filter.persentase || undefined,
          nama_shift: filter.nama_shift || undefined
        },
      });
      if (response.data) {
        setTargetList(response.data.data);
      } else {
        setTargetList([]);
      }
    } catch (err) {
      console.error('Error saat mengambil data target:', err);
      setTargetList([]);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (!token) {
      toast.error('Silakan login kembali');
      navigate('/login');
      return;
    }
    fetchTargets();
    fetchGames();
    fetchShifts();
  }, [token, navigate]);

  useEffect(() => {
    fetchTargets();
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenModal = (target) => {
    setSelectedTarget(target);
    setShowModal(true);
  };

  return (
    <div className="riwayat-target-container">
      {error && <p className="error-message">{error}</p>}

      <div className="card my-4">
        <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
          <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
            <h6 className="text-white text-capitalize ps-3">Riwayat Target</h6>
          </div>
        </div>
        <div className="card-body px-0 pb-2">
          <form className="filter-form mb-4 px-3 py-2 bg-light">
            <div className="row">
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
                <select
                  className="form-control"
                  name="bulan"
                  value={filter.bulan}
                  onChange={handleFilterChange}
                >
                  <option value="">Pilih Bulan</option>
                  {[...Array(12)].map((_, index) => (
                    <option key={index} value={index + 1}>
                      {new Date(0, index).toLocaleString('id-ID', { month: 'long' })}
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
                  {[...Array(5)].map((_, index) => (
                    <option key={index} value={2025 + index}>
                      {2025 + index}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  name="persentase"
                  placeholder="Persentase"
                  value={filter.persentase}
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
            </div>
          </form>

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
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nama Game</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Target</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tanggal</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Saldo Koin</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Persentase</th>
                  </tr>
                </thead>

                <tbody>
                  {targetList && targetList.length > 0 ? (
                    targetList.map((target, index) => (
                      <tr key={target.id_target}>
                        <td>{index + 1}</td>
                        <td>{target.nip}</td>
                        <td>{target.nama_karyawan}</td>
                        <td>{target.nama_game}</td>
                        <td>{target.target}</td>
                        <td>{new Date(target.tanggal).toLocaleDateString()}</td>
                        <td>{target.saldo_koin}</td>
                        <td>{target.persentase}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">Tidak ada data target tersedia</td>
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

export default DataTarget;