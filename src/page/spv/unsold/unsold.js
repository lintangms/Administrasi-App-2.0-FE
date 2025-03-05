import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCoins, FaChartLine } from 'react-icons/fa'; 
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';
import ModalAddUnsold from './modaladdunsold'; // Updated import name

const Unsold = () => {
    const [unsoldList, setUnsoldList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
    });
    const [statsData, setStatsData] = useState({
        total_koin: 0,
        total_harga: 0,
    });
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [selectedUnsold, setSelectedUnsold] = useState(null);

    const token = localStorage.getItem('token');
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();

    const fetchUnsold = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/unsold/get`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    bulan: filter.bulan,
                    tahun: filter.tahun,
                },
            });
            if (response.data && response.data.data) {
                setUnsoldList(response.data.data);
            } else {
                setUnsoldList([]);
            }
        } catch (err) {
            console.error('Error saat mengambil data unsold:', err);
            setError('Gagal mengambil data unsold');
            setUnsoldList([]);
            toast.error('Gagal memuat data unsold');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/unsold/total`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    bulan: filter.bulan,
                    tahun: filter.tahun,
                },
            });
            if (response.data) {
                setStatsData(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching total unsold stats:', err);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error('Silakan login kembali');
            navigate('/login');
            return;
        }
        fetchUnsold();
        fetchStats();
    }, [token, filter, navigate]);

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    const handleOpenModalUpdate = (unsold) => {
        setSelectedUnsold(unsold);
        setShowModalUpdate(true);
    };

    return (
        <div className="total-unsold-container">
            {error && <p className="error-message">{error}</p>}

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '40px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FaCoins style={{ color: '#3498db', fontSize: '2rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>Total Koin</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem', fontWeight: 'bold' }}>{statsData.total_koin}</h2>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FaChartLine style={{ color: '#3498db', fontSize: '2rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>Total Harga</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem', fontWeight: 'bold' }}>{statsData.total_harga}</h2>
                    </div>
                </div>
            </div>

            {/* Unsold Table Header */}
            <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                        <h6 className="text-white text-capitalize ps-3">Unsold Table</h6>
                    </div>
                </div>

                {/* Filter Form */}
                <div className="filter-form mb-4 px-3 py-2 bg-light">
                    <div className="row">
                        <div className="col-md-4">
                            <select
                                className="form-control"
                                name="bulan"
                                value={filter.bulan}
                                onChange={handleFilterChange}
                            >
                                <option value="">Pilih Bulan</option>
                                {[...Array(12)].map((_, index) => (
                                    <option key={index} value={index + 1}>
                                        {new Date(0, index).toLocaleString('id-ID', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-control"
                                name="tahun"
                                value={filter.tahun}
                                onChange={handleFilterChange}
                            >
                                <option value="">Pilih Tahun</option>
                                {[...Array(5)].map((_, index) => (
                                    <option key={index} value={2025 + index}>
                                        {2025 + index}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="card-body px-0 pb-2">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="table-responsive p-0">
                            <table className="table align-items-center mb-0">
                                <thead>
                                    <tr>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">No</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">NIP</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Game</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Akun Steam</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tanggal</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Koin</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Harga Beli</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Total Harga</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {unsoldList && unsoldList.length > 0 ? (
                                        unsoldList.map((unsold, index) => (
                                            <tr key={unsold.id_unsold}>
                                                <td>{index + 1}</td>
                                                <td>{unsold.NIP}</td>
                                                <td>{unsold.nama_game}</td>
                                                <td>{unsold.username_steam}</td>
                                                <td>{new Date(unsold.tanggal).toLocaleDateString('id-ID')}</td>
                                                <td>{unsold.koin}</td>
                                                <td>{unsold.harga_beli}</td>
                                                <td>{unsold.total_harga}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleOpenModalUpdate(unsold)}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7">Tidak ada data unsold tersedia</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showModalUpdate && selectedUnsold && (
                <ModalAddUnsold
                    showModal={showModalUpdate}
                    setShowModal={setShowModalUpdate}
                    token={token}
                    selectedUnsold={selectedUnsold}
                    onAddSuccess={async (updatedData) => {
                        await fetchUnsold();
                        setShowModalUpdate(false);
                    }}
                />
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

                .filter-form { 
                    background-color: #f8f9fa; 
                    border-radius: 0.375rem;
                }
            `}</style>
        </div>
    );
};

export default Unsold;