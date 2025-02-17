import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen, FaTrash } from 'react-icons/fa'; 
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ModalAddPenjualan from './modaladdpenjualan'; // Pastikan nama file sesuai
import ModalUpdatePenjualan from './modalupdatepenjualan'; // Pastikan nama file sesuai

const Penjualan = () => {
  const [penjualanList, setPenjualanList] = useState([]); // State untuk Penjualan
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPenjualan, setSelectedPenjualan] = useState(null); // State untuk Penjualan yang dipilih
  const [showAddPenjualanModal, setShowAddPenjualanModal] = useState(false);
  const [showUpdatePenjualanModal, setShowUpdatePenjualanModal] = useState(false);
  const [filter, setFilter] = useState({
    bulan: '',
    tahun: '',
  });

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env
  const navigate = useNavigate(); // Inisialisasi useNavigate

  // Fetch Penjualan data
  const fetchPenjualan = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/penjualan/get`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          bulan: filter.bulan,
          tahun: filter.tahun,
        },
      });
      if (response.data && response.data.data) {
        setPenjualanList(response.data.data);
      } else {
        setPenjualanList([]);
      }
    } catch (err) {
      console.error('Error saat mengambil data penjualan:', err);
      setError('Gagal mengambil data penjualan');
      setPenjualanList([]);
      toast.error('Gagal memuat data penjualan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error('Silakan login kembali');
      navigate('/login');
      return;
    }
    fetchPenjualan();
  }, [token, filter, navigate]); // Tambahkan navigate ke dalam dependency array

  // Handle Edit action for Penjualan
  const handleEditPenjualan = (penjualan) => {
    setSelectedPenjualan(penjualan);
    setShowUpdatePenjualanModal(true); // Show Update Modal
  };

  // Handle Delete action for Penjualan
  const handleDeletePenjualan = async (id) => {
    if (!id) {
      console.error('ID tidak valid:', id);
      return;
    }
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/penjualan/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setPenjualanList(penjualanList.filter((penjualan) => penjualan.id !== id));
        toast.success('Penjualan berhasil dihapus!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error saat menghapus data penjualan:', err);
      toast.error('Gagal menghapus penjualan.'); // Notifikasi gagal
    }
  };

  // Callback untuk menambahkan penjualan baru
  const handleAddPenjualan = (newPenjualan) => {
    setPenjualanList((prevList) => [newPenjualan, ...prevList]); // Tambahkan di atas
    toast.success('Penjualan berhasil ditambahkan!'); // Notifikasi sukses
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="penjualan-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Tabel Penjualan */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Penjualan Table</h6>
                <button
                  className="btn btn-success me-3"
                  onClick={() => {
                    setShowAddPenjualanModal(true);
                    toast.info('Silakan isi form untuk menambahkan penjualan.'); // Notifikasi info
                  }}
                >
                  + Add
                </button>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              {/* Filter Form */}
              <div className="filter-form mb-4 px-3 py-2 bg-light">
                <div className="row">
                  <div className="col-md-3">
                    <input
                      type="month"
                      className="form-control"
                      name="bulan"
                      placeholder="Cari Bulan"
                      value={filter.bulan}
                      onChange={handleFilterChange}
                    />
                  </div>
                 
                </div>
              </div>

              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>NIP</th>
                      <th>tanggal</th>
                      <th>Server</th>
                      <th>Demand</th>
                      <th>Rate</th>
                      <th>Keterangan</th>
                      <th>Koin Dijual</th>
                      <th>Jumlah Uang</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {penjualanList && penjualanList.length > 0 ? (
                      penjualanList.map((penjualan, index) => (
                        <tr key={penjualan.id}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{penjualan.NIP}</td>
                          <td>{penjualan.tgl_transaksi}</td>
                          <td>{penjualan.server}</td>
                          <td>{penjualan.demand}</td>
                          <td>{penjualan.rate}</td>
                          <td>{penjualan.ket}</td>
                          <td>{penjualan.dijual}</td>
                          <td>{penjualan.jumlah_uang}</td>
                          <td>
                            <button
                              className="btn btn-info btn-sm me-2 rounded"
                              onClick={() => handleEditPenjualan(penjualan)}
                            >
                              <FaPen />
                            </button>
                            <button
                              onClick={() => handleDeletePenjualan(penjualan.id)}
                              className="btn btn-danger btn-sm me-2 rounded"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9">Tidak ada penjualan tersedia</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add Penjualan Modal */}
          <ModalAddPenjualan
            showModal={showAddPenjualanModal}
            setShowModal={setShowAddPenjualanModal}
            setPenjualanList={setPenjualanList}
            token={token}
            onAddSuccess={handleAddPenjualan} // Callback untuk menambahkan penjualan baru
          />

          {/* Update Penjualan Modal */}
          <ModalUpdatePenjualan
            showModal={showUpdatePenjualanModal}
            setShowModal={setShowUpdatePenjualanModal}
            selectedPenjualan={selectedPenjualan}
            setPenjualanList={setPenjualanList}
            token={token}
          />
        </>
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

export default Penjualan;