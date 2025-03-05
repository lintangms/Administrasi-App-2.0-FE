import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalUpdateGaji = ({ showModal, setShowModal, token, selectedGaji, onUpdateSuccess }) => {
  const [potongan, setPotongan] = useState('');
  const [kasbon, setKasbon] = useState(0);
  const [tunjanganJabatan, setTunjanganJabatan] = useState(0);

  useEffect(() => {
    if (selectedGaji) {
      setPotongan(selectedGaji.potongan);
      setKasbon(selectedGaji.kasbon || 0);
      setTunjanganJabatan(selectedGaji.tunjangan_jabatan || 0);
    }
  }, [selectedGaji]);

  const handleUpdate = async () => {
    const updateData = {
      id_gaji: selectedGaji.id_gaji,
      potongan: potongan ? Number(potongan) : undefined,
      kasbon: kasbon ? Number(kasbon) : undefined,
      tunjangan_jabatan: tunjanganJabatan ? Number(tunjanganJabatan) : undefined,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/gaji/gajian`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        onUpdateSuccess(response.data.data); // Callback untuk memperbarui data gaji
        setShowModal(false);
        toast.success('Gaji berhasil diperbarui!');
      }
    } catch (err) {
      console.error('Error saat memperbarui gaji:', err);
      toast.error('Gagal memperbarui gaji');
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Gaji</h5>
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
                    <label htmlFor="potongan" className="col-form-label">
                      Potongan (%):
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="potongan"
                      value={potongan}
                      onChange={(e) => setPotongan(e.target.value)}
                      placeholder="Masukkan Potongan"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="kasbon" className="col-form-label">
                      Kasbon:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="kasbon"
                      value={kasbon}
                      onChange={(e) => setKasbon(e.target.value)}
                      placeholder="Masukkan Kasbon"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="tunjangan_jabatan" className="col-form-label">
                      Tunjangan Jabatan:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="tunjangan_jabatan"
                      value={tunjanganJabatan}
                      onChange={(e) => setTunjanganJabatan(e.target.value)}
                      placeholder="Masukkan Tunjangan Jabatan"
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

export default ModalUpdateGaji;