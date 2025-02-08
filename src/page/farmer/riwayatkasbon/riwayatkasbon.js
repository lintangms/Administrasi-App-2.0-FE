import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RiwayatKasbon = () => {
  const [kasbonList, setKasbonList] = useState([]);
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

    const fetchKasbon = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/kasbon/get/${NIP}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setKasbonList(response.data.data);
        } else {
          setKasbonList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data riwayat kasbon:', err);
        setError('Tidak ada data riwayat kasbon');
        setKasbonList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKasbon();
  }, [token, NIP, navigate]);

  return (
    <div className="kasbon-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card my-4">
          <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
              <h6 className="text-white text-capitalize ps-3">Riwayat Kasbon</h6>
            </div>
          </div>
          <div className="card-body px-0 pb-2">
            <div className="table-responsive p-0">
              <table className="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">No</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">NIP</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Jumlah</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tanggal</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kasbonList.length > 0 ? (
                    kasbonList.map((kasbon, index) => (
                      <tr key={kasbon.id_kasbon}>
                        <td>{index + 1}</td>
                        <td>{kasbon.NIP}</td>
                        <td>{kasbon.jumlah}</td>
                        <td>{new Date(kasbon.tanggal).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/kasbon/detail/${kasbon.id_kasbon}`} className="btn btn-primary btn-sm rounded">
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
      )}
    </div>
  );
};

export default RiwayatKasbon;
