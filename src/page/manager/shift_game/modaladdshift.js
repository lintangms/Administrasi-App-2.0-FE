import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const ModalAddShift = ({ showModal, setShowModal, setShiftList, token }) => {
  const [namaShift, setNamaShift] = useState('');

  const handleSave = async () => {
    console.log('Nama shift yang diinput:', namaShift); // Debug log

    if (namaShift.trim() === '') {
      toast.error('Nama shift harus diisi'); // Notifikasi error
      console.error('Error: Nama shift kosong');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/shift/add`, // Menggunakan URL dari .env
        { nama_shift: namaShift },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Response dari server:', response);

      if (response.status === 201) {
        // Update state dengan data baru tanpa refresh
        setShiftList((prevList) => [response.data.data, ...prevList]);

        // Reset form dan modal
        setNamaShift('');
        setShowModal(false);

        // Tampilkan notifikasi sukses
        toast.success('Shift berhasil ditambahkan!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error saat menyimpan shift:', err);
      toast.error('Gagal menambahkan shift'); // Notifikasi gagal
    }
  };

  return (
    <>
      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tambah Shift</h5>
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
                    <label htmlFor="shift-name" className="col-form-label">
                      Nama Shift:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="shift-name"
                      value={namaShift}
                      onChange={(e) => setNamaShift(e.target.value)}
                      placeholder="Masukkan nama shift"
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

      {/* Inline CSS */}
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

export default ModalAddShift;