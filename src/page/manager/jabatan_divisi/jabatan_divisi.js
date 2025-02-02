import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen, FaTrash } from 'react-icons/fa';
import ModalAdddivisi from './modaladddivisi.js';
import ModalUpdatedivisi from './modalupdatedivisi.js';
import ModalAddjabatan from './modaladdjabatan.js';
import ModalUpdatejabatan from './modalupdatejabatan.js';
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const Jabatan_Divisi = () => {
  const [divisiList, setDivisiList] = useState([]);
  const [jabatanList, setJabatanList] = useState([]); // State untuk Jabatan
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDivisi, setSelectedDivisi] = useState(null);
  const [selectedJabatan, setSelectedJabatan] = useState(null); // State untuk Jabatan yang dipilih
  const [showAddDivisiModal, setShowAddDivisiModal] = useState(false);
  const [showUpdateDivisiModal, setShowUpdateDivisiModal] = useState(false);
  const [showAddJabatanModal, setShowAddJabatanModal] = useState(false);
  const [showUpdateJabatanModal, setShowUpdateJabatanModal] = useState(false);

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env

  // Fetch divisi data
  useEffect(() => {
    const fetchDivisi = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/divisi/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setDivisiList(response.data.data);
        } else {
          setDivisiList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data divisi:', err);
        setError('Gagal mengambil data divisi');
        setDivisiList([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchJabatan = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/jabatan/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setJabatanList(response.data.data);
        } else {
          setJabatanList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data jabatan:', err);
        setError('Gagal mengambil data jabatan');
        setJabatanList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDivisi();
    fetchJabatan();
  }, [token]);

  // Handle Edit action for Divisi
  const handleEditDivisi = (divisi) => {
    setSelectedDivisi(divisi);
    setShowUpdateDivisiModal(true); // Show Update Modal
  };

  // Handle Delete action for Divisi
  const handleDeleteDivisi = async (id) => {
    if (!id) {
      console.error('ID tidak valid:', id);
      return;
    }
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/divisi/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setDivisiList(divisiList.filter((divisi) => divisi.id_divisi !== id));
        toast.success('Divisi berhasil dihapus!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error saat menghapus data divisi:', err);
      toast.error('Gagal menghapus divisi.'); // Notifikasi gagal
    }
  };

  // Handle Edit action for Jabatan
  const handleEditJabatan = (jabatan) => {
    setSelectedJabatan(jabatan);
    setShowUpdateJabatanModal(true); // Show Update Modal
  };

  // Handle Delete action for Jabatan
  const handleDeleteJabatan = async (id) => {
    if (!id) {
      console.error('ID tidak valid:', id);
      return;
    }
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/jabatan/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setJabatanList(jabatanList.filter((jabatan) => jabatan.id_jabatan !== id));
        toast.success('Jabatan berhasil dihapus!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error saat menghapus data jabatan:', err);
      toast.error('Gagal menghapus jabatan.'); // Notifikasi gagal
    }
  };

  // Callback untuk menambahkan divisi baru
  const handleAddDivisi = (newDivisi) => {
    setDivisiList((prevList) => [newDivisi, ...prevList]); // Tambahkan di atas
    toast.success('Divisi berhasil ditambahkan!'); // Notifikasi sukses
  };

  // Callback untuk menambahkan jabatan baru
  const handleAddJabatan = (newJabatan) => {
    setJabatanList((prevList) => [newJabatan, ...prevList]); // Tambahkan di atas
    toast.success('Jabatan berhasil ditambahkan!'); // Notifikasi sukses
  };

  return (
    <div className="riwayat-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Tabel Divisi */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Divisi Table</h6>
                <button
                  className="btn btn-success me-3"
                  onClick={() => {
                    setShowAddDivisiModal(true);
                    toast.info('Silakan isi form untuk menambahkan divisi.'); // Notifikasi info
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
                        Nama Divisi
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {divisiList && divisiList.length > 0 ? (
                      divisiList.map((divisi, index) => (
                        <tr key={divisi.id_divisi}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{divisi.nama_divisi}</td>
                          <td className="d-flex">
                            <button
                              className="btn btn-info btn-sm me-2 rounded" // Tambahkan kelas rounded
                              onClick={() => handleEditDivisi(divisi)}
                            >
                              <FaPen />
                            </button>
                            <button
                              onClick={() => handleDeleteDivisi(divisi.id_divisi)}
                              className="btn btn-danger btn-sm me-2 rounded" // Tambahkan kelas rounded
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">Tidak ada divisi tersedia</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tabel Jabatan */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Jabatan Table</h6>
                <button
                  className="btn btn-success me-3"
                  onClick={() => {
                    setShowAddJabatanModal(true);
                    toast.info('Silakan isi form untuk menambahkan jabatan.'); // Notifikasi info
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
                        Nama Jabatan
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {jabatanList && jabatanList.length > 0 ? (
                      jabatanList.map((jabatan, index) => (
                        <tr key={jabatan.id_jabatan}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{jabatan.nama_jabatan}</td>
                          <td className="d-flex">
                            <button
                              className="btn btn-info btn-sm me-2 rounded" // Tambahkan kelas rounded
                              onClick={() => handleEditJabatan(jabatan)}
                            >
                              <FaPen />
                            </button>
                            <button
                              onClick={() => handleDeleteJabatan(jabatan.id_jabatan)}
                              className="btn btn-danger btn-sm me-2 rounded" // Tambahkan kelas rounded
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">Tidak ada jabatan tersedia</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add Divisi Modal */}
          <ModalAdddivisi
            showModal={showAddDivisiModal}
            setShowModal={setShowAddDivisiModal}
            setDivisiList={setDivisiList}
            token={token}
            onAddSuccess={handleAddDivisi} // Callback untuk menambahkan divisi baru
          />

          {/* Update Divisi Modal */}
          <ModalUpdatedivisi
            showModal={showUpdateDivisiModal}
            setShowModal={setShowUpdateDivisiModal}
            selectedDivisi={selectedDivisi}
            setDivisiList={setDivisiList}
            token={token}
          />

          {/* Add Jabatan Modal */}
          <ModalAddjabatan
            showModal={showAddJabatanModal}
            setShowModal={setShowAddJabatanModal}
            setJabatanList={setJabatanList} // Ganti dengan setJabatanList
            token={token}
            onAddSuccess={handleAddJabatan} // Callback untuk menambahkan jabatan baru
          />

          {/* Update Jabatan Modal */}
          <ModalUpdatejabatan
            showModal={showUpdateJabatanModal}
            setShowModal={setShowUpdateJabatanModal}
            selectedJabatan={selectedJabatan} // Ganti dengan selectedJabatan
            setJabatanList={setJabatanList} // Ganti dengan setJabatanList
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

export default Jabatan_Divisi;