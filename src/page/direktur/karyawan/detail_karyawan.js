import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { FaUser , FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaGraduationCap, FaCoins, FaInfoCircle, FaLock, FaBuilding } from "react-icons/fa";

const DetailKaryawan = () => {
    const { nip } = useParams();
    const location = useLocation();
    const [karyawan, setKaryawan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    // Get NIP either from URL params or location state
    const karyawanNIP = nip || (location.state && location.state.karyawanNIP);

    useEffect(() => {
        const fetchKaryawanDetail = async () => {
            if (!karyawanNIP) {
                setError("NIP Karyawan tidak ditemukan");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${BACKEND_URL}/api/karyawan/NIP/${encodeURIComponent(karyawanNIP)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (response.data) {
                    setKaryawan(response.data);
                } else {
                    setError("Data karyawan tidak ditemukan");
                }
            } catch (err) {
                console.error("Error fetching karyawan detail:", err);
                setError("Gagal mengambil detail karyawan");
            } finally {
                setLoading(false);
            }
        };

        fetchKaryawanDetail();
    }, [karyawanNIP, token, BACKEND_URL]);

    if (loading) return <p className="text-center mt-4">Loading...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;
    if (!karyawan) return <p className="text-center">Data karyawan tidak ditemukan</p>;

    return (
        <div className="container mt-4">
            <div className="card shadow-lg p-4 rounded">
                <div className="row">
                    <div className="col-md-4 text-center">
                        <div className="profile-card">
                            <img
                                src={karyawan.gambar
                                    ? (karyawan.gambar.startsWith("http")
                                        ? karyawan.gambar
                                        : `${BACKEND_URL}/uploads/${karyawan.gambar}`)
                                    : "/img/avatars/default-avatar.png"}
                                alt={karyawan.nama}
                                className="profile-image rounded-circle shadow"
                            />

                            <h3 className="mt-3">{karyawan.nama}</h3>
                            <span className="badge bg-primary px-3 py-2">{karyawan.nama_jabatan}</span>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="card border-0">
                            <div className="card-body">
                                <h4 className="mb-3">Detail Karyawan</h4>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <FaUser  className="text-primary me-2" /> <strong>NIP:</strong> {karyawan.NIP}
                                    </li>
                                    <li className="list-group-item">
                                        <FaMapMarkerAlt className="text-primary me-2" /> <strong>Alamat:</strong> {karyawan.alamat}
                                    </li>
                                    <li className="list-group-item">
                                        <FaBuilding className="text-secondary me-2" /> <strong>Divisi:</strong> {karyawan.nama_divisi || "Tidak ada"}
                                    </li>
                                    <li className="list-group-item">
                                        <FaPhone className="text-success me-2" /> <strong>Telepon:</strong> {karyawan.telp}
                                    </li>
                                    <li className="list-group-item">
                                        <FaCalendarAlt className="text-warning me-2" /> <strong>Tanggal Lahir:</strong> {new Date(karyawan.ttl).toLocaleDateString()}
                                    </li>
                                    <li className="list-group-item">
                                        <FaCalendarAlt className="text-danger me-2" /> <strong>Mulai Bekerja:</strong> {new Date(karyawan.mulai_bekerja).toLocaleDateString()}
                                    </li>
                                    <li className="list-group-item">
                                        <FaCoins className="text-warning me-2" /> <strong>Total Koin:</strong> <span className="badge bg-success">{karyawan.koin_terakhir || 0}</span>
                                    </li>
                                    <li className="list-group-item">
                                        <FaGraduationCap className="text-info me-2" /> <strong>Pendidikan:</strong> {karyawan.pendidikan}
                                    </li>
                                    <li className="list-group-item">
                                        <FaInfoCircle className="text-secondary me-2" /> <strong>Keterangan:</strong> {karyawan.ket || "Tidak ada"}
                                    </li>
                                    <li className="list-group-item">
                                        <FaUser  className="text-dark me-2" /> <strong>Username:</strong> {karyawan.username}
                                    </li>
                                    <li className="list-group-item">
                                        <FaLock className="text-danger me-2" /> <strong>Password:</strong> {karyawan.password}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Status:</strong> {karyawan.status}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Nama Jabatan:</strong> {karyawan.nama_jabatan}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Nama Game:</strong> {karyawan.nama_game || "Tidak ada"}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Nama Shift:</strong> {karyawan.nama_shift || "Tidak ada"}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .profile-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .profile-image {
                    width: 140px;
                    height: 140px;
                    object-fit: cover;
                    border: 4px solid #ddd;
                    transition: transform 0.3s ease-in-out;
                }
                .profile-image:hover {
                    transform: scale(1.05);
                }
                .list-group-item {
                    font-size: 16px;
                    padding: 12px 16px;
                    border-left: 4px solid #007bff;
                }
                .badge {
                    font-size: 14px;
                }
                .card {
                    background: #ffffff;
                    border-radius: 10px;
                }
                .card-body {
                    padding: 1.5rem;
                }
                h3, h4 {
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default DetailKaryawan;