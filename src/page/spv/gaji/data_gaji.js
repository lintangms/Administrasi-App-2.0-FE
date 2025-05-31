import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ModalUpdateGajiLama from './modalupdategaji'; // Modal untuk karyawan status lama
import ModalUpdateGajiBaru from './modalupdategajibaru'; // Modal untuk karyawan status baru
import ModalAddGajiBaru from './modaladdgaji'; // Modal untuk menambah gaji baru
import ModalAddRate from './modaladdrate'; // Modal untuk menambah rate baru
import ModalAddGajiLama from './modaladdgajilama'; // Modal untuk menambah gaji lama
import generateSlipGajiPDF from './slipgaji'; // Import PDF generator
import { FaDollarSign, FaMoneyBillWave, FaChartLine, FaUser, FaCoins, FaDownload } from 'react-icons/fa';

const DataGaji = () => {
    const [totalGajiList, setTotalGajiList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({
        nama: '',
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
    });
    const [showModalLama, setShowModalLama] = useState(false);
    const [showModalBaru, setShowModalBaru] = useState(false);
    const [showModalAddBaru, setShowModalAddBaru] = useState(false); // State untuk modal tambah gaji baru
    const [showModalAddRate, setShowModalAddRate] = useState(false); // State untuk modal tambah rate baru
    const [showModalAddGajiLama, setShowModalAddGajiLama] = useState(false); // State untuk modal tambah gaji lama
    const [selectedGaji, setSelectedGaji] = useState(null);
    const [statsData, setStatsData] = useState({
        total_gaji_kotor: 0,
        total_kasbon: 0,
        total_THP: 0,
        wow_rate: 0,
        tnl_rate: 0,
        bns_rate: 0,
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

    const fetchGameRates = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/gaji/getrate`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    bulan: filter.bulan,
                    tahun: filter.tahun,
                },
            });
            const rates = response.data.data;
            const wowRate = rates.find(rate => rate.nama_game === 'WOW')?.rata_rata_rate || 0;
            const tnlRate = rates.find(rate => rate.nama_game === 'TNL')?.rata_rata_rate || 0;
            const bnsRate = rates.find(rate => rate.nama_game === 'BNS')?.rata_rata_rate || 0;

            setStatsData(prevStats => ({
                ...prevStats,
                wow_rate: wowRate,
                tnl_rate: tnlRate,
                bns_rate: bnsRate,
            }));
        } catch (err) {
            console.error('Error fetching game rates:', err);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error('Silakan login kembali');
            return;
        }
        fetchTotalGaji();
        fetchStats();
        fetchGameRates();
    }, [token, filter, activeView]);

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    const handleOpenModal = (gaji) => {
        setSelectedGaji(gaji);
        setShowModalLama(true);
    };

    const handleOpenModalBaru = (gaji) => {
        setSelectedGaji(gaji);
        setShowModalBaru(true);
    };

    const handleViewChange = (view) => {
        setActiveView(view);
    };

    const handleAddGajiBaru = (newGaji) => {
        setTotalGajiList((prevList) => [newGaji, ...prevList]);
        toast.success('Gaji baru berhasil ditambahkan!');
    };

    const handleAddGajiLama = (newGaji) => {
        setTotalGajiList((prevList) => [newGaji, ...prevList]);
        toast.success('Gaji lama berhasil ditambahkan!');
    };

    const handleUpdateUnsoldGaji = async (NIP) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/gaji/gajiunsold`, { NIP }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(response.data.message);
            fetchTotalGaji(); // Refresh the total gaji list after update
        } catch (err) {
            console.error('Error updating unsold gaji:', err);
            toast.error(err.response?.data?.message || 'Terjadi kesalahan saat memperbarui gaji.');
        }
    };

    // Function to handle PDF download
    const handleDownloadPDF = (gaji) => {
        try {
            // Prepare data with additional calculated fields if needed
            const gajiDataForPDF = {
                ...gaji,
                rate_per_koin: gaji.gaji_kotor / (gaji.total_dijual || 1), // Calculate rate if not available
            };

            generateSlipGajiPDF(gajiDataForPDF);
            toast.success('Slip gaji berhasil diunduh!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Gagal mengunduh slip gaji. Silakan coba lagi.');
        }
    };

    return (
        <div className="total-gaji-container">
            {error && <p className="error-message">{error}</p>}

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                <div className="stat-card">
                    <FaDollarSign style={{ color: '#3498db', fontSize: '1.5rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.8rem' }}>Total Gaji Kotor</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1rem', fontWeight: 'bold' }}>
                            {Number(statsData.total_gaji_kotor).toLocaleString('id-ID')}
                        </h2>
                    </div>
                </div>
                <div className="stat-card">
                    <FaMoneyBillWave style={{ color: '#3498db', fontSize: '1.5rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.8rem' }}>Total Kasbon</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1rem', fontWeight: 'bold' }}>
                            {Number(statsData.total_kasbon).toLocaleString('id-ID')}
                        </h2>
                    </div>
                </div>
                <div className="stat-card">
                    <FaChartLine style={{ color: '#3498db', fontSize: '1.5rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.8rem' }}>Total THP</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1rem', fontWeight: 'bold' }}>
                            {Number(statsData.total_THP).toLocaleString('id-ID')}
                        </h2>
                    </div>
                </div>

                <div className="stat-card">
                    <FaCoins style={{ color: '#3498db', fontSize: '1.5rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.8rem' }}>Rata-rata Rate WOW</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1rem', fontWeight: 'bold' }}>{statsData.wow_rate}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <FaCoins style={{ color: '#3498db', fontSize: '1.5rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.8rem' }}>Rata-rata Rate TNL</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1rem', fontWeight: 'bold' }}>{statsData.tnl_rate}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <FaCoins style={{ color: '#3498db', fontSize: '1.5rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.8rem' }}>Rata-rata Rate BNS</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1rem', fontWeight: 'bold' }}>{statsData.bns_rate}</h2>
                    </div>
                </div>
            </div>

            {/* Status Toggle Buttons - Smaller Size */}
            <div className="view-toggle-container mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="btn-group" role="group" aria-label="Status toggle">
                    <button
                        type="button"
                        className={`btn btn-sm ${activeView === 'lama' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleViewChange('lama')}
                    >
                        <FaUser className="me-1" style={{ fontSize: '0.8rem' }} />
                        Karyawan Status Lama
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm ${activeView === 'baru' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleViewChange('baru')}
                    >
                        <FaUser className="me-1" style={{ fontSize: '0.8rem' }} />
                        Karyawan Status Baru
                    </button>
                </div>
                <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                        setShowModalAddRate(true); // Open the Add Rate modal
                    }}
                >
                    + Add Rate
                </button>
            </div>

            {/* Stats Cards */}
            <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                        <h6 className="text-white text-capitalize ps-3">
                            Total Gaji {activeView === 'lama' ? 'Karyawan Status Lama' : 'Karyawan Status Baru'}
                        </h6>
                        {activeView === 'baru' && (
                            <button
                                className="btn btn-success me-3"
                                onClick={() => {
                                    setShowModalAddBaru(true);
                                    toast.info('Silakan isi form untuk menambahkan gaji baru.');
                                }}
                            >
                                + Add Gaji Baru
                            </button>
                        )}
                        {activeView === 'lama' && (
                            <button
                                className="btn btn-success me-3"
                                onClick={() => {
                                    setShowModalAddGajiLama(true);
                                    toast.info('Silakan isi form untuk menambahkan gaji lama.');
                                }}
                            >
                                + Add Gaji Lama
                            </button>
                        )}
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
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Kasbon</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">THP</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tanggal Transaksi</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Ket</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {totalGajiList && totalGajiList.length > 0 ? (
                                        totalGajiList.map((gaji, index) => (
                                            <tr key={gaji.id_gaji}>
                                                <td>{index + 1}</td>
                                                <td>{gaji.NIP}</td>
                                                <td>{gaji.nama}</td>
                                                <td>{Number(gaji.sold).toLocaleString('id-ID')}</td>
                                                <td>{Number(gaji.unsold).toLocaleString('id-ID')}</td>
                                                <td>{Number(gaji.gaji_kotor).toLocaleString('id-ID')}</td>
                                                <td>{Number(gaji.potongan).toLocaleString('id-ID')}</td>
                                                <td>{Number(gaji.kasbon).toLocaleString('id-ID')}</td>
                                                <td>{Number(gaji.THP).toLocaleString('id-ID')}</td>
                                                <td>{new Date(gaji.tgl_transaksi).toLocaleDateString('id-ID')}</td>
                                                <td>{gaji.ket}</td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        {/* Download PDF Button */}
                                                        <button
                                                            className="btn btn-info btn-sm"
                                                            onClick={() => handleDownloadPDF(gaji)}
                                                            title="Download Slip Gaji"
                                                        >
                                                            <FaDownload style={{ fontSize: '0.8rem' }} />
                                                        </button>

                                                        {activeView === 'lama' ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() => handleOpenModal(gaji)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={() => handleUpdateUnsoldGaji(gaji.NIP)}
                                                                    title="Update Unsold Gaji"
                                                                >
                                                                    Update
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() => handleOpenModalBaru(gaji)}
                                                                >
                                                                    Edit
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="12">Tidak ada data gaji tersedia</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showModalLama && selectedGaji && (
                <ModalUpdateGajiLama
                    showModal={showModalLama}
                    setShowModal={setShowModalLama}
                    token={token}
                    selectedGaji={selectedGaji}
                    onUpdateSuccess={async (updatedData) => {
                        await fetchTotalGaji();
                        setShowModalLama(false);
                    }}
                />
            )}

            {showModalBaru && selectedGaji && (
                <ModalUpdateGajiBaru
                    showModal={showModalBaru}
                    setShowModal={setShowModalBaru}
                    token={token}
                    selectedGaji={selectedGaji}
                    onUpdateSuccess={async (updatedData) => {
                        await fetchTotalGaji();
                        setShowModalBaru(false);
                    }}
                />
            )}

            {showModalAddBaru && (
                <ModalAddGajiBaru
                    showModal={showModalAddBaru}
                    setShowModal={setShowModalAddBaru}
                    token={token}
                    onAddSuccess={handleAddGajiBaru}
                />
            )}

            {showModalAddRate && (
                <ModalAddRate
                    showModal={showModalAddRate}
                    setShowModal={setShowModalAddRate}
                    token={token}
                    onAddSuccess={handleAddGajiBaru} // Assuming you want to handle success similarly
                />
            )}

            {showModalAddGajiLama && (
                <ModalAddGajiLama
                    showModal={showModalAddGajiLama}
                    setShowModal={setShowModalAddGajiLama}
                    token={token}
                    onAddSuccess={handleAddGajiLama}
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

                .stat-card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .d-flex {
                    display: flex;
                }

                .gap-1 {
                    gap: 0.25rem;
                }

                .btn-info {
                    background-color: #17a2b8;
                    border-color: #17a2b8;
                    color: white;
                }

                .btn-info:hover {
                    background-color: #138496;
                    border-color: #117a8b;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default DataGaji;