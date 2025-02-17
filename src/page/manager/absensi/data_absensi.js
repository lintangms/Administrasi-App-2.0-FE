import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DataAbsensi = () => {
    const [absenList, setAbsenList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({
        nama: '',
        tanggal: '',
    });

    const token = localStorage.getItem('token');
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();

    const fetchAbsensi = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/absen/get`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    nama: filter.nama,
                    tanggal: filter.tanggal,
                },
            });

            if (response.data && response.data.data) {
                setAbsenList(response.data.data);
            } else {
                setAbsenList([]);
            }
        } catch (err) {
            console.error('Error saat mengambil data riwayat absensi:', err);
            setError('Gagal mengambil data riwayat absensi');
            setAbsenList([]);
            toast.error('Gagal memuat data absensi');
        } finally {
            setLoading(false);
        }
    };

    const handleIzin = async (NIP) => {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/absen/izin`,
                { NIP },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Izin berhasil dicatat');
            fetchAbsensi();
        } catch (error) {
            console.error('Error saat mencatat izin:', error);
            toast.error(error.response?.data?.message || 'Gagal mencatat izin');
        }
    };

    const handleTidakMasuk = async (NIP) => {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/absen/alpha`,
                { NIP },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Tidak masuk berhasil dicatat');
            fetchAbsensi();
        } catch (error) {
            console.error('Error saat mencatat tidak masuk:', error);
            toast.error(error.response?.data?.message || 'Gagal mencatat tidak masuk');
        }
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "-";
        const dateObj = new Date(dateTime);
        if (isNaN(dateObj)) return "-";
        return dateObj.toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'masuk':
                return 'bg-success text-white rounded px-2 py-1';
            case 'izin':
                return 'bg-warning text-dark rounded px-2 py-1';
            case 'tidak_masuk':
                return 'bg-danger text-white rounded px-2 py-1';
            default:
                return 'bg-secondary text-white rounded px-2 py-1';
        }
    };

    const shouldShowActions = (absen) => {
        if (absen.waktu_masuk || absen.waktu_pulang) {
            return false;
        }
        
        if (absen.status === 'izin' || absen.status === 'tidak_masuk') {
            return false;
        }

        return true;
    };

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        if (!token) {
            toast.error('Silakan login kembali');
            navigate('/login');
            return;
        }
        fetchAbsensi();
    }, [token, navigate, filter]);

    return (
        <div className="absensi-container">
            {error && <p className="error-message">{error}</p>}

            <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                        <h6 className="text-white text-capitalize ps-3">Riwayat Absensi</h6>
                    </div>
                </div>
                <div className="card-body px-0 pb-2">
                    {/* Filter Form */}
                    <div className="filter-form mb-4 px-3 py-2 bg-light">
                        <div className="row">
                            <div className="col-md-3">
                                <input
                                    type="date"
                                    className="form-control"
                                    name="tanggal"
                                    placeholder="Cari Tanggal"
                                    value={filter.tanggal}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nama"
                                    placeholder="Cari Nama"
                                    value={filter.nama}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive p-0">
                        <table className="table align-items-center mb-0">
                            <thead>
                                <tr>
                                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">No</th>
                                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">NIP</th>
                                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nama</th>
                                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Waktu Masuk</th>
                                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Waktu Pulang</th>
                                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">Loading...</td>
                                    </tr>
                                ) : absenList.length > 0 ? (
                                    absenList.map((absen, index) => (
                                        <tr key={`${absen.NIP}-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{absen.NIP}</td>
                                            <td>{absen.nama}</td>
                                            <td>{formatDateTime(absen.waktu_masuk)}</td>
                                            <td>{formatDateTime(absen.waktu_pulang)}</td>
                                            <td>
                                                <span className={getStatusStyle(absen.status)}>
                                                    {absen.status || '-'}
                                                </span>
                                            </td>
                                            <td>
                                                {shouldShowActions(absen) && (
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            className="btn btn-outline-warning btn-sm mx-1"
                                                            onClick={() => handleIzin(absen.NIP)}
                                                        >
                                                            Izin
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleTidakMasuk(absen.NIP)}
                                                        >
                                                            Tidak Masuk
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">Tidak ada data untuk ditampilkan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .table { width: 100%; margin-bottom: 1rem; color: #212529; }
                .table th, .table td { 
                    padding: 0.75rem; 
                    vertical-align: top; 
                    border-top: 1px solid #dee2e6; 
                }
                .table thead th { 
                    vertical-align: bottom; 
                    border-bottom: 2px solid #dee2e6; 
                }
                .text-uppercase { text-transform: uppercase; }
                .text-secondary { color: #6c757d; }
                .text-xxs { font-size: 0.75rem; }
                .font-weight-bolder { font-weight: bolder; }
                .bg-gradient-dark { 
                    background: linear-gradient(180deg, #1a1a1a 0%, #343a40 100%); 
                }
                .border-radius-lg { border-radius: 0.5rem; }
                .input-group-text { 
                    background-color: #f4f4f4; 
                    border: 1px solid #d2d2d2; 
                }
                .btn-group .btn {
                    margin: 0 2px;
                }
                .bg-success {
                    background-color: #28a745 !important;
                }
                .bg-warning {
                    background-color: #ffc107 !important;
                }
                .bg-danger {
                    background-color: #dc3545 !important;
                }
                .btn-outline-warning {
                    color: #ffc107;
                    border-color: #ffc107;
                }
                .btn-outline-warning:hover {
                    color: #000;
                    background-color: #ffc107;
                    border-color: #ffc107;
                }
                .btn-outline-danger {
                    color: #dc3545;
                    border-color: #dc3545;
                }
                .btn-outline-danger:hover {
                    color: #fff;
                    background-color: #dc3545;
                    border-color: #dc3545;
                }
                .filter-form { 
                    background-color: #f8f9fa; 
                    border-radius: 0.375rem;
                }
            `}</style>
        </div>
    );
};

export default DataAbsensi;
