import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalAddRate = ({ showModal, setShowModal, token, onAddSuccess }) => {
    const [namaGame, setNamaGame] = useState('');
    const [rataRataRate, setRataRataRate] = useState('');
    const [bulan, setBulan] = useState(new Date().getMonth() + 1); // Bulan saat ini
    const [tahun, setTahun] = useState(new Date().getFullYear()); // Tahun saat ini
    const [games, setGames] = useState([]); // State untuk daftar game

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/game/get`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setGames(response.data.data); // Mengisi state games dengan data dari backend
            } catch (err) {
                console.error('Error fetching Games:', err);
                toast.error('Gagal memuat data Game');
            }
        };

        if (showModal) {
            fetchGames();
        }
    }, [showModal, token]);

    const handleAddRate = async () => {
        const newRate = {
            nama_game: namaGame,
            rata_rata_rate: Number(rataRataRate),
            bulan: bulan,
            tahun: tahun,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/penjualan/addrate`, // Ganti dengan endpoint yang sesuai
                newRate,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                onAddSuccess(response.data.data); // Callback untuk memperbarui data rate
                setShowModal(false);
            }
        } catch (err) {
            console.error('Error saat menambahkan rate:', err);
            toast.error(err.response?.data?.message || 'Gagal menambahkan rate');
        }
    };

    return (
        <>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Tambah Rata-rata Rate Game</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => setShowModal(false)}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="namaGame" className="col-form-label">
                                            Nama Game:
                                        </label>
                                        <select
                                            className="form-control"
                                            id="namaGame"
                                            value={namaGame}
                                            onChange={(e) => setNamaGame(e.target.value)}
                                        >
                                            <option value="">Pilih Game</option>
                                            {games.length > 0 ? (
                                                games.map((game) => (
                                                    <option key={game.id_game} value={game.nama_game}>
                                                        {game.nama_game} {/* Menampilkan nama game */}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">Tidak ada Game tersedia</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="rataRataRate" className="col-form-label">
                                            Rata-rata Rate:
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="rataRataRate"
                                            value={rataRataRate}
                                            onChange={(e) => setRataRataRate(e.target.value)}
                                            placeholder="Masukkan Rata-rata Rate"
                                        />
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
                                            <option value="1">Januari</option>
                                            <option value="2">Februari</option>
                                            <option value="3">Maret</option>
                                            <option value="4">April</option>
                                            <option value="5">Mei</option>
                                            <option value="6">Juni</option>
                                            <option value="7">Juli</option>
                                            <option value="8">Agustus</option>
                                            <option value="9">September</option>
                                            <option value="10">Oktober</option>
                                            <option value="11">November</option>
                                            <option value="12">Desember</option>
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
                                            <option value="2025">2025</option>
                                            <option value="2026">2026</option>
                                            <option value="2027">2027</option>
                                            <option value="2028">2028</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddRate}
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
                }

                .modal-header {
                    padding: 15px;
                    border-bottom: 1px solid #dee2e6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-body {
                    padding: 15px;
                }

                .modal-footer {
                    padding: 15px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }

                .modal-content {
                    border: none;
                }

                .close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    line-height: 1;
                    color: #000;
                    opacity: 0.7;
                    cursor: pointer;
                }

                .close:hover {
                    color: #000;
                    opacity: 1;
                }
            `}</style>
        </>
    );
};

export default ModalAddRate;