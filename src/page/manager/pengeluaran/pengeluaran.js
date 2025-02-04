import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen, FaTrash, FaInfoCircle } from 'react-icons/fa'; 
import ModalAddPengeluaran from './modaladdpengeluaran'; // Modal untuk menambah Pengeluaran
import ModalUpdatePengeluaran from './modalupdatepengeluaran'; // Modal untuk memperbarui Pengeluaran
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const Pengeluaran = () => {
  const [pengeluaranList, setPengeluaranList] = useState([]); // State untuk Pengeluaran
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPengeluaran, setSelectedPengeluaran] = useState(null); // State untuk Pengeluaran yang dipilih
  const [showAddPengeluaranModal, setShowAddPengeluaranModal] = useState(false);
  const [showUpdatePengeluaranModal, setShowUpdatePengeluaranModal] = useState(false);

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env

  // Fetch Pengeluaran data
  useEffect(() => {
    const fetchPengeluaran = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/pengeluaran/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setPengeluaranList(response.data.data);
        } else {
          setPengeluaranList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data pengeluaran:', err);
        setError('Gagal mengambil data pengeluaran');
        setPengeluaranList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPengeluaran();
  }, [token]);

  // Handle Edit action for Pengeluaran
  const handleEditPengeluaran = (pengeluaran) => {
    setSelectedPengeluaran(pengeluaran);
    setShowUpdatePengeluaranModal(true); // Show Update Modal
  };

  // Handle Delete action for Pengeluaran
  const handleDeletePengeluaran = async (id) => {
    if (!id) {
      console.error('ID tidak valid:', id);
      return;
    }
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/pengeluaran/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setPengeluaranList(pengeluaranList.filter((pengeluaran) => pengeluaran.id_pengeluaran !== id));
        toast.success('Pengeluaran berhasil dihapus!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error saat menghapus data pengeluaran:', err);
      toast.error('Gagal menghapus pengeluaran.'); // Notifikasi gagal
    }
  };

  // Callback untuk menambahkan pengeluaran baru
  const handleAddPengeluaran = (newPengeluaran) => {
    setPengeluaranList((prevList) => [newPengeluaran, ...prevList]); // Tambahkan di atas
    toast.success('Pengeluaran berhasil ditambahkan!'); // Notifikasi sukses
  };

  // Callback untuk memperbarui pengeluaran
  const handleUpdatePengeluaran = (updatedPengeluaran) => {
    setPengeluaranList((prevList) =>
      prevList.map((pengeluaran) =>
        pengeluaran.id_pengeluaran === updatedPengeluaran.id_pengeluaran
          ? updatedPengeluaran
          : pengeluaran
      )
    );
    toast.success('Pengeluaran berhasil diperbarui!'); // Notifikasi sukses
  };

  return (
    <div className="pengeluaran-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Tabel Pengeluaran */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Pengeluaran Table</h6>
                <button
                  className="btn btn-success me-3"
                  onClick={() => {
                    setShowAddPengeluaranModal(true);
                    toast.info('Silakan isi form untuk menambahkan pengeluaran.'); // Notifikasi info
                  }}
                >
                  + Add
                </button>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        No
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Tanggal Transaksi
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Uraian
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Nominal
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Keterangan
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {pengeluaranList && pengeluaranList.length > 0 ? (
                      pengeluaranList.map((pengeluaran, index) => (
                        <tr key={pengeluaran.id_pengeluaran}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{new Date(pengeluaran.tgl_transaksi).toLocaleDateString("id-ID")}</td>
                          <td>{pengeluaran.uraian}</td>
                          <td>{pengeluaran.nominal}</td>
                          <td>{pengeluaran.ket}</td>
                          <td>
                            <button
                              className="btn btn-info btn-sm me-2 rounded" // Tambahkan kelas rounded
                              onClick={() => handleEditPengeluaran(pengeluaran)}
                            >
                              <FaPen />
                            </button>
                            <button
                              onClick={() => handleDeletePengeluaran(pengeluaran.id_pengeluaran)}
                              className="btn btn-danger btn-sm me-2 rounded" // Tambahkan kelas rounded
                            >
                              <FaTrash />
                            </button>
                          
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">Tidak ada pengeluaran tersedia</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add Pengeluaran Modal */}
          <ModalAddPengeluaran
            showModal={showAddPengeluaranModal}
            setShowModal={setShowAddPengeluaranModal}
            onAddSuccess={handleAddPengeluaran} // Callback untuk menambahkan pengeluaran baru
            token={token}
          />

          {/* Update Pengeluaran Modal */}
          <ModalUpdatePengeluaran
            showModal={showUpdatePengeluaranModal}
            setShowModal={setShowUpdatePengeluaranModal}
            selectedPengeluaran={selectedPengeluaran} // Ganti dengan selectedPengeluaran
            onUpdateSuccess={handleUpdatePengeluaran} // Callback untuk memperbarui pengeluaran
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
      `}</style>
    </div>
  );
};

export default Pengeluaran;