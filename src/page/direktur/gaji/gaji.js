import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaDollarSign, FaMoneyBillWave, FaClipboardList, FaChartLine, FaUser  } from 'react-icons/fa';

const DataGaji_Direktur = () => {
    const [totalGajiList, setTotalGajiList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({
        nama: '',
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
    });
    const [statsData, setStatsData] = useState({
        total_gaji_kotor: 0,
        total_kasbon: 0,
        total_tunjangan_jabatan: 0,
        total_THP: 0,
    });
    const [activeView, setActiveView] = useState('lama'); // 'lama' or 'baru'

    const token = localStorage.getItem('token');
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const fetchTotalGaji = async () => {
        setLoading(true);
        try {
            const endpoint = activeView === 'lama' ? 'getlama' : 'getbaru';
            const response = await axios.get(`${BACKEND_URL}/api/gaji/${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    nama: filter.nama,
                    bulan: filter.bulan,
                    tahun: filter.tahun,
                },
            });
            if (response.data) {
                setTotalGajiList(response.data.data);
            } else {
                setTotalGajiList([]);
            }
        } catch (err) {
            console.error(`Error saat mengambil data total gaji ${activeView}:`, err);
            setError('');
            setTotalGajiList([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/gaji/total`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    bulan: filter.bulan,
                    tahun: filter.tahun,
                    status: activeView,
                },
            });
            if (response.data) {
                setStatsData(response.data);
            }
        } catch (err) {
            console.error('Error fetching total gaji:', err);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error('Silakan login kembali');
            return;
        }
        fetchTotalGaji();
        fetchStats();
    }, [token, filter, activeView]);

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    const handleViewChange = (view) => {
        setActiveView(view);
    };

    return (
        <div className="total-gaji-container">
            {error && <p className="error-message">{error}</p>}

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FaDollarSign style={{ color: '#3498db', fontSize: '2rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>Total Gaji Kotor</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem', fontWeight: 'bold' }}>{statsData.total_gaji_kotor}</h2>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FaMoneyBillWave style={{ color: '#3498db', fontSize: '2rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>Total Kasbon</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem', fontWeight: 'bold' }}>{statsData.total_kasbon}</h2>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FaClipboardList style={{ color: '#3498db', fontSize: '2rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>Total Tunjangan</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem', fontWeight: 'bold' }}>{statsData.total_tunjangan_jabatan}</h2>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FaChartLine style={{ color: '#3498db', fontSize: '2rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>Total THP</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem', fontWeight: 'bold' }}>{statsData.total_THP}</h2>
                    </div>
                </div>
            </div>

            {/* Status Toggle Buttons - Smaller Size */}
            <div className="view-toggle-container mb-4">
                <div className="btn-group" role="group" aria-label="Status toggle">
                    <button
                        type="button"
                        className={`btn btn-sm ${activeView === 'lama' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleViewChange('lama')}
                    >
                        <FaUser  className="me-1" style={{ fontSize: '0.8rem' }} />
                        Karyawan Status Lama
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm ${activeView === 'baru' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleViewChange('baru')}
                    >
                        <FaUser  className="me-1" style={{ fontSize: '0.8rem' }} />
                        Karyawan Status Baru
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                        <h6 className="text-white text-capitalize ps-3">
                            Total Gaji {activeView === 'lama' ? 'Karyawan Status Lama' : 'Karyawan Status Baru'}
                        </h6>
                    </div>
                </div>

                {/* Filter Form */}
                <div className="filter-form mb-4 px-3 py-2 bg-light">
                    <div className="row">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                name="nama"
                                placeholder="Cari Nama"
                                value={filter.nama}
                                onChange={handleFilterChange}
                            />
                        </div>
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
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nama</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Sold</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Unsold</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Gaji Kotor</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Potongan</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tunjangan</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Kasbon</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">THP</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tanggal Transaksi</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {totalGajiList && totalGajiList.length > 0 ? (
                                        totalGajiList.map((gaji, index) => (
                                            <tr key={gaji.id_gaji}>
                                                <td>{index + 1}</td>
                                                <td>{gaji.NIP}</td>
                                                <td>{gaji.nama}</td>
                                                <td>{gaji.total_dijual}</td>
                                                <td>{gaji.total_unsold_koin}</td>
                                                <td>{gaji.gaji_kotor}</td>
                                                <td>{gaji.potongan}</td>
                                                <td>{gaji.tunjangan_jabatan}</td>
                                                <td>{gaji.kasbon}</td>
                                                <td>{gaji.THP}</td>
                                                <td>{new Date(gaji.tgl_transaksi).toLocaleDateString('id-ID')}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10">Tidak ada data gaji tersedia</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

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

                .view-toggle-container {
                    margin-top: 10px;
                    display: flex;
                    justify-content: flex-start;
                }

                .view-toggle-container .btn {
                    font-size: 0.85rem;
                    padding: 0.25rem 0.5rem;
                }

                .view-toggle-container .btn-group {
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .me-1 {
                    margin-right: 0.25rem;
                }
            `}</style>
        </div>
    );
};

export default DataGaji_Direktur;