import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast dari react-toastify

const ModalUpdateInventaris = ({ showModal, setShowModal, selectedInventaris, token, setInventarisList }) => {
  const [namaBarang, setNamaBarang] = useState('');
  const [tglBeli, setTglBeli] = useState('');
  const [harga, setHarga] = useState('');
  const [ket, setKet] = useState('');

  useEffect(() => {
    if (selectedInventaris) {
      setNamaBarang(selectedInventaris.nama_barang);
      setTglBeli(selectedInventaris.tgl_beli);
      setHarga(selectedInventaris.harga);
      setKet(selectedInventaris.ket);
    }
  }, [selectedInventaris]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/inventaris/update/${selectedInventaris.id_inventaris}`, // Menggunakan URL dari .env
        { nama_barang: namaBarang, tgl_beli: tglBeli, harga: harga, ket: ket },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        // Update the list
        setInventarisList(prevList =>
          prevList.map(inventaris =>
            inventaris.id_inventaris === selectedInventaris.id_inventaris
              ? { ...inventaris, nama_barang: namaBarang, tgl_beli: tglBeli, harga: harga, ket: ket }
              : inventaris
          )
        );
        setShowModal(false);
        toast.success('Inventaris berhasil diperbarui!'); // Notifikasi sukses
      }
    } catch (err) {
      console.error('Error updating inventaris:', err);
      toast.error('Gagal memperbarui inventaris'); // Notifikasi gagal
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Inventaris</h5>
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
                    <label htmlFor="barang-name" className="col-form-label">
                      Nama Barang:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="barang-name"
                      value={namaBarang}
                      onChange={(e) => setNamaBarang(e.target.value)}
                      placeholder="Masukkan nama barang"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="tgl-beli" className="col-form-label">
                      Tanggal Beli:
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="tgl-beli"
                      value={tglBeli}
                      onChange={(e) => setTglBeli(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="harga" className="col-form-label">
                      Harga:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="harga"
                      value={harga}
                      onChange={(e) => setHarga(e.target.value)}
                      placeholder="Masukkan harga"
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

export default ModalUpdateInventaris;