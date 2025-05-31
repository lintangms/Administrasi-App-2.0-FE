import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalAddGajiLama = ({ showModal, setShowModal, token, onAddSuccess }) => {
    const [NIP, setNIP] = useState('');
    const [bulan, setBulan] = useState(new Date().getMonth() + 1); // Bulan saat ini
    const [tahun, setTahun] = useState(new Date().getFullYear()); // Tahun saat ini
    const [game, setGame] = useState('WOW'); // Default game
    const [ket, setKet] = useState('');
    const [karyawan, setKaryawan] = useState([]); // State for Karyawan list
    const [sold, setSold] = useState(''); // State for sold koin
    const [unsold, setUnsold] = useState(''); // State for unsold koin
    const [isLoadingSoldUnsold, setIsLoadingSoldUnsold] = useState(false); // Loading state

    useEffect(() => {
        const fetchKaryawan = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/karyawan/getlama`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setKaryawan(response.data); // Assuming the response is an array of Karyawan
            } catch (err) {
                console.error('Error fetching Karyawan:', err);
                toast.error('Gagal memuat data Karyawan');
            }
        };

        if (showModal) {
            fetchKaryawan();
        }
    }, [showModal, token]);

    // Fetch sold dan unsold data ketika NIP dan game berubah
    useEffect(() => {
        const fetchSoldUnsold = async () => {
            if (NIP && game && bulan && tahun) {
                setIsLoadingSoldUnsold(true);
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/gaji/getsoldunsold`, {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { NIP, game, bulan, tahun }
                    });

                    if (response.data && response.data.data) {
                        setSold(response.data.data.sold || 0);
                        setUnsold(response.data.data.unsold || 0);
                    }
                } catch (err) {
                    console.error('Error fetching sold/unsold data:', err);
                    toast.error(err.response?.data?.message || 'Gagal memuat data sold/unsold');
                    setSold('');
                    setUnsold('');
                } finally {
                    setIsLoadingSoldUnsold(false);
                }
            } else {
                setSold('');
                setUnsold('');
            }
        };

        fetchSoldUnsold();
    }, [NIP, game, bulan, tahun, token]);

    const handleAddGajiLama = async () => {
        // Validasi input
        if (!NIP || !bulan || !tahun || !game) {
            toast.error('NIP, bulan, tahun, dan game harus diisi');
            return;
        }

        if (sold === '' || unsold === '') {
            toast.error('Data sold dan unsold harus tersedia');
            return;
        }

        const newGaji = {
            NIP,
            bulan: parseInt(bulan),
            tahun: parseInt(tahun),
            game,
            ket,
            sold: parseFloat(sold),
            unsold: parseFloat(unsold)
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/gaji/addgaji`,
                newGaji,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                onAddSuccess(response.data.data); // Callback untuk memperbarui data gaji
                setShowModal(false);
                // Reset form
                setNIP('');
                setBulan(new Date().getMonth() + 1);
                setTahun(new Date().getFullYear());
                setGame('WOW');
                setKet('');
                setSold('');
                setUnsold('');
                toast.success('Gaji lama berhasil ditambahkan!');
            }
        } catch (err) {
            console.error('Error saat menambahkan gaji lama:', err);
            toast.error(err.response?.data?.message || 'Gagal menambahkan gaji lama');
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        // Reset form ketika modal ditutup
        setNIP('');
        setBulan(new Date().getMonth() + 1);
        setTahun(new Date().getFullYear());
        setGame('WOW');
        setKet('');
        setSold('');
        setUnsold('');
    };

    return (
        <>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Tambah Gaji Lama</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={handleModalClose}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="NIP" className="col-form-label">
                                            NIP:
                                        </label>
                                        <select
                                            className="form-control"
                                            id="NIP"
                                            value={NIP}
                                            onChange={(e) => setNIP(e.target.value)}
                                        >
                                            <option value="">Pilih NIP</option>
                                            {karyawan.length > 0 ? (
                                                karyawan.map((k) => (
                                                    <option key={k.NIP} value={k.NIP}>
                                                        {k.NIP} - {k.nama} {/* Display NIP and name */}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">Tidak ada Karyawan lama</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="bulan" className="col-form-label">
                                            Bulan:
                                        </label>
                                        <select
                                            className="form-control"
                                            id="bulan"
                                            value={bulan}
                                            onChange={(e) => setBulan(e.target.value)}
                                        >
                                            {[...Array(12)].map((_, index) => (
                                                <option key={index} value={index + 1}>
                                                    {new Date(0, index).toLocaleString('id-ID', { month: 'long' })}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="tahun" className="col-form-label">
                                            Tahun:
                                        </label>
                                        <select
                                            className="form-control"
                                            id="tahun"
                                            value={tahun}
                                            onChange={(e) => setTahun(e.target.value)}
                                        >
                                            {[...Array(5)].map((_, index) => (
                                                <option key={index} value={2025 + index}>
                                                    {2025 + index}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="game" className="col-form-label">
                                            Game:
                                        </label>
                                        <select
                                            className="form-control"
                                            id="game"
                                            value={game}
                                            onChange={(e) => setGame(e.target.value)}
                                        >
                                            <option value="WOW">WOW</option>
                                            <option value="TNL">TNL</option>
                                            <option value="BNS">BNS</option>
                                        </select>
                                    </div>
                                    
                                    {/* Tampilkan field Sold dan Unsold ketika NIP dan game sudah dipilih */}
                                    {NIP && game && (
                                        <>
                                            <div className="form-group">
                                                <label htmlFor="sold" className="col-form-label">
                                                    Sold (Koin Terjual):
                                                </label>
                                                {isLoadingSoldUnsold ? (
                                                    <div className="loading-indicator">Loading...</div>
                                                ) : (
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="sold"
                                                        value={sold}
                                                        onChange={(e) => setSold(e.target.value)}
                                                        placeholder="Masukkan jumlah koin terjual"
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                )}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="unsold" className="col-form-label">
                                                    Unsold (Koin Tidak Terjual):
                                                </label>
                                                {isLoadingSoldUnsold ? (
                                                    <div className="loading-indicator">Loading...</div>
                                                ) : (
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="unsold"
                                                        value={unsold}
                                                        onChange={(e) => setUnsold(e.target.value)}
                                                        placeholder="Masukkan jumlah koin tidak terjual"
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="ket" className="col-form-label">
                                            Keterangan:
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="ket"
                                            value={ket}
                                            onChange={(e) => setKet(e.target.value)}
                                            placeholder="Masukkan keterangan"
                                            rows="3"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleModalClose}
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddGajiLama}
                                    disabled={isLoadingSoldUnsold || !NIP || !game || sold === '' || unsold === ''}
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS inline untuk styling modal */}
            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1050;
                }

                .modal-container {
                    background: #fff;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    overflow: hidden;
                    width: 500px;
                    max-width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-header {
                    padding: 15px;
                    border-bottom: 1px solid #dee2e6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #f8f9fa;
                }

                .modal-body {
                    padding: 20px;
                }

                .modal-footer {
                    padding: 15px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    background-color: #f8f9fa;
                }

                .modal-content {
                    border: none;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .col-form-label {
                    font-weight: 600;
                    margin-bottom: 5px;
                    display: block;
                    color: #495057;
                }

                .form-control {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #ced4da;
                    border-radius: 4px;
                    font-size: 14px;
                    line-height: 1.5;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }

                .form-control:focus {
                    outline: 0;
                    border-color: #80bdff;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                }

                .form-control:disabled {
                    background-color: #e9ecef;
                    opacity: 1;
                }

                .btn {
                    padding: 8px 16px;
                    border: 1px solid transparent;
                    border-radius: 4px;
                    font-size: 14px;
                    line-height: 1.5;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    font-weight: 400;
                    text-align: center;
                    vertical-align: middle;
                    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }

                .btn-primary {
                    color: #fff;
                    background-color: #007bff;
                    border-color: #007bff;
                }

                .btn-primary:hover:not(:disabled) {
                    color: #fff;
                    background-color: #0056b3;
                    border-color: #004085;
                }

                .btn-primary:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                }

                .btn-secondary {
                    color: #6c757d;
                    background-color: transparent;
                    border-color: #6c757d;
                }

                .btn-secondary:hover {
                    color: #fff;
                    background-color: #6c757d;
                    border-color: #6c757d;
                }

                .close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    line-height: 1;
                    color: #000;
                    opacity: 0.7;
                    cursor: pointer;
                    padding: 0;
                    margin: 0;
                }

                .close:hover {
                    color: #000;
                    opacity: 1;
                }

                .loading-indicator {
                    padding: 8px 12px;
                    background-color: #f8f9fa;
                    border: 1px solid #ced4da;
                    border-radius: 4px;
                    color: #6c757d;
                    font-style: italic;
                }

                .modal-title {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 500;
                }
            `}</style>
        </>
    );
};

export default ModalAddGajiLama;