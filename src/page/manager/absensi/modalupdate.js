import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalUpdateKeterangan = ({ showModal, setShowModal, selectedAbsen, setAbsenList, token, onUpdateSuccess }) => {
    const [keterangan, setKeterangan] = useState('');

    useEffect(() => {
        if (selectedAbsen) {
            setKeterangan(selectedAbsen.ket || '');
        }
    }, [selectedAbsen]);

    const handleUpdate = async () => {
        if (!selectedAbsen || !selectedAbsen.id_absen) {
            toast.error('ID absensi tidak ditemukan');
            return;
        }

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/absen/update/${selectedAbsen.id_absen}`,
                { ket: keterangan },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                toast.success('Keterangan berhasil diupdate!');
                onUpdateSuccess(); // Refresh data
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error saat mengupdate keterangan:', error);
            toast.error('Gagal mengupdate keterangan');
        }
    };

    return (
        <>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Keterangan</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <textarea
                                    className="form-control"
                                    value={keterangan}
                                    onChange={(e) => setKeterangan(e.target.value)}
                                    placeholder="Masukkan keterangan baru"
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Tutup
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                    width: 90%;
                    max-width: 500px;
                    display: flex;
                    flex-direction: column;
                    max-height: 80vh;
                }

                .modal-content {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .modal-header {
                    padding: 15px;
                    border-bottom: 1px solid #dee2e6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                }

                .modal-body {
                    padding: 15px;
                    overflow-y: auto;
                    flex-grow: 1;
                }

                .modal-footer {
                    padding: 15px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    flex-shrink: 0;
                    background: #fff;
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
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

                @media (max-width: 576px) {
                    .modal-container {
                        width: 95%;
                        max-height: 85vh;
                    }
                }
            `}</style>
        </>
    );
};

export default ModalUpdateKeterangan;