import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RiwayatAbsen = () => {
  const [absenList, setAbsenList] = useState([]);
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

    const fetchAbsen = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/absen/get/${NIP}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setAbsenList(response.data.data);
        } else {
          setAbsenList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data riwayat absensi:', err);
        setError('Gagal mengambil data riwayat absensi');
        setAbsenList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsen();
  }, [token, NIP, navigate]);

  return (
    <div className="absen-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Riwayat Absensi</h6>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">No</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">NIP</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tanggal</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absenList.length > 0 ? (
                      absenList.map((absen, index) => (
                        <tr key={absen.id_absen}>
                          <td>{index + 1}</td>
                          <td>{absen.NIP}</td>
                          <td>{new Date(absen.tanggal).toLocaleDateString()}</td>
                          <td>{absen.status}</td>
                          <td>
                            <Link to={`/absen/detail_absen/${absen.id_absen}`} className="btn btn-primary btn-sm rounded">
                              <FaInfoCircle />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">Tidak ada data untuk ditampilkan.</td>
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
        .table th, .table td {
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

export default RiwayatAbsen;
