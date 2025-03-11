import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalUpdateAkun = ({ showModal, setShowModal, selectedAkun, token, setAkunList }) => {
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

  useEffect(() => {
    if (selectedAkun) {
      setUsernameSteam(selectedAkun.username_steam || '');
      setPasswordSteam(selectedAkun.password_steam || '');
      setGmail(selectedAkun.gmail || '');
      setKet(selectedAkun.ket || '');
      setNamaGame(selectedAkun.nama_game || '');
    }
  }, [selectedAkun]);

  const handleUpdate = async () => {
    if (!selectedAkun || !selectedAkun.id_akun) {
      toast.error('Data akun tidak valid');
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/akun/update/${selectedAkun.id_akun}`,
        {
          username_steam: usernameSteam,
          password_steam: passwordSteam,
          gmail,
          ket,
          nama_game: namaGame
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        setAkunList(prevList =>
          prevList.map(akun =>
            akun.id_akun === selectedAkun.id_akun
              ? {
                  ...akun,
                  username_steam: usernameSteam,
                  password_steam: passwordSteam,
                  gmail,
                  ket,
                  nama_game: namaGame
                }
              : akun
          )
        );
        setShowModal(false);
        toast.success('Akun berhasil diperbarui!');
      }
    } catch (err) {
      console.error('Error updating akun:', err);
      toast.error(err.response?.data?.message || 'Gagal memperbarui akun');
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
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label htmlFor="nama_game" className="col-form-label">
                      Nama Game:
                    </label>
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

        .form-group {
          margin-bottom: 1rem;
        }

        .form-control {
          width: 100%;
          padding: 0.375rem 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 0.25rem;
        }
      `}</style>
    </>
  );
};

export default ModalUpdateAkun;