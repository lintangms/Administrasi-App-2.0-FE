import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen, FaTrash } from 'react-icons/fa';
import ModalAddShift from './modaladdshift.js'; // Modal untuk menambah Shift
import ModalUpdateShift from './modalupdateshift.js'; // Modal untuk memperbarui Shift
import ModalAddGame from './modaladdgame.js'; // Modal untuk menambah Game
import ModalUpdateGame from './modalupdategame.js'; // Modal untuk memperbarui Game
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const Shift_Game = () => {
  const [shiftList, setShiftList] = useState([]); // State untuk Shift
  const [gameList, setGameList] = useState([]); // State untuk Game
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedShift, setSelectedShift] = useState(null); // State untuk Shift yang dipilih
  const [selectedGame, setSelectedGame] = useState(null); // State untuk Game yang dipilih
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [showUpdateShiftModal, setShowUpdateShiftModal] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [showUpdateGameModal, setShowUpdateGameModal] = useState(false);

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env

  // Fetch Shift data
  useEffect(() => {
    const fetchShift = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/shift/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setShiftList(response.data.data);
        } else {
          setShiftList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data shift:', err);
        setError('Gagal mengambil data shift');
        setShiftList([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchGame = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/game/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setGameList(response.data.data);
        } else {
          setGameList([]);
        }
      } catch (err) {
        console.error('Error saat mengambil data game:', err);
        setError('Gagal mengambil data game');
        setGameList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShift();
    fetchGame();
  }, [token]);

  // Handle Edit action for Shift
  const handleEditShift = (shift) => {
    setSelectedShift(shift);
    setShowUpdateShiftModal(true); // Show Update Modal
  };

  // Handle Delete action for Shift
  const handleDeleteShift = async (id) => {
    if (!id) {
      console.error('ID tidak valid:', id);
      return;
    }
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/shift/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setShiftList(shiftList.filter((shift) => shift.id_shift !== id));
        toast.success('Shift berhasil dihapus!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error saat menghapus data shift:', err);
      toast.error('Gagal menghapus shift.'); // Notifikasi gagal
    }
  };

  // Handle Edit action for Game
  const handleEditGame = (game) => {
    setSelectedGame(game);
    setShowUpdateGameModal(true); // Show Update Modal
  };

  // Handle Delete action for Game
  const handleDeleteGame = async (id) => {
    if (!id) {
      console.error('ID tidak valid:', id);
      return;
    }
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/game/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setGameList(gameList.filter((game) => game.id_game !== id));
        toast.success('Game berhasil dihapus!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error saat menghapus data game:', err);
      toast.error('Gagal menghapus game.'); // Notifikasi gagal
    }
  };

  // Callback untuk menambahkan shift baru
  const handleAddShift = (newShift) => {
    setShiftList((prevList) => [newShift, ...prevList]); // Tambahkan di atas
    toast.success('Shift berhasil ditambahkan!'); // Notifikasi sukses
  };

  // Callback untuk menambahkan game baru
  const handleAddGame = (newGame) => {
    setGameList((prevList) => [newGame, ...prevList]); // Tambahkan di atas
    toast.success('Game berhasil ditambahkan!'); // Notifikasi sukses
  };

  return (
    <div className="riwayat-container">
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Tabel Shift */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Shift Table</h6>
                <button
                  className="btn btn-success me-3"
                  onClick={() => {
                    setShowAddShiftModal(true);
                    toast.info('Silakan isi form untuk menambahkan shift.'); // Notifikasi info
                  }}
                >
                  + Add
                </button>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        No
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Nama Shift
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {shiftList && shiftList.length > 0 ? (
                      shiftList.map((shift, index) => (
                        <tr key={shift.id_shift}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{shift.nama_shift}</td>
                          <td>
                            <button
                              className="btn btn-info btn-sm me-2 rounded" // Tambahkan kelas rounded
                              onClick={() => handleEditShift(shift)}
                            >
                              <FaPen />
                            </button>
                            <button
                              onClick={() => handleDeleteShift(shift.id_shift)}
                              className="btn btn-danger btn-sm me-2 rounded" // Tambahkan kelas rounded
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">Tidak ada shift tersedia</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tabel Game */}
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3">Game Table</h6>
                <button
                  className="btn btn-success me-3"
                  onClick={() => {
                    setShowAddGameModal(true);
                    toast.info('Silakan isi form untuk menambahkan game.'); // Notifikasi info
                  }}
                >
                  + Add
                </button>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        No
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Nama Game
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {gameList && gameList.length > 0 ? (
                      gameList.map((game, index) => (
                        <tr key={game.id_game}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{game.nama_game}</td>
                          <td>
                            <button
                              className="btn btn-info btn-sm me-2 rounded" // Tambahkan kelas rounded
                              onClick={() => handleEditGame(game)}
                            >
                              <FaPen />
                            </button>
                            <button
                              onClick={() => handleDeleteGame(game.id_game)}
                              className="btn btn-danger btn-sm me-2 rounded" // Tambahkan kelas rounded
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">Tidak ada game tersedia</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add Shift Modal */}
          <ModalAddShift
            showModal={showAddShiftModal}
            setShowModal={setShowAddShiftModal}
            setShiftList={setShiftList} // Ganti dengan setShiftList
            token={token}
            onAddSuccess={handleAddShift} // Callback untuk menambahkan shift baru
          />

          {/* Update Shift Modal */}
          <ModalUpdateShift
            showModal={showUpdateShiftModal}
            setShowModal={setShowUpdateShiftModal}
            selectedShift={selectedShift} // Ganti dengan selectedShift
            setShiftList={setShiftList} // Ganti dengan setShiftList
            token={token}
          />

          {/* Add Game Modal */}
          <ModalAddGame
            showModal={showAddGameModal}
            setShowModal={setShowAddGameModal}
            setGameList={setGameList} // Ganti dengan setGameList
            token={token}
            onAddSuccess={handleAddGame} // Callback untuk menambahkan game baru
          />

          {/* Update Game Modal */}
          <ModalUpdateGame
            showModal={showUpdateGameModal}
            setShowModal={setShowUpdateGameModal}
            selectedGame={selectedGame} // Ganti dengan selectedGame
            setGameList={setGameList} // Ganti dengan setGameList
            token={token}
          />
        </>
      )}

      {/* Inline CSS */}
      <style>{`
        .table {
          width: 100%;
          margin-bottom: 1rem;
          color: #212529;
        }

        .table th,
        .table td {
          padding: 0.75rem;
          vertical-align: top;
          border-top: 1px solid #dee2e6;
        }

        .table thead th {
          vertical-align: bottom;
          border-bottom: 2px solid #dee2e6;
        }

        .text-uppercase {
          text-transform: uppercase;
        }

        .text-secondary {
          color: #6c757d;
        }

        .text-xxs {
          font-size: 0.75rem;
        }

        .font-weight-bolder {
          font-weight: bolder;
        }

        .bg-gradient-dark {
          background: linear-gradient(180deg, #1a1a1a 0%, #343a40 100%);
        }

        .badge {
          display: inline-block;
          padding: 0.5em 0.75em;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          text-align: center;
          text-decoration: none;
          white-space: nowrap;
          border-radius: 0.375rem;
        }

        .bg-gradient-success {
          background-color: #28a745;
        }

        .border-radius-lg {
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Shift_Game;