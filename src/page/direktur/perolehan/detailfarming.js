import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const FarmingDetails = () => {
  const { NIP } = useParams(); // Get NIP from URL parameters
  const [farmingDetails, setFarmingDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const fetchFarmingDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/farming/get/${NIP}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmingDetails(response.data.data);
    } catch (err) {
      console.error('Error fetching farming details:', err);
      setError('Gagal memuat data farming per NIP');
      toast.error('Gagal memuat data farming per NIP');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmingDetails();
  }, [NIP]);

  return (
    <div className="farming-details-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="card my-4">
          <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
              <h6 className="text-white text-capitalize ps-3">Detail Perolehan Farming NIP : {NIP}</h6>
            </div>
          </div>
          <div className="card-body px-0 pb-2">
            <div className="table-responsive p-0">
              <table className="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">No</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">NIP</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nama</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Akun Steam</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Koin</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Periode</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nama Shift</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nama Game</th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {farmingDetails.length > 0 ? (
                    farmingDetails.map((detail, index) => (
                      <tr key={detail.id_farming}>
                        <td>{index + 1}</td>
                        <td>{detail.NIP}</td>
                        <td>{detail.nama}</td>
                        <td>{detail.username_steam}</td>
                        <td>{detail.koin}</td>
                        <td>{new Date(detail.periode).toLocaleString("id-ID")}</td>
                        <td>{detail.nama_shift}</td>
                        <td>{detail.nama_game}</td>
                        <td>{detail.ket}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">Tidak ada data farming tersedia</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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

        .border-radius-lg {
          border-radius: 0.5rem;
        }

        .filter-form { 
          background-color: #f8f9fa; 
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
};

export default FarmingDetails;