import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalUpdatePenjualan = ({ showModal, setShowModal, selectedPenjualan, token, setPenjualanList }) => {
  const [NIP, setNIP] = useState('');
  const [idKoin, setIdKoin] = useState('');
  const [server, setServer] = useState('');
  const [demand, setDemand] = useState('');
  const [rate, setRate] = useState('');
  const [ket, setKet] = useState('');
  const [koinDijual, setKoinDijual] = useState('');

  useEffect(() => {
    if (selectedPenjualan) {
      setNIP(selectedPenjualan.NIP || '');
      setIdKoin(selectedPenjualan.id_koin || '');
      setServer(selectedPenjualan.server || '');
      setDemand(selectedPenjualan.demand || '');
      setRate(selectedPenjualan.rate || '');
      setKet(selectedPenjualan.ket || '');
      setKoinDijual(selectedPenjualan.koin_dijual || '');
    }
  }, [selectedPenjualan]);

  const handleUpdate = async () => {
    if (!selectedPenjualan || !selectedPenjualan.id) {
      toast.error('Data penjualan tidak valid');
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/penjualan/update/${selectedPenjualan.id}`,
        {
          NIP,
          id_koin: idKoin,
          server,
          demand,
          rate,
          ket,
          koin_dijual: koinDijual
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        setPenjualanList(prevList =>
          prevList.map(penjualan =>
            penjualan.id === selectedPenjualan.id
              ? {
                  ...penjualan,
                  NIP,
                  id_koin: idKoin,
                  server,
                  demand,
                  rate,
                  ket,
                  koin_dijual: koinDijual
                }
              : penjualan
          )
        );
        setShowModal(false);
        toast.success('Penjualan berhasil diperbarui!');
      }
    } catch (err) {
      console.error('Error updating penjualan:', err);
      toast.error(err.response?.data?.message || 'Gagal memperbarui penjualan');
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Penjualan</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => e.preventDefault()}>
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
                  onClick={handleUpdate}
                >
                  Update
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
          font-size: 1.5 rem;
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

export default ModalUpdatePenjualan;