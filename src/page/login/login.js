import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../app.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast } from "react-toastify"; // Import toast dari react-toastify

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Ambil URL dari .env

  useEffect(() => {
    const token = localStorage.getItem("token");
    const jabatan = localStorage.getItem("jabatan");
    if (token && jabatan) {
      navigate(`/${jabatan}/dashboard`);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data;
        const { jabatan, NIP, id_jabatan } = user; // Ambil jabatan, NIP, dan id_jabatan dari data user

        // Simpan token, jabatan, NIP, dan id_jabatan ke localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("jabatan", jabatan);
        localStorage.setItem("NIP", NIP); // Simpan NIP ke localStorage
        localStorage.setItem("id_jabatan", id_jabatan); // Simpan id_jabatan ke localStorage

        // Tampilkan notifikasi sukses login
        toast.success(`Login berhasil sebagai ${jabatan}!`);

        // Navigasi ke dashboard sesuai jabatan
        setTimeout(() => {
          onLoginSuccess(jabatan);
          navigate(`/${jabatan}/dashboard`);
        }, 2000);
      } else {
        toast.error(data.message || "Login gagal. Periksa kembali data Anda!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="d-flex w-100" style={{ justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="container d-flex flex-column">
        <div className="row">
          <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto">
            <div className="text-center mt-4">
              <h1 className="h2">Welcome back!</h1>
              <p className="lead">Sign in to your account to continue</p>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="m-sm-3">
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        name="username"
                        placeholder="Enter your email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        className="form-control form-control-lg"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                      <button
                        type="submit"
                        className="btn btn-lg btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Sign in"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="text-center mt-3">
              Don't have an account? <a href="/register">Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;