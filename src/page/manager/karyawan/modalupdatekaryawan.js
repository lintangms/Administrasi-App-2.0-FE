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
    nama_jabatan: '', // Ubah id_jabatan menjadi nama_jabatan
    nama_divisi: '',  // Ubah id_divisi menjadi nama_divisi
    nama_shift: '',   // Tambahkan nama_shift
    nama_game: '',    // Tambahkan nama_game
    akun: '',         // Tambahkan akun
    username: '',
    password: '',
    ket: '',
    gambar: null, // Tambahkan state untuk gambar
  });

  const [jabatanList, setJabatanList] = useState([]);
  const [divisiList, setDivisiList] = useState([]);
  const [shiftList, setShiftList] = useState([]); // State untuk shift
  const [gameList, setGameList] = useState([]);   // State untuk game
  const [akunList, setAkunList] = useState([]);   // State untuk akun

  useEffect(() => {
    // Ambil data jabatan, divisi, shift, game, dan akun saat komponen dimuat
    const fetchData = async () => {
      try {
        const jabatanResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/jabatan/get`);
        const divisiResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/divisi/get`);
        const shiftResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/shift/get`); // Ambil data shift
        const gameResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/game/get`);   // Ambil data game
        const akunResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/akun/get`);   // Ambil data akun

        // Ambil data dari properti 'data' dalam respons
        if (Array.isArray(jabatanResponse.data.data)) {
          setJabatanList(jabatanResponse.data.data);
        } else {
          console.error('Data jabatan tidak dalam format array:', jabatanResponse.data);
          setJabatanList([]);
        }

        if (Array.isArray(divisiResponse.data.data)) {
          setDivisiList(divisiResponse.data.data);
        } else {
          console.error('Data divisi tidak dalam format array:', divisiResponse.data);
          setDivisiList([]);
        }

        if (Array.isArray(shiftResponse.data.data)) {
          setShiftList(shiftResponse.data.data);
        } else {
          console.error('Data shift tidak dalam format array:', shiftResponse.data);
          setShiftList([]);
        }

        if (Array.isArray(gameResponse.data.data)) {
          setGameList(gameResponse.data.data);
        } else {
          console.error('Data game tidak dalam format array:', gameResponse.data);
          setGameList([]);
        }

        if (Array.isArray(akunResponse.data.data)) {
          setAkunList(akunResponse.data.data);
        } else {
          console.error('Data akun tidak dalam format array:', akunResponse.data);
          setAkunList([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Set formData jika ada selectedKaryawan
    if (selectedKaryawan) {
      setFormData(selectedKaryawan);
    }
  }, [selectedKaryawan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, gambar: e.target.files[0] }); // Simpan file gambar
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/karyawan/update/${formData.id_karyawan}`,
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      if (response.status === 200) {
        setKaryawanList((prevList) =>
          prevList.map((karyawan) => (karyawan.id_karyawan === formData.id_karyawan ? formData : karyawan))
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
      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Karyawan</h5>
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
                    <label htmlFor="NIP" className="col-form-label">NIP:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="NIP"
                      name="NIP"
                      value={formData.NIP}
                      onChange={handleChange}
                      placeholder="Masukkan NIP"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nama" className="col-form-label">Nama:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Masukkan nama"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="alamat" className="col-form-label">Alamat:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="alamat"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      placeholder="Masukkan alamat"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telp" className="col-form-label">Telepon:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="telp"
                      name="telp"
                      value={formData.telp}
                      onChange={handleChange}
                      placeholder="Masukkan telepon"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ttl" className="col-form-label">Tanggal Lahir:</label>
                    <input
                      type="date"
                      className="form-control"
                      id="ttl"
                      name="ttl"
                      value={formData.ttl}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pendidikan" className="col-form-label">Pendidikan:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="pendidikan"
                      name="pendidikan"
                      value={formData.pendidikan}
                      onChange={handleChange}
                      placeholder="Masukkan pendidikan"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status" className="col-form-label">Status:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      placeholder="Masukkan status"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mulai_bekerja" className="col-form-label">Mulai Bekerja:</label>
                    <input
                      type="date"
                      className="form-control"
                      id="mulai_bekerja"
                      name="mulai_bekerja"
                      value={formData.mulai_bekerja}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="jabatan" className="col-form-label">Jabatan:</label>
                    <select
                      className="form-control"
                      id="jabatan"
                      name="nama_jabatan"
                      value={formData.nama_jabatan}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Jabatan</option>
                      {Array.isArray(jabatanList) && jabatanList.map((jabatan) => (
                        <option key={jabatan.id} value={jabatan.nama_jabatan}>
                          {jabatan.nama_jabatan}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
 <label htmlFor="divisi" className="col-form-label">Divisi:</label>
                    <select
                      className="form-control"
                      id="divisi"
                      name="nama_divisi"
                      value={formData.nama_divisi}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Divisi</option>
                      {Array.isArray(divisiList) && divisiList.map((divisi) => (
                        <option key={divisi.id} value={divisi.nama_divisi}>
                          {divisi.nama_divisi}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="shift" className="col-form-label">Shift:</label>
                    <select
                      className="form-control"
                      id="shift"
                      name="nama_shift"
                      value={formData.nama_shift}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Shift</option>
                      {Array.isArray(shiftList) && shiftList.map((shift) => (
                        <option key={shift.id} value={shift.nama_shift}>
                          {shift.nama_shift}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="game" className="col-form-label">Game:</label>
                    <select
                      className="form-control"
                      id="game"
                      name="nama_game"
                      value={formData.nama_game}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Game</option>
                      {Array.isArray(gameList) && gameList.map((game) => (
                        <option key={game.id} value={game.nama_game}>
                          {game.nama_game}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="akun" className="col-form-label">Akun:</label>
                    <select
                      className="form-control"
                      id="akun"
                      name="akun"
                      value={formData.akun}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Akun</option>
                      {Array.isArray(akunList) && akunList.map((akun) => (
                        <option key={akun.id} value={akun.nama_akun}>
                          {akun.nama_akun}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="username" className="col-form-label">Username:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Masukkan username"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="col-form-label">Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gambar" className="col-form-label">Gambar:</label>
                    <input
                      type="file"
                      className="form-control"
                      id="gambar"
                      name="gambar"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ket" className="col-form-label">Keterangan:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ket"
                      name="ket"
                      value={formData.ket}
                      onChange={handleChange}
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
          background: rgba(0, 0, 0, 0.5 );
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
          max-height: 80%; /* Batasi tinggi modal */
          overflow-y: auto; /* Tambahkan scroll jika konten melebihi tinggi */
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

export default ModalUpdateKaryawan;