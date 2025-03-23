import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCoins, FaChartLine, FaMoneyBillAlt } from 'react-icons/fa'; 
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';

const Penjualan = () => {
    const [penjualanList, setPenjualanList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        nama_game: '',
        nama: '' // Menambahkan filter untuk nama karyawan
    });
    const [statsData, setStatsData] = useState({
        total_koin_dijual: 0,
        total_jumlah_uang: 0,
        avg_rate: 0,
    });
    const [games, setGames] = useState([]);

    const token = localStorage.getItem('token');
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();

    const fetchPenjualan = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/penjualan/get`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    bulan: filter.bulan,
                    tahun: filter.tahun,
                    nama_game: filter.nama_game,
                    nama: filter.nama // Menambahkan nama ke parameter
                },
            });
            if (response.data && response.data.data) {
                setPenjualanList(response.data.data);
            } else {
                setPenjualanList([]);
            }
        } catch (err) {
            console.error('Error saat mengambil data penjualan:', err);
            setError('Gagal mengambil data penjualan');
            setPenjualanList([]);
            toast.error('Gagal memuat data penjualan');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/penjualan/total`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    bulan: filter.bulan,
                    tahun: filter.tahun,
                    nama_game: filter.nama_game,
                    nama: filter.nama // Menambahkan nama ke parameter
                },
            });
            if (response.data && response.data.total_koin_dijual !== undefined) {
                setStatsData(prevStats => ({
                    ...prevStats,
                    total_koin_dijual: response.data.total_koin_dijual,
                    total_jumlah_uang: response.data.total_jumlah_uang,
                }));
            }
        } catch (err) {
            console.error('Error fetching total koin dijual:', err);
        }
    };

    const fetchAverageRate = async () => {
        try {
            // Perubahan: Menambahkan parameter bulan dan tahun dengan nilai dari filter
            const response = await axios.get(`${BACKEND_URL}/api/penjualan/rate`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    bulan: filter.bulan,
                    tahun: filter.tahun,
                    nama_game: filter.nama_game,
                },
            });
            if (response.data && response.data.data && response.data.data.length > 0) {
                setStatsData(prevStats => ({
                    ...prevStats,
                    avg_rate: response.data.data[0].avg_rate, // Mengambil rata-rata rate dari hasil
                }));
            } else {
                setStatsData(prevStats => ({
                    ...prevStats,
                    avg_rate: 0, // Reset jika tidak ada data
                }));
            }
        } catch (err) {
            console.error('Error fetching average rate:', err);
            setStatsData(prevStats => ({
                ...prevStats,
                avg_rate: 0, // Reset jika ada error
            }));
        }
    };

    const fetchGames = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/game/get`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.data) {
                setGames(response.data.data);
            } else {
                setGames([]);
            }
        } catch (err) {
            console.error('Error fetching games:', err);
            toast.error('Gagal memuat data game');
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error('Silakan login kembali');
            navigate('/login');
            return;
        }
        fetchPenjualan();
        fetchStats();
        fetchAverageRate();
        fetchGames();
    }, [token, filter, navigate]);

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="total-penjualan-container">
            {error && <p className="error-message">{error}</p>}

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '40px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FaCoins style={{ color: '#3498db', fontSize: '2rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>Total Koin Dijual</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem', fontWeight: 'bold' }}>{statsData.total_koin_dijual}</h2>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FaChartLine style={{ color: '#3498db', fontSize: '2rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>Rata-rata Rate</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem', fontWeight: 'bold' }}>{statsData.avg_rate}</h2>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FaMoneyBillAlt style={{ color: '#3498db', fontSize: '2rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>Total Jumlah Uang</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem', fontWeight: 'bold' }}>{statsData.total_jumlah_uang}</h2>
                    </div>
                </div>
            </div>

            {/* Penjualan Table Header */}
            <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                        <h6 className="text-white text-capitalize ps-3">Penjualan Table</h6>
                    </div>
                </div>

                {/* Filter Form */}
                <div className="filter-form mb-4 px-3 py-2 bg-light">
                    <div className="row">
                        <div className="col-md-3">
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
                        <div className="col-md-3">
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
                        <div className="col-md-3">
                            <select
                                className="form-control"
                                name="nama_game"
                                value={filter.nama_game}
                                onChange={handleFilterChange}
                            >
                                <option value="">Pilih Nama Game</option>
                                {games.length > 0 ? (
                                    games.map((game) => (
                                        <option key={game.id_game} value={game.nama_game}>
                                            {game.nama_game}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Tidak ada game tersedia</option>
                                )}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                name="nama"
                                placeholder="Nama Karyawan"
                                value={filter.nama}
                                onChange={handleFilterChange}
                            />
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
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nama Game</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tanggal</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Server</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Demand</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Rate</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Keterangan</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Koin Dijual</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Jumlah Uang</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {penjualanList && penjualanList.length > 0 ? (
                                        penjualanList.map((penjualan, index) => (
                                            <tr key={penjualan.id_penjualan}>
                                                <td>{index + 1}</td>
                                                <td>{penjualan.NIP}</td>
                                                <td>{penjualan.nama_karyawan}</td>
                                                <td>{penjualan.nama_game}</td>
                                                <td>{penjualan.tgl_transaksi.split("T")[0]}</td>
                                                <td>{penjualan.server}</td>
                                                <td>{penjualan.demand}</td>
                                                <td>{penjualan.rate}</td>
                                                <td>{penjualan.ket}</td>
                                                <td>{penjualan.koin_dijual}</td>
                                                <td>{penjualan.jumlah_uang}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10">Tidak ada penjualan tersedia</td>
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
            `}</style>
        </div>
    );
};

export default Penjualan;