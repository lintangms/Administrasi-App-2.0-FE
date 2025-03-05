import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle, FaUsers, FaDollarSign } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RiwayatFarming = () => {
  const [farmingList, setFarmingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statsData, setStatsData] = useState({
    total_koin: 0,
    total_dijual: 0,
    total_saldo_koin: 0,
  });

  const token = localStorage.getItem('token');
  const NIP = localStorage.getItem('NIP');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  // Fetch Statistics Data
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/farming/getall/${NIP}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatsData(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch Riwayat Farming data
  useEffect(() => {
    if (!NIP) {
      toast.error('NIP tidak ditemukan. Silakan login kembali.');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStats(),
          fetchFarmingHistory()
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFarmingHistory = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/farming/get/${NIP}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setFarmingList(response.data.data);
        } else {
          setFarmingList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data riwayat farming:', err);
        setError('Tidak ada data riwayat farming');
        setFarmingList([]);
      }
    };

    fetchData();
  }, [token, NIP, navigate, BACKEND_URL]);

  const styles = {
    container: {
      padding: '20px',
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '15px',
      marginBottom: '40px',
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statIcon: {
      color: '#3498db',
      fontSize: '2rem',
    },
    statContent: {
      textAlign: 'right',
    },
    statTitle: {
      margin: 0,
      color: '#7f8c8d',
      fontSize: '0.9rem',
    },
    statValue: {
      margin: 0,
      color: '#2c3e50',
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    tableSection: {
      marginTop: '30px',
    }
  };

  return (
    <div style={styles.container}>
      {/* Stats Cards */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <FaDollarSign style={styles.statIcon} />
          <div style={styles.statContent}>
            <h5 style={styles.statTitle}>Total Koin</h5>
            <h2 style={styles.statValue}>{statsData.total_koin}</h2>
          </div>
        </div>
        <div style={styles.statCard}>
          <FaUsers style={styles.statIcon} />
          <div style={styles.statContent}>
            <h5 style={styles.statTitle}>Total Dijual</h5>
            <h2 style={styles.statValue}>{statsData.total_dijual}</h2>
          </div>
        </div>
        <div style={styles.statCard}>
          <FaInfoCircle style={styles.statIcon} />
          <div style={styles.statContent}>
            <h5 style={styles.statTitle}>Total Saldo Koin</h5>
            <h2 style={styles.statValue}>{statsData.total_saldo_koin}</h2>
          </div>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Tabel Riwayat Farming */}
          <div className="card my-4" style={styles.tableSection}>
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
                          <td>{index + 1}</td>
                          <td>{farming.NIP}</td>
                          <td>{farming.koin}</td>
                          <td>{new Date(farming.periode).toLocaleDateString()}</td>
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