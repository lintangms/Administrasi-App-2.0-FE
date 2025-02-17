import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalAddPenjualan = ({ showModal, setShowModal, setPenjualanList, token, onAddSuccess }) => {
  const [NIP, setNIP] = useState('');
  const [idKoin, setIdKoin] = useState('');
  const [server, setServer] = useState('');
  const [demand, setDemand] = useState('');
  const [rate, setRate] = useState('');
  const [ket, setKet] = useState('');
  const [koinDijual, setKoinDijual] = useState('');

  const handleSave = async () => {
    if (!NIP || !idKoin || !server || !demand || !rate || !ket || !koinDijual) {
      toast.error('Semua field harus diisi'); // Notifikasi error
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/penjualan/create`, // Menggunakan URL dari .env
        { 
          NIP, 
          id_koin: idKoin, 
          server, 
          demand, 
          rate, 
          ket, 
          koin_dijual: koinDijual 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        onAddSuccess(response.data.data); // Callback untuk menambahkan penjualan baru
        setShowModal(false);
        toast.success('Penjualan berhasil ditambahkan!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error saat menyimpan penjualan:', err);
      toast.error('Gagal menambahkan penjualan'); // Notifikasi gagal
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
                    <label htmlFor="id_koin" className="col-form-label">
                      ID Koin:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="id_koin"
                      value={idKoin}
                      onChange={(e) => setIdKoin(e.target.value)}
                      placeholder="Masukkan ID Koin"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="server" className="col-form-label">
                      Server:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="server"
                      value={server}
                      onChange={(e) => setServer(e.target.value)}
                      placeholder="Masukkan Server"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="demand" className="col-form-label">
                      Demand:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="demand"
                      value={demand}
                      onChange={(e) => setDemand(e.target.value)}
                      placeholder="Masukkan Demand"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="rate" className="col-form-label">
                      Rate:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="rate"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      placeholder="Masukkan Rate"
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
                      placeholder="Masukkan Keterangan"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="koin_dijual" className="col-form-label">
                      Koin Dijual:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="koin_dijual"
                      value={koinDijual}
                      onChange={(e) => setKoinDijual(e.target.value)}
                      placeholder="Masukkan Koin Dijual"
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