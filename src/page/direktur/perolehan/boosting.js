import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; 
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const Boosting = () => {
  const [boostingList, setBoostingList] = useState([]); // State untuk data boosting
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env

  // Fetch Boosting data
  useEffect(() => {
    const fetchBoosting = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/boosting/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setBoostingList(response.data.data); // Mengambil data dari response
        } else {
          setBoostingList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data boosting:', err);
        setError('Gagal mengambil data boosting');
        setBoostingList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBoosting();
  }, [token]);

  return (
    <div className="boosting-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Tabel Boosting */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Boosting Table</h6>
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
                        Nominal
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Periode
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
                    {boostingList && boostingList.length > 0 ? (
                      boostingList.map((boosting, index) => (
                        <tr key={boosting.id_boosting}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{boosting.NIP}</td>
                          <td>{boosting.nominal}</td>
                          <td>{boosting.periode}</td>
                          <td>{boosting.ket}</td>
                          <td>
                            <Link to={`/boosting/detail/${boosting.id_boosting}`} className="btn btn-primary btn-sm rounded">
                              <FaInfoCircle />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">Tidak ada data boosting tersedia</td>
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
          border-bottom:  2px solid #dee2e6;
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
export default Boosting;