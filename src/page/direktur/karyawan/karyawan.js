import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen, FaTrash, FaInfoCircle } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; 
import { toast } from 'react-toastify';

const Karyawan_Direktur = () => {
  const [karyawanList, setKaryawanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const [showAddKaryawanModal, setShowAddKaryawanModal] = useState(false);
  const [showUpdateKaryawanModal, setShowUpdateKaryawanModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [jabatans, setJabatans] = useState([]);
  const [filters, setFilters] = useState({
    nama_game: '',
    nama_shift: '',
    nama_jabatan: '',
    status: ''
  });

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchKaryawan = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/karyawan/get`, {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        });
        if (response.data) {
          setKaryawanList(response.data.data);
        } else {
          setKaryawanList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data karyawan:', err);
        setError('Tidak ada data karyawan');
        setKaryawanList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKaryawan();
  }, [token, BACKEND_URL, filters]);

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

  const fetchJabatans = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/jabatan/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJabatans(response.data.data || []);
    } catch (err) {
      console.error('Error fetching jabatans:', err);
      toast.error('Gagal memuat data jabatan');
    }
  };

  useEffect(() => {
    fetchGames();
    fetchShifts();
    fetchJabatans();
  }, [token]);

  const handleEditKaryawan = (karyawan) => {
    setSelectedKaryawan(karyawan);
    setShowUpdateKaryawanModal(true);
  };

  const handleDeleteKaryawan = async (id) => {
    if (!id) {
      console.error('ID tidak valid:', id);
      return;
    }
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/karyawan/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setKaryawanList(karyawanList.filter((karyawan) => karyawan.id_karyawan !== id));
        toast.success('Karyawan berhasil dihapus!');
      }
    } catch (err) {
      console.error('Error saat menghapus data karyawan:', err);
      toast.error('Gagal menghapus karyawan.');
    }
  };

  const handleAddKaryawan = (newKaryawan) => {
    setKaryawanList((prevList) => [newKaryawan, ...prevList]);
    toast.success('Karyawan berhasil ditambahkan!');
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredKaryawanList = karyawanList.filter(karyawan => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      (typeof karyawan.NIP === 'string' && karyawan.NIP.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (typeof karyawan.nama === 'string' && karyawan.nama.toLowerCase().includes(lowerCaseSearchTerm))
    );
  });

  return (
    <div className="karyawan-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Karyawan Table</h6>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              {/* Search Input */}
              <div className="mb-3 px-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari Karyawan Nama"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Filter Dropdowns - Made narrower */}
              <div className="mb-3 px-4">
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <select
                      className="form-control"
                      name="nama_game"
                      value={filters.nama_game}
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
                  <div className="col-md-3 mb-2">
                    <select
                      className="form-control"
                      name="nama_shift"
                      value={filters.nama_shift}
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
                  <div className="col-md-3 mb-2">
                    <select
                      className="form-control"
                      name="nama_jabatan"
                      value={filters.nama_jabatan}
                      onChange={handleFilterChange}
                    >
                      <option value="">Pilih Jabatan</option>
                      {jabatans.map((jabatan) => (
                        <option key={jabatan.id_jabatan} value={jabatan.nama_jabatan}>
                          {jabatan.nama_jabatan}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3 mb-2">
                    <select
                      className="form-control"
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">Pilih Status</option>
                      <option value="baru">Baru</option>
                      <option value="lama">Lama</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        No
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        NIP
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Nama
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredKaryawanList && filteredKaryawanList.length > 0 ? (
                      filteredKaryawanList.map((karyawan, index) => (
                        <tr key={karyawan.id_karyawan}>
                          <td>{index + 1}</td>
                          <td>{karyawan.NIP}</td>
                          <td>{karyawan.nama}</td>
                          <td>
                          
                            <Link 
                              to={`/direktur/detail_karyawan/${encodeURIComponent(karyawan.NIP)}`} 
                              className="btn btn-primary btn-sm rounded"
                              state={{ karyawanNIP: karyawan.NIP }} // Adding state for additional safety
                            >
                              <FaInfoCircle />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">Tidak ada karyawan tersedia</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          
        </>
      )}

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

        .badge {
          display: inline-block;
          padding: 0.5em 0.75em;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          text-align: center;
          text-decoration: none;
          white-space: nowrap;
          border-radius: 0.375rem;
        }

        .bg-gradient-success {
          background-color: #28a745;
        }

        .border-radius-lg {
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Karyawan_Direktur;