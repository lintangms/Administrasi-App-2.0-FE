import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalAddUnsold = ({ showModal, setShowModal, token, onAddSuccess, selectedUnsold }) => {
    const [NIP, setNIP] = useState('');
    const [koin, setKoin] = useState('');
    const [hargaBeli, setHargaBeli] = useState('');
    const [tglTransaksi, setTglTransaksi] = useState('');
    const [idUnsold, setIdUnsold] = useState(null); // State for id_unsold

    useEffect(() => {
        if (selectedUnsold) {
            setIdUnsold(selectedUnsold.id_unsold); // Set the id_unsold
            setNIP(selectedUnsold.NIP);
            setKoin(selectedUnsold.koin);
            setHargaBeli(selectedUnsold.harga_beli);
            setTglTransaksi(selectedUnsold.tgl_transaksi);
        } else {
            setIdUnsold(null);
            setNIP('');
            setKoin('');
            setHargaBeli('');
            setTglTransaksi('');
        }
    }, [selectedUnsold]);

    const handleAddUnsold = async () => {
        const newUnsold = {
            NIP,
            koin: Number(koin),
            harga_beli: Number(hargaBeli),
            tgl_transaksi: tglTransaksi,
        };

        try {
            let response;
            if (idUnsold) {
                // If idUnsold exists, update the existing unsold item
                response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/api/unsold/sell/${idUnsold}`,
                    newUnsold,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Otherwise, create a new unsold item
                response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/api/unsold/add`,
                    newUnsold,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            if (response.status === 200 || response.status === 201) {
                onAddSuccess(response.data.data); // Callback to update unsold data
                setShowModal(false);
                toast.success('Unsold berhasil ditambahkan/diupdate!');
            }
        } catch (err) {
            console.error('Error saat menambahkan/diupdate unsold:', err);
            toast.error(err.response?.data?.message || 'Gagal menambahkan/diupdate unsold');
        }
    };

    return (
        <>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{idUnsold ? 'Edit Unsold' : 'Tambah Unsold Baru'}</h5>
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
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="NIP"
                                            value={NIP}
                                            onChange={(e) => setNIP(e.target.value)}
                                            placeholder="Masukkan NIP"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="koin" className="col-form-label">
                                            Koin:
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="koin"
                                            value={koin}
                                            onChange={(e) => setKoin(e.target.value)}
                                            placeholder="Masukkan Koin"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="harga_beli" className="col-form-label">
                                            Harga Beli:
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="harga_beli"
                                            value={hargaBeli}
                                            onChange={(e) => setHargaBeli(e.target.value)}
                                            placeholder="Masukkan Harga Beli"
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
                                    onClick={handleAddUnsold}
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

export default ModalAddUnsold;