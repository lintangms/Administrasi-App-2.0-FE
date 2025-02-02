import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Jabatan_Divisi_Direktur = () => {
  const [divisiList, setDivisiList] = useState([]);
  const [jabatanList, setJabatanList] = useState([]); // State untuk Jabatan
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
                    </tr>
                  </thead>

                  <tbody>
                    {divisiList && divisiList.length > 0 ? (
                      divisiList.map((divisi, index) => (
                        <tr key={divisi.id_divisi}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{divisi.nama_divisi}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">Tidak ada divisi tersedia</td>
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
                    </tr>
                  </thead>

                  <tbody>
                    {jabatanList && jabatanList.length > 0 ? (
                      jabatanList.map((jabatan, index) => (
                        <tr key={jabatan.id_jabatan}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{jabatan.nama_jabatan}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">Tidak ada jabatan tersedia</td>
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

export default Jabatan_Divisi_Direktur;