import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const RiwayatFarming = () => {
  const [farmingList, setFarmingList] = useState([]); // State untuk Riwayat Farming
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const NIP = localStorage.getItem('NIP'); // Ambil NIP dari localStorage
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env
  const navigate = useNavigate();

  // Fetch Riwayat Farming data
  useEffect(() => {
    if (!NIP) {
      // Jika NIP tidak ada, arahkan ke halaman login
      toast.error('NIP tidak ditemukan. Silakan login kembali.');
      navigate('/login');
      return;
    }

    const fetchFarming = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/farming/get/${NIP}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setFarmingList(response.data.data); // Ambil data dari response dan simpan dalam array
        } else {
          setFarmingList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data riwayat farming:', err);
        setError('Tidak ada data riwayat farming');
        setFarmingList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFarming();
  }, [token, NIP, navigate]);

  return (
    <div className="farming-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Tabel Riwayat Farming */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Riwayat Farming</h6>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">No</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">NIP</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Koin</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Periode</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {farmingList.length > 0 ? (
                      farmingList.map((farming, index) => (
                        <tr key={farming.id_farming}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{farming.NIP}</td>
                          <td>{farming.koin}</td>
                          <td>{new Date(farming.periode).toLocaleDateString()}</td> {/* Format tanggal */}
                          <td>
                            <Link to={`/farmer/detail_farming/${farming.id_farming}`} className="btn btn-primary btn-sm rounded">
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

export default RiwayatFarming;