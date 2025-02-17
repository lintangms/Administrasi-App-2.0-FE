import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const DaftarKasbon = () => {
  const [kasbonList, setKasbonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchKasbon = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/kasbon/get`, {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [token]);

  const updateStatus = async (id_kasbon, newStatus) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/kasbon/update/${id_kasbon}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(response.data.message);
      // Refresh the list after updating status
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

  return (
    <div className="kasbon-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Tabel Daftar Kasbon */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Daftar Kasbon</h6>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">No</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">NIP</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nominal</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Keperluan</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tanggal</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Dari</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Keterangan</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {kasbonList.length > 0 ? (
                      kasbonList.map((kasbon, index) => (
                        <tr key={kasbon.id_kasbon}>
                          <td>{index + 1}</td>
                          <td>{kasbon.NIP}</td>
                          <td>{kasbon.nominal}</td>
                          <td>{kasbon.keperluan}</td>
                          <td>{new Date(kasbon.tanggal).toLocaleDateString()}</td>
                          <td>{kasbon.dari}</td>
                          <td>{kasbon.ket}</td>
                          <td>{kasbon.status}</td>
                          <td>
                           
                            <button
                              className="btn btn-success btn-sm rounded ms-2"
                              onClick={() => updateStatus(kasbon.id_kasbon, 'lunas')}
                            >
                              Tandai Lunas
                            </button>
                            {/* <button
                              className="btn btn-warning btn-sm rounded ms-2"
                              onClick={() => updateStatus(kasbon.id_kasbon, 'belum_lunas')}
                            >
                              Tandai Belum Lunas
                            </button> */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9">Tidak ada data untuk ditampilkan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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

export default DaftarKasbon;