import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen, FaTrash, FaInfoCircle } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; 
import ModalAddAkun from './modaladdakun'; // Modal untuk menambah Akun
import ModalUpdateAkun from './modalupdateakun'; // Modal untuk memperbarui Akun
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const Akun = () => {
  const [akunList, setAkunList] = useState([]); // State untuk Akun
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAkun, setSelectedAkun] = useState(null); // State untuk Akun yang dipilih
  const [showAddAkunModal, setShowAddAkunModal] = useState(false);
  const [showUpdateAkunModal, setShowUpdateAkunModal] = useState(false);

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env

  // Fetch Akun data
  useEffect(() => {
    const fetchAkun = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/akun/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setAkunList(response.data.data);
        } else {
          setAkunList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data akun:', err);
        setError('Gagal mengambil data akun');
        setAkunList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAkun();
  }, [token]);

  // Handle Edit action for Akun
  const handleEditAkun = (akun) => {
    setSelectedAkun(akun);
    setShowUpdateAkunModal(true); // Show Update Modal
  };

  // Handle Delete action for Akun
  const handleDeleteAkun = async (id) => {
    if (!id) {
      console.error('ID tidak valid:', id);
      return;
    }
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/akun/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setAkunList(akunList.filter((akun) => akun.id_akun !== id));
        toast.success('Akun berhasil dihapus!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error saat menghapus data akun:', err);
      toast.error('Gagal menghapus akun.'); // Notifikasi gagal
    }
  };

  // Callback untuk menambahkan akun baru
  const handleAddAkun = (newAkun) => {
    setAkunList((prevList) => [newAkun, ...prevList]); // Tambahkan di atas
    toast.success('Akun berhasil ditambahkan!'); // Notifikasi sukses
  };

  return (
    <div className="akun-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Tabel Akun */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Akun Table</h6>
                <button
                  className="btn btn-success me-3"
                  onClick={() => {
                    setShowAddAkunModal(true);
                    toast.info('Silakan isi form untuk menambahkan akun.'); // Notifikasi info
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
                        Username
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Jenis
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        No Pemulihan
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Email Pemulihan
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
                    {akunList && akunList.length > 0 ? (
                      akunList.map((akun, index) => (
                        <tr key={akun.id_akun}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{akun.username}</td>
                          <td>{akun.jenis}</td>
                          <td>{akun.no_pemulihan}</td>
                          <td>{akun.email_pemulihan}</td>
                          <td>{akun.ket}</td>
                          <td>
                            <button
                              className="btn btn-info btn-sm me-2 rounded" // Tambahkan kelas rounded
                              onClick={() => handleEditAkun(akun)}
                            >
                              <FaPen />
                            </button>
                            <button
                              onClick={() => handleDeleteAkun(akun.id_akun)}
                              className="btn btn-danger btn-sm me-2 rounded" // Tambahkan kelas rounded
                            >
                              <FaTrash />
                            </button>
                           
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">Tidak ada akun tersedia</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add Akun Modal */}
          <ModalAddAkun
            showModal={showAddAkunModal}
            setShowModal={setShowAddAkunModal}
            setAkunList={setAkunList} // Ganti dengan setAkunList
            token={token}
            onAddSuccess={handleAddAkun} // Callback untuk menambahkan akun baru
          />

          {/* Update Akun Modal */}
          <ModalUpdateAkun
            showModal={showUpdateAkunModal}
            setShowModal={setShowUpdateAkunModal}
            selectedAkun={selectedAkun} // Ganti dengan selectedAkun
            setAkunList={setAkunList} // Ganti dengan setAkunList
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

export default Akun;