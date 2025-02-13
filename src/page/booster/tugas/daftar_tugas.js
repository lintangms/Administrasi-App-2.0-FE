import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DaftarTugas = () => {
  const [tugasList, setTugasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const NIP = localStorage.getItem('NIP');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (!NIP) {
      toast.error('NIP tidak ditemukan. Silakan login kembali.');
      navigate('/login');
      return;
    }

    const fetchTugas = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/tugas/getnip/${NIP}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setTugasList(response.data.data);
        } else {
          setTugasList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data riwayat tugas:', err);
        setError('Tidak ada data riwayat tugas');
        setTugasList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTugas();
  }, [token, NIP, navigate]);

  return (
    <div className="tugas-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Tabel Daftar Tugas */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Daftar Tugas</h6>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">No</th>
                      {/* <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">NIP</th> */}
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Deskripsi</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tanggal Mulai</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tanggal Tenggat</th>
                      {/* <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {tugasList.length > 0 ? (
                      tugasList.map((tugas, index) => (
                        <tr key={tugas.id_tugas}>
                          <td>{index + 1}</td>
                          {/* <td>{tugas.NIP}</td> */}
                          <td>{tugas.deskripsi}</td>
                          <td>{new Date(tugas.tanggal_mulai).toLocaleDateString()}</td>
                          <td>{new Date(tugas.tanggal_tenggat).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">Tidak ada data untuk ditampilkan.</td>
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

export default DaftarTugas;