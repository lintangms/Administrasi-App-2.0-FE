import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { FaInfoCircle } from 'react-icons/fa';

const RekapAbsensi = () => {
  const [rekapList, setRekapList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    nama: '',
    nama_shift: '',
    startDate: '',
    endDate: '',
  });
  const [shifts, setShifts] = useState([]);

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const fetchRekapAbsensi = async () => {
    setLoading(true);
    try {
      const params = {
        ...(filter.nama && { nama: filter.nama }),
        ...(filter.nama_shift && { nama_shift: filter.nama_shift }),
        ...(filter.startDate && { startDate: filter.startDate }),
        ...(filter.endDate && { endDate: filter.endDate }),
      };

      const response = await axios.get(`${BACKEND_URL}/api/absen/rekapabsen`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setRekapList(response.data.data || []);
    } catch (err) {
      console.error('Error saat mengambil data rekap absensi:', err);
      setError('Tidak ada data rekap absensi');
      toast.error('Gagal memuat data rekap absensi');
    } finally {
      setLoading(false);
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/shift/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShifts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching shifts:', err);
      toast.error('Gagal memuat data shift');
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error('Silakan login kembali');
      navigate('/login');
      return;
    }
    fetchRekapAbsensi();
    fetchShifts();
  }, [token, navigate, filter]);

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const handleViewDetails = (NIP) => {
    navigate(`/manager/detail_absensi/${NIP}`); // Navigate to the details page with the selected NIP
  };

  return (
    <div className="rekap-absensi-container">
      {error && <p className="error-message">{error}</p>}

      <div className="card my-4">
        <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
          <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
            <h6 className="text-white text-capitalize ps-3">Rekap Absensi</h6>
          </div>
        </div>
        <div className="card-body px-0 pb-2">
          <div className="filter-form mb-4 px-3 py-2 bg-light">
            <div className="row">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  name="nama"
                  placeholder="Cari Nama"
                  value={filter.nama}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-control"
                  name="nama_shift"
                  value={filter.nama_shift}
                  onChange={handleFilterChange}
                >
                  <option value="">Pilih Shift</option>
                  {shifts.map((shift) => (
                    <option key={shift.id_shift} value={shift.nama_shift}>
                      {shift.nama_shift}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  placeholder={filter.startDate ? '' : 'Pilih Tanggal Mulai'}
                  value={filter.startDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  placeholder={filter.endDate ? '' : 'Pilih Tanggal Akhir'}
                  value={filter.endDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-responsive p-0">
              <table className="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>NIP</th>
                    <th>Nama</th>
                    <th>Nama Shift</th>
                    <th>Total Hadir</th>
                    <th>Total Izin</th>
                    <th>Total Tidak Masuk</th>
                    <th>Total Belum Absen</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {rekapList.length > 0 ? (
                    rekapList.map((rekap, index) => (
                      <tr key={rekap.NIP}>
                        <td>{index + 1}</td>
                        <td>{rekap.NIP}</td>
                        <td>{rekap.nama}</td>
                        <td>{rekap.nama_shift}</td>
                        <td>{rekap.total_hadir}</td>
                        <td>{rekap.total_izin}</td>
                        <td>{rekap.total_tidak_masuk}</td>
                        <td>{rekap.total_belum_absen}</td>
                        <td>
                          <button 
                            className="btn btn-primary btn-sm rounded" 
                            onClick={() => handleViewDetails(rekap.NIP)} // Mengambil NIP dari rekap yang diklik
                          >
                            <FaInfoCircle />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">Tidak ada data rekap absensi tersedia</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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

        .filter-form { 
          background-color: #f8f9fa; 
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
};

export default RekapAbsensi;