import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const ModalAddPengeluaran = ({ showModal, setShowModal, onAddSuccess, token }) => {
  const [tglTransaksi, setTglTransaksi] = useState('');
  const [uraian, setUraian] = useState('');
  const [nominal, setNominal] = useState('');
  const [ket, setKet] = useState('');

  const handleSave = async () => {
    // Validasi input
    if (tglTransaksi.trim() === '' || uraian.trim() === '' || nominal.trim() === '' || ket.trim() === '') {
      toast.error('Semua field harus diisi'); // Notifikasi error
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/pengeluaran/add`, // Menggunakan URL dari .env
        { tgl_transaksi: tglTransaksi, uraian, nominal, ket },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        onAddSuccess(response.data.data); // Callback untuk menambahkan pengeluaran baru
        setShowModal(false);
        toast.success('Pengeluaran berhasil ditambahkan!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error saat menyimpan pengeluaran:', err);
      toast.error('Gagal menambahkan pengeluaran'); // Notifikasi gagal
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tambah Pengeluaran</h5>
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
                    <label htmlFor="tgl-transaksi" className="col-form-label">
                      Tanggal Transaksi:
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="tgl-transaksi"
                      value={tglTransaksi}
                      onChange={(e) => setTglTransaksi(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="uraian" className="col-form-label">
                      Uraian:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="uraian"
                      value={uraian}
                      onChange={(e) => setUraian(e.target.value)}
                      placeholder="Masukkan uraian"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nominal" className="col-form-label">
                      Nominal:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="nominal"
                      value={nominal}
                      onChange={(e) => setNominal(e.target.value)}
                      placeholder="Masukkan nominal"
                    />
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
                  onClick={handleSave}
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

export default ModalAddPengeluaran;