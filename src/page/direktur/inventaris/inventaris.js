import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; 
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const Inventaris_Direktur = () => {
  const [inventarisList, setInventarisList] = useState([]); // State untuk Inventaris
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        if (response.data) {
          setInventarisList(response.data);
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

export default Inventaris_Direktur;