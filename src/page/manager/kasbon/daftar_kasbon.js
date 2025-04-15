import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaMoneyBill, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DaftarKasbon = () => {
  const [kasbonList, setKasbonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedKasbon, setSelectedKasbon] = useState(null);
  const [showAddKasbonModal, setShowAddKasbonModal] = useState(false);
  const [showUpdateKasbonModal, setShowUpdateKasbonModal] = useState(false);
  const [filter, setFilter] = useState({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
    search: '', // Field untuk pencarian
  });

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchKasbon = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/kasbon/get`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            bulan: filter.bulan,
            tahun: filter.tahun,
            search: filter.search,
          },
        });
        if (response.data && response.data.data) {
          setKasbonList(response.data.data);
        } else {
          setKasbonList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data kasbon:', err);
        setError('Tidak ada data kasbon');
        setKasbonList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKasbon();
  }, [token, filter]);

  const updateStatus = async (id_kasbon, newStatus) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/kasbon/status/${id_kasbon}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(response.data.message);
      setKasbonList((prevList) =>
        prevList.map((kasbon) =>
          kasbon.id_kasbon === id_kasbon ? { ...kasbon, status: newStatus } : kasbon
        )
      );
    } catch (err) {
      console.error('Error saat memperbarui status kasbon:', err);
      toast.error(err.response?.data?.message || 'Gagal memperbarui status kasbon.');
    }
  };

  const updateKonfirmasi = async (id_kasbon, newKonfirmasi) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/kasbon/konfirmasi/${id_kasbon}`, { konfirmasi: newKonfirmasi }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(response.data.message);
      setKasbonList((prevList) =>
        prevList.map((kasbon) =>
          kasbon.id_kasbon === id_kasbon ? { ...kasbon, konfirmasi: newKonfirmasi } : kasbon
        )
      );
    } catch (err) {
      console.error('Error saat memperbarui konfirmasi kasbon:', err);
      toast.error(err.response?.data?.message || 'Gagal memperbarui konfirmasi kasbon.');
    }
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="kasbon-container">
      {error && <p className="error-message">{error}</p>}

      {/* Stats Cards
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FaMoneyBill style={{ color: '#3498db', fontSize: '2rem' }} />
          <div style={{ textAlign: 'right' }}>
            <h5 style ={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>Total Kasbon</h5>
            <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem', fontWeight: 'bold' }}>{kasbonList.length}</h2>
          </div>
        </div>
      </div> */}

      {/* Daftar Kasbon Table Header */}
      <div className="card my-4">
        <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
          <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
            <h6 className="text-white text-capitalize ps-3">Daftar Kasbon</h6>
            {/* <button
              className="btn btn-success me-3"
              onClick={() => {
                setShowAddKasbonModal(true);
                toast.info('Silakan isi form untuk menambahkan kasbon.'); // Notifikasi info
              }}
            >
              + Add
            </button> */}
          </div>
        </div>

        {/* Filter Form */}
        <div className="filter-form mb-4 px-3 py-2 bg-light">
          <div className="row">
            <div className="col-md-4">
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
            <div className="col-md-4">
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
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                name="search"
                placeholder="Cari Nama Karyawan"
                value={filter.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        <div className="card-body px-0 pb-2">
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
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nominal</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Keperluan</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tanggal</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Dari</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Keterangan</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Konfirmasi</th>
                    {kasbonList.some(kasbon => kasbon.konfirmasi !== 'ditolak') && (
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                    )}
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {kasbonList.length > 0 ? (
                    kasbonList.map((kasbon, index) => (
                      <tr key={kasbon.id_kasbon}>
                        <td>{index + 1}</td>
                        <td>{kasbon.NIP}</td>
                        <td>{kasbon.nama}</td>
                        <td>{kasbon.nominal}</td>
                        <td>{kasbon.keperluan}</td>
                        <td>{new Date(kasbon.tanggal).toLocaleDateString()}</td>
                        <td>{kasbon.dari}</td>
                        <td>{kasbon.ket}</td>
                        <td>{kasbon.konfirmasi}</td>
                        {kasbon.konfirmasi !== 'ditolak' && <td>{kasbon.status}</td>}
                        <td>
                          {kasbon.konfirmasi === 'menunggu' && (
                            <>
                              <button
                                className="btn btn-primary btn-sm rounded ms-2"
                                onClick={() => updateKonfirmasi(kasbon.id_kasbon, 'disetujui')}
                              >
                                <FaCheck />
                              </button>
                              <button
                                className="btn btn-danger btn-sm rounded ms-2"
                                onClick={() => updateKonfirmasi(kasbon.id_kasbon, 'ditolak')}
                              >
                                <FaTimesCircle />
                              </button>
                            </>
                          )}
                          {kasbon.konfirmasi === 'disetujui' && kasbon.status !== 'lunas' && (
                            <button
                              className="btn btn-success btn-sm rounded ms-2"
                              onClick={() => updateStatus(kasbon.id_kasbon, 'lunas')}
                            >
                              Lunas
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11">Tidak ada data untuk ditampilkan.</td>
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

export default DaftarKasbon;