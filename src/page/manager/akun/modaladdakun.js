import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalAddAkun = ({ showModal, setShowModal, setAkunList, token, onAddSuccess }) => {
  const [usernameSteam, setUsernameSteam] = useState('');
  const [passwordSteam, setPasswordSteam] = useState('');
  const [gmail, setGmail] = useState('');
  const [ket, setKet] = useState('');
  const [namaGame, setNamaGame] = useState('');
  const [gameOptions, setGameOptions] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/game/get`);
        if (Array.isArray(response.data.data)) {
          setGameOptions(response.data.data);
        } else {
          throw new Error('Data game tidak valid');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        toast.error('Gagal memuat daftar game');
      }
    };

    fetchGames();
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/akun/add`,
        {
          username_steam: usernameSteam,
          password_steam: passwordSteam,
          gmail,
          ket,
          nama_game: namaGame
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        onAddSuccess(response.data.data);
        setShowModal(false);
        toast.success('Akun berhasil ditambahkan!');
      }
    } catch (err) {
      console.error('Error saat menyimpan akun:', err);
      toast.error('Gagal menambahkan akun');
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
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="nama_game" className="col-form-label">Nama Game:</label>
                    <select
                      className="form-control"
                      id="nama_game"
                      value={namaGame}
                      onChange={(e) => setNamaGame(e.target.value)}
                    >
                      <option value="">Pilih Nama Game</option>
                      {gameOptions.map((game) => (
                        <option key={game.id_game} value={game.nama_game}>
                          {game.nama_game}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="username_steam" className="col-form-label">Username Steam:</label>
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
                    <label htmlFor="password_steam" className="col-form-label">Password Steam:</label>
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
                    <label htmlFor="gmail" className="col-form-label">Gmail:</label>
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
                    <label htmlFor="ket" className="col-form-label">Keterangan:</label>
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
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Tutup
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  Simpan
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
          width: 90%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          max-height: 80vh;
        }

        .modal-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .modal-header {
          padding: 15px;
          border-bottom: 1px solid #dee2e6;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .modal-body {
          padding: 15px;
          overflow-y: auto;
          flex-grow: 1;
        }

        .modal-footer {
          padding: 15px;
          border-top: 1px solid #dee2e6;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-shrink: 0;
          background: #fff;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
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

        @media (max-width: 576px) {
          .modal-container {
            width: 95%;
            max-height: 85vh;
          }
        }
      `}</style>
    </>
  );
};

export default ModalAddAkun;