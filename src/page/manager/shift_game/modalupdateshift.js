import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalUpdateShift = ({ showModal, setShowModal, selectedShift, token, setShiftList }) => {
  const [namaShift, setNamaShift] = useState('');

  useEffect(() => {
    if (selectedShift) {
      setNamaShift(selectedShift.nama_shift); // Pastikan ini menggunakan namaShift
    }
  }, [selectedShift]);

  const handleUpdate = async () => {
    if (namaShift.trim() === '') {
      toast.error('Nama shift harus diisi'); // Notifikasi error
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/shift/update/${selectedShift.id_shift}`,
        { nama_shift: namaShift }, // Pastikan ini menggunakan nama_shift
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setShiftList((prevList) =>
          prevList.map((shift) =>
            shift.id_shift === selectedShift.id_shift ? { ...shift, nama_shift: namaShift } : shift
          )
        );
        toast.success('Shift berhasil diperbarui!'); // Notifikasi sukses
        setShowModal(false); // Tutup modal
        setNamaShift(''); // Reset input
      }
    } catch (err) {
      console.error('Error saat memperbarui shift:', err);
      toast.error('Gagal memperbarui shift'); // Notifikasi gagal
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Shift</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
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
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Tutup
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                  Update
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

export default ModalUpdateShift;