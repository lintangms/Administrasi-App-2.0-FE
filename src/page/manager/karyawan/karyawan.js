import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen, FaTrash, FaInfoCircle } from 'react-icons/fa' 
import { Link } from 'react-router-dom'; 
import ModalAddKaryawan from './modaladdkaryawan';
import ModalUpdateKaryawan from './modalupdatekaryawan';
import { toast } from 'react-toastify';

const Karyawan = () => {
  const [karyawanList, setKaryawanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const [showAddKaryawanModal, setShowAddKaryawanModal] = useState(false);
  const [showUpdateKaryawanModal, setShowUpdateKaryawanModal] = useState(false);

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchKaryawan = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/karyawan/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setKaryawanList(response.data);
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
  }, [token, BACKEND_URL]);

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
                <button
                  className="btn btn-success me-3"
                  onClick={() => {
                    setShowAddKaryawanModal(true);
                    toast.info('Silakan isi form untuk menambahkan karyawan.');
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
                    {karyawanList && karyawanList.length > 0 ? (
                      karyawanList.map((karyawan, index) => (
                        <tr key={karyawan.id_karyawan}>
                          <td>{index + 1}</td>
                          <td>{karyawan.NIP}</td>
                          <td>{karyawan.nama}</td>
                          <td>
                            <button
                              className="btn btn-info btn-sm me-2 rounded"
                              onClick={() => handleEditKaryawan(karyawan)}
                            >
                              <FaPen />
                            </button>
                            <button
                              onClick={() => handleDeleteKaryawan(karyawan.id_karyawan)}
                              className="btn btn-danger btn-sm me-2 rounded"
                            >
                              <FaTrash />
                            </button>
                            {/* Updated Link component with proper NIP passing */}
                            <Link 
                              to={`/manager/detail_karyawan/${encodeURIComponent(karyawan.NIP)}`} 
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

          <ModalAddKaryawan
            showModal={showAddKaryawanModal}
            setShowModal={setShowAddKaryawanModal}
            setKaryawanList={setKaryawanList}
            token={token}
            onAddSuccess={handleAddKaryawan}
          />

          <ModalUpdateKaryawan
            showModal={showUpdateKaryawanModal}
            setShowModal={setShowUpdateKaryawanModal}
            selectedKaryawan={selectedKaryawan}
            setKaryawanList={setKaryawanList}
            token={token}
          />
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

export default Karyawan;