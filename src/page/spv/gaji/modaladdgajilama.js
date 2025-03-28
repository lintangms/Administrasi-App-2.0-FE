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
    const [koinDetails, setKoinDetails] = useState([]); // State for Koin details
    const [saldoKoin, setSaldoKoin] = useState(null); // State for saldo koin
    const [selectedKoinDijual, setSelectedKoinDijual] = useState(''); // State for selected koin dijual

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

    useEffect(() => {
        const fetchKoinDetails = async () => {
            if (NIP) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/gaji/koindetail`, {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { NIP, bulan, tahun }
                    });

                    if (game === "WOW") {
                        setSaldoKoin(response.data.saldo_koin);
                        setKoinDetails([]); // Clear koin details if game is WOW
                    } else {
                        setKoinDetails(response.data.rincian_koin);
                        setSaldoKoin(null); // Clear saldo koin if game is not WOW
                    }
                } catch (err) {
                    console.error('Error fetching koin details:', err);
                    toast.error(err.response?.data?.message || 'Gagal memuat data koin');
                }
            }
        };

        fetchKoinDetails();
    }, [NIP, bulan, tahun, game, token]);

    const handleAddGajiLama = async () => {
        const newGaji = {
            NIP,
            bulan,
            tahun,
            game,
            ket,
            saldo_koin: saldoKoin, // Include saldo koin if applicable
            koin_dijual: selectedKoinDijual // Include selected koin dijual if applicable
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/gaji/addgaji`, // Ganti dengan endpoint yang sesuai
                newGaji,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                onAddSuccess(response.data.data); // Callback untuk memperbarui data gaji
                setShowModal(false);
                toast.success('Gaji lama berhasil ditambahkan!');
            }
        } catch (err) {
            console.error('Error saat menambahkan gaji lama:', err);
            toast.error(err.response?.data?.message || 'Gagal menambahkan gaji lama');
        }
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
                                    onClick={() => setShowModal(false)}
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
                                        />
                                    </div>
                                    {game !== "WOW" && koinDetails.length > 0 && (
                                        <div className="form-group">
                                            <label htmlFor="koinDijual" className="col-form-label">
                                                Koin Dijual:
                                            </label>
                                            <select
                                                className="form-control"
                                                id="koinDijual"
                                                value={selectedKoinDijual}
                                                onChange={(e) => setSelectedKoinDijual(e.target.value)}
                                            >
                                                <option value="">Pilih Koin Dijual</option>
                                                {koinDetails.map((detail, index) => (
                                                    <option key={index} value={detail.koin_dijual}>
                                                        {detail.tgl_transaksi} - {detail.koin_dijual} Koin
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    {game === "WOW" && saldoKoin !== null && (
                                        <div className="form-group">
                                            <label className="col-form-label">
                                                Saldo Koin:
                                            </label>
                                            <p>{saldoKoin} Koin</p>
                                        </div>
                                    )}
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
                                    onClick={handleAddGajiLama}
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

export default ModalAddGajiLama;