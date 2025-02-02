import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const ModalUpdatedivisi = ({ showModal, setShowModal, selectedDivisi, token, setDivisiList }) => {
  const [namaDivisi, setNamaDivisi] = useState('');

  useEffect(() => {
    if (selectedDivisi) {
      setNamaDivisi(selectedDivisi.nama_divisi);
    }
  }, [selectedDivisi]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/divisi/update/${selectedDivisi.id_divisi}`, // Menggunakan URL dari .env
        { nama_divisi: namaDivisi },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        // Update the list
        setDivisiList(prevList =>
          prevList.map(divisi =>
            divisi.id_divisi === selectedDivisi.id_divisi
              ? { ...divisi, nama_divisi: namaDivisi }
              : divisi
          )
        );
        setShowModal(false);
        toast.success('Divisi berhasil diperbarui!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error updating divisi:', err);
      toast.error('Gagal memperbarui divisi'); // Notifikasi gagal
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Divisi</h5>
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
                    <label htmlFor="divisi-name" className="col-form-label">
                      Nama Divisi:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="divisi-name"
                      value={namaDivisi}
                      onChange={(e) => setNamaDivisi(e.target.value)}
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

export default ModalUpdatedivisi;