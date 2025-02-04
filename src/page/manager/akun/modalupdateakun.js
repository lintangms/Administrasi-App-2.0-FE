import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const ModalUpdateAkun = ({ showModal, setShowModal, selectedAkun, token, setAkunList }) => {
  const [username, setUsername] = useState('');
  const [jenis, setJenis] = useState('');
  const [noPemulihan, setNoPemulihan] = useState('');
  const [emailPemulihan, setEmailPemulihan] = useState('');
  const [ket, setKet] = useState('');

  useEffect(() => {
    if (selectedAkun) {
      setUsername(selectedAkun.username);
      setJenis(selectedAkun.jenis);
      setNoPemulihan(selectedAkun.no_pemulihan);
      setEmailPemulihan(selectedAkun.email_pemulihan);
      setKet(selectedAkun.ket);
    }
  }, [selectedAkun]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/akun/update/${selectedAkun.id_akun}`, // Menggunakan URL dari .env
        { username, jenis, no_pemulihan: noPemulihan, email_pemulihan: emailPemulihan, ket },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        // Update the list
        setAkunList(prevList =>
          prevList.map(akun =>
            akun.id_akun === selectedAkun.id_akun
              ? { ...akun, username, jenis, no_pemulihan: noPemulihan, email_pemulihan: emailPemulihan, ket }
              : akun
          )
        );
        setShowModal(false);
        toast.success('Akun berhasil diperbarui!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error updating akun:', err);
      toast.error('Gagal memperbarui akun'); // Notifikasi gagal
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Akun</h5>
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
                    <label htmlFor="username" className="col-form-label">
                      Username:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masukkan username"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="jenis" className="col-form-label">
                      Jenis:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="jenis"
                      value={jenis}
                      onChange={(e) => setJenis(e.target.value)}
                      placeholder="Masukkan jenis"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="no-pemulihan" className="col-form-label">
                      No Pemulihan:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="no-pemulihan"
                      value={noPemulihan}
                      onChange={(e) => setNoPemulihan(e.target.value)}
                      placeholder="Masukkan no pemulihan"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email-pemulihan" className="col-form-label">
                      Email Pemulihan:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email-pemulihan"
                      value={emailPemulihan}
                      onChange={(e) => setEmailPemulihan(e.target.value)}
                      placeholder="Masukkan email pemulihan"
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

export default ModalUpdateAkun;