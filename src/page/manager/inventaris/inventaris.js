import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen, FaTrash, FaInfoCircle } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; 
import ModalAddInventaris from './modaladdinventaris'; // Modal untuk menambah Inventaris
import ModalUpdateInventaris from './modalupdateinventaris'; // Modal untuk memperbarui Inventaris
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const Inventaris = () => {
  const [inventarisList, setInventarisList] = useState([]); // State untuk Inventaris
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedInventaris, setSelectedInventaris] = useState(null); // State untuk Inventaris yang dipilih
  const [showAddInventarisModal, setShowAddInventarisModal] = useState(false);
  const [showUpdateInventarisModal, setShowUpdateInventarisModal] = useState(false);

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env

  // Fetch Inventaris data
  useEffect(() => {
    const fetchInventaris = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/inventaris/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setInventarisList(response.data.data);
        } else {
          setInventarisList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data inventaris:', err);
        setError('Tidak ada data inventaris');
        setInventarisList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventaris();
  }, [token]);

  // Handle Edit action for Inventaris
  const handleEditInventaris = (inventaris) => {
    setSelectedInventaris(inventaris);
    setShowUpdateInventarisModal(true); // Show Update Modal
  };

  // Handle Delete action for Inventaris
  const handleDeleteInventaris = async (id) => {
    if (!id) {
      console.error('ID tidak valid:', id);
      return;
    }
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/inventaris/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setInventarisList(inventarisList.filter((inventaris) => inventaris.id_inventaris !== id));
        toast.success('Inventaris berhasil dihapus!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error saat menghapus data inventaris:', err);
      toast.error('Gagal menghapus inventaris.'); // Notifikasi gagal
    }
  };

  // Callback untuk menambahkan inventaris baru
  const handleAddInventaris = (newInventaris) => {
    setInventarisList((prevList) => [newInventaris, ...prevList]); // Tambahkan di atas
    toast.success('Inventaris berhasil ditambahkan!'); // Notifikasi sukses
  };

  return (
    <div className="inventaris-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Tabel Inventaris */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Inventaris Table</h6>
                <button
                  className="btn btn-success me-3"
                  onClick={() => {
                    setShowAddInventarisModal(true);
                    toast.info('Silakan isi form untuk menambahkan inventaris.'); // Notifikasi info
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
                        Nama Barang
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Tanggal Beli
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Harga
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Ket
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {inventarisList && inventarisList.length > 0 ? (
                      inventarisList.map((inventaris, index) => (
                        <tr key={inventaris.id_inventaris}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{inventaris.nama_barang}</td>
                          <td>{new Date(inventaris.tgl_beli).toLocaleDateString("id-ID")}</td>
                          <td>{inventaris.harga}</td>
                          <td>{inventaris.ket}</td>
                          <td>
                            <button
                              className="btn btn-info btn-sm me-2 rounded" // Tambahkan kelas rounded
                              onClick={() => handleEditInventaris(inventaris)}
                            >
                              <FaPen />
                            </button>
                            <button
                              onClick={() => handleDeleteInventaris(inventaris.id_inventaris)}
                              className="btn btn-danger btn-sm me-2 rounded" // Tambahkan kelas rounded
                            >
                              <FaTrash />
                            </button>
                            
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">Tidak ada inventaris tersedia</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add Inventaris Modal */}
          <ModalAddInventaris
            showModal={showAddInventarisModal}
            setShowModal={setShowAddInventarisModal}
            setInventarisList={setInventarisList} // Ganti dengan setInventarisList
            token={token}
            onAddSuccess={handleAddInventaris} // Callback untuk menambahkan inventaris baru
          />

          {/* Update Inventaris Modal */}
          <ModalUpdateInventaris
            showModal={showUpdateInventarisModal}
            setShowModal={setShowUpdateInventarisModal}
            selectedInventaris={selectedInventaris} // Ganti dengan selectedInventaris
            setInventarisList={setInventarisList} // Ganti dengan setInventarisList
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

export default Inventaris;