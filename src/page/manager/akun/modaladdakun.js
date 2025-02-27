import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const ModalAddAkun = ({ showModal, setShowModal, setAkunList, token, onAddSuccess }) => {
  const [usernameSteam, setUsernameSteam] = useState('');
  const [passwordSteam, setPasswordSteam] = useState('');
  const [gmail, setGmail] = useState('');
  const [passwordGmail, setPasswordGmail] = useState('');
  const [noPemulihan, setNoPemulihan] = useState('');
  const [emailPemulihan, setEmailPemulihan] = useState('');
  const [ket, setKet] = useState('');

  const handleSave = async () => {
    if (usernameSteam.trim() === '' || passwordSteam.trim() === '' || gmail.trim() === '' || passwordGmail.trim() === '' || noPemulihan.trim() === '' || emailPemulihan.trim() === '' || ket.trim() === '') {
      toast.error('Semua field harus diisi'); // Notifikasi error
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/akun/add`, // Menggunakan URL dari .env
        { 
          username_steam: usernameSteam, 
          password_steam: passwordSteam, 
          gmail, 
          password_gmail: passwordGmail, 
          no_pemulihan: noPemulihan, 
          email_pemulihan: emailPemulihan, 
          ket 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        onAddSuccess(response.data.data); // Callback untuk menambahkan akun baru
        setShowModal(false);
        toast.success('Akun berhasil ditambahkan!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error saat menyimpan akun:', err);
      toast.error('Gagal menambahkan akun'); // Notifikasi gagal
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tambah Akun</h5>
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
                    <label htmlFor="username_steam" className="col-form-label">
                      Username Steam:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username_steam"
                      value={usernameSteam}
                      onChange={(e) => setUsernameSteam(e.target.value)}
                      placeholder="Masukkan username steam"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password_steam" className="col-form-label">
                      Password Steam:
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password_steam"
                      value={passwordSteam}
                      onChange={(e) => setPasswordSteam(e.target.value)}
                      placeholder="Masukkan password steam"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gmail" className="col-form-label">
                      Gmail:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="gmail"
                      value={gmail}
                      onChange={(e) => setGmail(e.target.value)}
                      placeholder="Masukkan gmail"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password_gmail" className="col-form-label">
                      Password Gmail:
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password_gmail"
                      value={passwordGmail}
                      onChange={(e) => setPasswordGmail(e.target.value)}
                      placeholder="Masukkan password gmail"
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

export default ModalAddAkun;