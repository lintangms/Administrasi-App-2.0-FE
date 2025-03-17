import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCoins, FaMoneyBillAlt, FaPen, FaTrash } from 'react-icons/fa'; 
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';
import ModalAddPengeluaran from './modaladdpengeluaran'; // Modal untuk menambah Pengeluaran
import ModalUpdatePengeluaran from './modalupdatepengeluaran'; // Modal untuk memperbarui Pengeluaran

const Pengeluaran = () => {
    const [pengeluaranList, setPengeluaranList] = useState([]); // State untuk Pengeluaran
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPengeluaran, setSelectedPengeluaran] = useState(null); // State untuk Pengeluaran yang dipilih
    const [showAddPengeluaranModal, setShowAddPengeluaranModal] = useState(false);
    const [showUpdatePengeluaranModal, setShowUpdatePengeluaranModal] = useState(false);
    const [filter, setFilter] = useState({
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        search: '', // Field untuk pencarian
    });
    const [totalNominal, setTotalNominal] = useState(0); // State untuk total nominal pengeluaran

    const token = localStorage.getItem('token');
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env
    const navigate = useNavigate();

    // Fetch Pengeluaran data
    useEffect(() => {
        const fetchPengeluaran = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BACKEND_URL}/api/pengeluaran/get`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        bulan: filter.bulan,
                        tahun: filter.tahun,
                        search: filter.search, // Menambahkan parameter pencarian
                    },
                });
                if (response.data && response.data.data) {
                    setPengeluaranList(response.data.data);
                } else {
                    setPengeluaranList([]);
                }
            } catch (err) {
                console.error('Error saat mengambil data pengeluaran:', err);
                setError('Gagal mengambil data pengeluaran');
                setPengeluaranList([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchTotalNominal = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/pengeluaran/total`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        bulan: filter.bulan,
                        tahun: filter.tahun,
                        search: filter.search, // Menambahkan parameter pencarian
                    },
                });
                setTotalNominal(response.data.data);
            } catch (err) {
                console.error('Error fetching total nominal:', err);
            }
        };

        fetchPengeluaran();
        fetchTotalNominal();
    }, [token, filter]);

    // Handle Edit action for Pengeluaran
    const handleEditPengeluaran = (pengeluaran) => {
        setSelectedPengeluaran(pengeluaran);
        setShowUpdatePengeluaranModal(true); // Show Update Modal
    };

    // Handle Delete action for Pengeluaran
    const handleDeletePengeluaran = async (id) => {
        if (!id) {
            console.error('ID tidak valid:', id);
            return;
        }
        try {
            const response = await axios.delete(`${BACKEND_URL}/api/pengeluaran/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setPengeluaranList(pengeluaranList.filter((pengeluaran) => pengeluaran.id_pengeluaran !== id));
                toast.success('Pengeluaran berhasil dihapus!'); // Notifikasi sukses
            }
        } catch (err) {
            console.error('Error saat menghapus data pengeluaran:', err);
            toast.error('Gagal menghapus pengeluaran.'); // Notifikasi gagal
        }
    };

    // Callback untuk menambahkan pengeluaran baru
    const handleAddPengeluaran = (newPengeluaran) => {
        setPengeluaranList((prevList) => [newPengeluaran, ...prevList]); // Tambahkan di atas
        toast.success('Pengeluaran berhasil ditambahkan!'); // Notifikasi sukses
    };

    // Callback untuk memperbarui pengeluaran
    const handleUpdatePengeluaran = (updatedPengeluaran) => {
        setPengeluaranList((prevList) =>
            prevList.map((pengeluaran) =>
                pengeluaran.id_pengeluaran === updatedPengeluaran.id_pengeluaran
                    ? updatedPengeluaran
                    : pengeluaran
            )
        );
        toast.success('Pengeluaran berhasil diperbarui!'); // Notifikasi sukses
    };

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="pengeluaran-container">
            {error && <p className="error-message">{error}</p>}

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '40px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FaCoins style={{ color: '#3498db', fontSize: '2rem' }} />
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>Total Pengeluaran</h5>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem', fontWeight: 'bold' }}>{totalNominal}</h2>
                    </div>
                </div>
            </div>

            {/* Pengeluaran Table Header */}
            <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                        <h6 className="text-white text-capitalize ps-3">Pengeluaran Table</h6>
                        <button
                            className="btn btn-success me-3"
                            onClick={() => {
                                setShowAddPengeluaranModal(true);
                                toast.info('Silakan isi form untuk menambahkan pengeluaran.'); // Notifikasi info
                            }}
                        >
                            + Add
                        </button>
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
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                name="search"
                                placeholder="Cari Uraian atau Keterangan"
                                value={filter.search}
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
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tanggal Transaksi</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Uraian</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nominal</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Keterangan</th>
                                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {pengeluaranList && pengeluaranList.length > 0 ? (
                                        pengeluaranList.map((pengeluaran, index) => (
                                            <tr key={pengeluaran.id_pengeluaran}>
                                                <td>{index + 1}</td>
                                                <td>{new Date(pengeluaran.tgl_transaksi).toLocaleDateString("id-ID")}</td>
                                                <td>{pengeluaran.uraian}</td>
                                                <td>{pengeluaran.nominal}</td>
                                                <td>{pengeluaran.ket}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-info btn-sm me-2 rounded"
                                                        onClick={() => handleEditPengeluaran(pengeluaran)}
                                                    >
                                                        <FaPen/>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePengeluaran(pengeluaran.id_pengeluaran)}
                                                        className="btn btn-danger btn-sm me-2 rounded"
                                                    >
                                                        <FaTrash/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6">Tidak ada pengeluaran tersedia</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Pengeluaran Modal */}
            <ModalAddPengeluaran
                showModal={showAddPengeluaranModal}
                setShowModal={setShowAddPengeluaranModal}
                onAddSuccess={handleAddPengeluaran} // Callback untuk menambahkan pengeluaran baru
                token={token}
            />

            {/* Update Pengeluaran Modal */}
            <ModalUpdatePengeluaran
                showModal={showUpdatePengeluaranModal}
                setShowModal={setShowUpdatePengeluaranModal}
                selectedPengeluaran={selectedPengeluaran} // Ganti dengan selectedPengeluaran
                onUpdateSuccess={handleUpdatePengeluaran} // Callback untuk memperbarui pengeluaran
                token={token}
            />

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

export default Pengeluaran;