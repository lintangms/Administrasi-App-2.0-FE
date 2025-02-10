import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle, FaSearch, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DataAbsensi = () => {
    const [absenList, setAbsenList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        nama: '',
        tanggal: new Date().toISOString().split('T')[0]
    });

    const token = localStorage.getItem('token');
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();

    const fetchAbsensi = async (filterParams = {}) => {
        setLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/absen/get`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    nama: filterParams.nama || '',
                    tanggal: filterParams.tanggal || new Date().toISOString().split('T')[0]
                }
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
    const formatDateTime = (dateTime) => {
        if (!dateTime) return "-"; // Jika null atau undefined, tampilkan "-"

        const dateObj = new Date(dateTime);
        if (isNaN(dateObj)) return "-"; // Jika bukan tanggal valid, tampilkan "-"

        return dateObj.toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // Gunakan format 24 jam
        });
    };

    useEffect(() => {
        if (!token) {
            toast.error('Silakan login kembali');
            navigate('/login');
            return;
        }
        fetchAbsensi(filters);
    }, [token, navigate]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = () => {
        fetchAbsensi(filters);
    };

    return (
        <div className="absensi-container">
            {error && <p className="error-message">{error}</p>}

            <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                        <h6 className="text-white text-capitalize ps-3">Filter Riwayat Absensi</h6>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4 mb-2">
                            <div className="input-group">
                                <span className="input-group-text"><FaUser /></span>
                                <input
                                    type="text"
                                    name="nama"
                                    className="form-control"
                                    placeholder="Cari berdasarkan nama"
                                    value={filters.nama}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <div className="input-group">
                                <span className="input-group-text"><FaCalendarAlt /></span>
                                <input
                                    type="date"
                                    name="tanggal"
                                    className="form-control"
                                    value={filters.tanggal}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <button
                                className="btn btn-primary"
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                <FaSearch /> Cari
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                        <h6 className="text-white text-capitalize ps-3">Riwayat Absensi</h6>
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
                                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Waktu Masuk</th>
                                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Waktu Pulang</th>
                                    {/* <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">Loading...</td>
                                    </tr>
                                ) : absenList.length > 0 ? (
                                    absenList.map((absen, index) => (
                                        <tr key={absen.NIP}>
                                            <td>{index + 1}</td>
                                            <td>{absen.NIP}</td>
                                            <td>{absen.nama}</td>
                                            <td>{formatDateTime(absen.waktu_masuk)}</td>
                                            <td>{formatDateTime(absen.waktu_pulang)}</td>

                                            
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
      `}</style>
        </div>
    );
};

export default DataAbsensi;