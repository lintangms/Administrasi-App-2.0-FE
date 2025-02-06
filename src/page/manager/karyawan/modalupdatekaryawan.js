import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalUpdateKaryawan = ({ showModal, setShowModal, selectedKaryawan, setKaryawanList, token }) => {
  const [formData, setFormData] = useState({
    NIP: '',
    nama: '',
    alamat: '',
    telp: '',
    ttl: '',
    pendidikan: '',
    status: '',
    mulai_bekerja: '',
    nama_jabatan: '',
    nama_divisi: '',
    nama_shift: '',
    nama_game: '',
    username_akun: '',
    username: '',
    password: '',
    ket: '',
  });

  const [jabatanList, setJabatanList] = useState([]);
  const [divisiList, setDivisiList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [gameList, setGameList] = useState([]);
  const [akunList, setAkunList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jabatanRes, divisiRes, shiftRes, gameRes, akunRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/jabatan/get`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/divisi/get`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/shift/get`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/game/get`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/akun/get`)
        ]);

        setJabatanList(jabatanRes.data.data || []);
        setDivisiList(divisiRes.data.data || []);
        setShiftList(shiftRes.data.data || []);
        setGameList(gameRes.data.data || []);
        setAkunList(akunRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Gagal mengambil data referensi');
      }
    };

    fetchData();

    if (selectedKaryawan) {
      setFormData({
        ...selectedKaryawan,
        username_akun: selectedKaryawan.username_akun,
      });
    }
  }, [selectedKaryawan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const { nama_jabatan, nama_divisi, username_akun, nama_game, nama_shift } = formData;

      const [jabatanRes, divisiRes, akunRes, gameRes, shiftRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/jabatan/get`, { params: { nama_jabatan } }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/divisi/get`, { params: { nama_divisi } }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/akun/get`, { params: { username: username_akun } }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/game/get`, { params: { nama_game } }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/shift/get`, { params: { nama_shift } }),
      ]);

      if (!jabatanRes.data.data.length) {
        return toast.error('Jabatan tidak ditemukan');
      }
      if (!divisiRes.data.data.length) {
        return toast.error('Divisi tidak ditemukan');
      }
      if (!akunRes.data.data.length) {
        return toast.error('Akun tidak ditemukan');
      }
      if (!gameRes.data.data.length) {
        return toast.error('Game tidak ditemukan');
      }
      if (!shiftRes.data.data.length) {
        return toast.error('Shift tidak ditemukan');
      }

      const id_jabatan = jabatanRes.data.data[0].id_jabatan;
      const id_divisi = divisiRes.data.data[0].id_divisi;
      const id_akun = akunRes.data.data[0].id_akun;
      const id_game = gameRes.data.data[0].id_game;
      const id_shift = shiftRes.data.data[0].id_shift;

      formDataToSend.append('id_jabatan', id_jabatan);
      formDataToSend.append('id_divisi', id_divisi);
      formDataToSend.append('id_akun', id_akun);
      formDataToSend.append('id_game', id_game);
      formDataToSend.append('id_shift', id_shift);

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/karyawan/update/${selectedKaryawan.id_karyawan}`,
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      if (response.status === 200) {
        setKaryawanList((prevList) =>
          prevList.map((karyawan) => (karyawan.id_karyawan === selectedKaryawan.id_karyawan ? formData : karyawan))
        );
        toast.success('Karyawan berhasil diperbarui!');
        setShowModal(false);
        setFormData({}); // Reset form
      }
    } catch (error) {
      console.error('Error saat memperbarui karyawan:', error);
      toast.error('Gagal memperbarui karyawan.');
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Karyawan</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>NIP:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="NIP"
                      value={formData.NIP}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nama:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Alamat:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Telepon:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="telp"
                      value={formData.telp}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tanggal Lahir:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="ttl"
                      value={formData.ttl}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pendidikan:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="pendidikan"
                      value={formData.pendidikan}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status:</label>
                    <select
                      className="form-control"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Status Karyawan</option>
                      <option value="baru">Baru</option>
                      <option value="lama">Lama</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Mulai Bekerja:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="mulai_bekerja"
                      value={formData.mulai_bekerja}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Jabatan:</label>
                    <select
                      className="form-control"
                      name="nama_jabatan"
                      value={formData.nama_jabatan}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Jabatan</option>
                      {jabatanList.map((jabatan) => (
                        <option key={jabatan.id_jabatan} value={jabatan.nama_jabatan}>
                          {jabatan.nama_jabatan}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Divisi:</label>
                    <select
                      className="form-control"
                      name="nama_divisi"
                      value={formData.nama_divisi}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Divisi</option>
                      {divisiList.map((divisi) => (
                        <option key={divisi.id_divisi} value={divisi.nama_divisi}>
                          {divisi.nama_divisi}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Shift:</label>
                    <select
                      className="form-control"
                      name="nama_shift"
                      value={formData.nama_shift}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Shift</option>
                      {shiftList.map((shift) => (
                        <option key={shift.id_shift} value={shift.nama_shift}>
                          {shift.nama_shift}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Game:</label>
                    <select
                      className="form-control"
                      name="nama_game"
                      value={formData.nama_game}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Game</option>
                      {gameList.map((game) => (
                        <option key={game.id_game} value={game.nama_game}>
                          {game.nama_game}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Akun:</label>
                    <select
                      className="form-control"
                      name="username_akun"
                      value={formData.username_akun}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Akun</option>
                      {akunList.map((akun) => (
                        <option key={akun.id_akun} value={akun.username}>
                          {akun.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Username:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Keterangan:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ket"
                      value={formData.ket}
                      onChange={handleChange}
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
          width: 500px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-body {
          padding: 1rem;
        }

        .modal-footer {
          padding: 1rem;
          border-top: 1px solid #dee2e6;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
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

        .close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default ModalUpdateKaryawan;