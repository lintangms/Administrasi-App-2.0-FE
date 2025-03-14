import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Shift_Game_Direktur = () => {
  const [shiftList, setShiftList] = useState([]); // State untuk Shift
  const [gameList, setGameList] = useState([]); // State untuk Game
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        setError('Tidak ada data shift');
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
        setError('Tidak ada data game');
        setGameList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShift();
    fetchGame();
  }, [token]);

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
                    </tr>
                  </thead>

                  <tbody>
                    {shiftList && shiftList.length > 0 ? (
                      shiftList.map((shift, index) => (
                        <tr key={shift.id_shift}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{shift.nama_shift}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">Tidak ada shift tersedia</td>
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
                    </tr>
                  </thead>

                  <tbody>
                    {gameList && gameList.length > 0 ? (
                      gameList.map((game, index) => (
                        <tr key={game.id_game}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{game.nama_game}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">Tidak ada game tersedia</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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

        .border-radius-lg {
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Shift_Game_Direktur;