import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ModalAddPenjualan from './modaladdpenjualan';
import { useNavigate } from 'react-router-dom';

const TotalKoin = () => {
  const [totalKoinList, setTotalKoinList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
    nama_game: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedKoin, setSelectedKoin] = useState(null);
  const [games, setGames] = useState([]);

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const fetchTotalKoin = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/farming/getall`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          bulan: filter.bulan,
          tahun: filter.tahun,
          nama_game: filter.nama_game
        },
      });
      
      if (response.data && response.data.data) {
        setTotalKoinList(response.data.data);
      } else {
        setTotalKoinList([]);
      }
    } catch (err) {
      console.error('Error saat mengambil data total koin:', err);
      setTotalKoinList([]);
      toast.error('Gagal memuat data koin');
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

  useEffect(() => {
    if (!token) {
      toast.error('Silakan login kembali');
      navigate('/login');
      return;
    }
    fetchTotalKoin();
    fetchGames();
  }, [token, navigate, filter]);

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenModal = (koin) => {
    const selectedKoinData = koin.nama_game === 'WOW' 
      ? { 
          NIP: 'WOW', 
          id_koin: koin.id_wow || null 
        }
      : {
          NIP: koin.NIP,
          id_koin: koin.id_koin
        };

    setSelectedKoin(selectedKoinData);
    setShowModal(true);
  };

  return (
    <div className="total-koin-container">
      {error && <p className="error-message">{error}</p>}

      <div className="card my-4">
        <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
          <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
            <h6 className="text-white text-capitalize ps-3">Jual Koin</h6>
          </div>
        </div>
        <div className="card-body px-0 pb-2">
          <div className="filter-form mb-4 px-3 py-2 bg-light">
            <div className="row">
              <div className="col-md-6">
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
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nama Game</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Total Koin</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Saldo Koin</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Total Dijual</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Estimasi Gaji</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {totalKoinList && totalKoinList.length > 0 ? (
                    totalKoinList.map((koin, index) => {
                      return (
                        <tr key={koin.NIP || koin.id_koin || koin.id_wow}>
                          <td>{index + 1}</td>
                          <td>{koin.nama_game === 'WOW' ? 'WOW' : koin.NIP}</td>
                          <td>{koin.nama}</td>
                          <td>{koin.nama_game}</td>
                          <td>{koin.total_koin?.toLocaleString('id-ID')}</td>
                          <td>{koin.saldo_koin?.toLocaleString('id-ID')}</td>
                          <td>{koin.total_dijual?.toLocaleString('id-ID')}</td>
                          <td>Rp {koin.estimasi_gaji?.toLocaleString('id-ID')}</td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleOpenModal(koin)}
                            >
                              Jual Koin
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">Tidak ada data total koin tersedia</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedKoin && (
        <ModalAddPenjualan 
          showModal={showModal} 
          setShowModal={setShowModal} 
          token={token} 
          selectedKoin={selectedKoin}
          onAddSuccess={() => {
            fetchTotalKoin(); 
            setShowModal(false);
          }}
        />
      )}

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

        .text-center {
          text-align: center;
        }

        .font-weight-bolder {
          font-weight: bolder;
        }

        .bg-gradient-dark {
          background: linear-gradient(180deg, #1a1a1a 0%, #343a40 100%);
        }

        .border-radius-lg {
          border-radius:  0.5rem;
        }

        .filter-form { 
          background-color: #f8f9fa; 
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
};

export default TotalKoin;