import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalAddGajiBaru = ({ showModal, setShowModal, token, onAddSuccess }) => {
    const [NIP, setNIP] = useState('');
    const [gajiKotor, setGajiKotor] = useState('');
    const [tglTransaksi, setTglTransaksi] = useState('');
    const [karyawan, setKaryawan] = useState([]); // State for Karyawan list

    useEffect(() => {
        const fetchKaryawan = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/karyawan/getbaru`, {
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

    const handleAddGaji = async () => {
        const newGaji = {
            NIP,
            gaji_kotor: Number(gajiKotor),
            tgl_transaksi: tglTransaksi,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/gaji/add`,
                newGaji,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                onAddSuccess(response.data.data); // Callback untuk memperbarui data gaji
                setShowModal(false);
                // toast.success('');
            }
        } catch (err) {
            console.error('Error saat menambahkan gaji:', err);
            toast.error(err.response?.data?.message || 'Gagal menambahkan gaji');
        }
    };

    return (
        <>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Tambah Gaji Karyawan Baru</h5>
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
                                                <option value="">Tidak ada Karyawan baru</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="gaji_kotor" className="col-form-label">
                                            Gaji Kotor:
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="gaji_kotor"
                                            value={gajiKotor}
                                            onChange={(e) => setGajiKotor(e.target.value)}
                                            placeholder="Masukkan Gaji Kotor"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="tgl_transaksi" className="col-form-label">
                                            Tanggal Transaksi:
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="tgl_transaksi"
                                            value={tglTransaksi}
                                            onChange={(e) => setTglTransaksi(e.target.value)}
                                        />
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
                                    onClick={handleAddGaji}
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Inline CSS for styling the modal */}
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

export default ModalAddGajiBaru;