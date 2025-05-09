import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalAddPenjualan = ({ showModal, setShowModal, token, selectedKoin, onAddSuccess }) => {
  const [formData, setFormData] = useState({
    server: '',
    demand: '',
    rate: '',
    ket: '',
    koin_dijual: '',
    tgl_transaksi: '' // New field for transaction date
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.server || !formData.demand || !formData.rate || !formData.ket || !formData.koin_dijual || !formData.tgl_transaksi) {
      toast.error('Semua field harus diisi');
      return;
    }

    try {
      const payload = {
        NIP: selectedKoin.NIP === 'WOW' ? null : selectedKoin.NIP,
        id_koin: selectedKoin.NIP === 'WOW' ? null : selectedKoin.id_koin,
        id_wow: selectedKoin.NIP === 'WOW' ? selectedKoin.id_koin : null,
        server: formData.server,
        demand: formData.demand,
        rate: Number(formData.rate),
        ket: formData.ket,
        koin_dijual: Number(formData.koin_dijual),
        tgl_transaksi: formData.tgl_transaksi // Include transaction date in payload
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/penjualan/jual`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        toast.success('Penjualan berhasil ditambahkan!');
        onAddSuccess();
      }
    } catch (err) {
      console.error('Error saat menyimpan penjualan:', err);
      toast.error('Gagal menambahkan penjualan');
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tambah Penjualan</h5>
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
                    <label className="col-form-label">NIP:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedKoin.NIP === 'WOW' ? 'WOW' : selectedKoin.NIP}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">ID Koin:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedKoin.NIP === 'WOW' ? selectedKoin.id_koin : selectedKoin.id_koin}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Server:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="server"
                      value={formData.server}
                      onChange={handleChange}
                      placeholder="Masukkan Server"
                    />
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Demand:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="demand"
                      value={formData.demand}
                      onChange={handleChange}
                      placeholder="Masukkan Demand"
                    />
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Rate:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="rate"
                      value={formData.rate}
                      onChange={handleChange}
                      placeholder="Masukkan Rate"
                    />
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Keterangan:</label>
                    <textarea
                      className="form-control"
                      name="ket"
                      value={formData.ket}
                      onChange={handleChange}
                      placeholder="Masukkan Keterangan"
                    />
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Koin Dijual:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="koin_dijual"
                      value={formData.koin_dijual}
                      onChange={handleChange}
                      placeholder="Masukkan Koin Dijual"
                    />
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Tanggal Transaksi:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="tgl_transaksi"
                      value={formData.tgl_transaksi}
                      onChange={handleChange}
                      placeholder="Masukkan Tanggal Transaksi"
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

export default ModalAddPenjualan;