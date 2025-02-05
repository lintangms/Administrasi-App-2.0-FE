import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const ScanQR = () => {
  const [message, setMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [karyawanData, setKaryawanData] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const navigate = useNavigate();

  const addLog = (text) => {
    setLogs(prevLogs => {
      const newLogs = [`${new Date().toLocaleTimeString()} - ${text}`, ...prevLogs.slice(0, 9)];
      return newLogs;
    });
  };

  const fetchCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        setCameras(devices);
        setSelectedCamera(devices[0].id);
        addLog('Kamera ditemukan.');
      }
    } catch (err) {
      addLog('Gagal mendeteksi kamera.');
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  useEffect(() => {
    let qrCodeScanner;
    if (isScanning && selectedCamera) {
      qrCodeScanner = new Html5Qrcode("qr-reader");
      qrCodeScanner.start(
        { facingMode: { exact: selectedCamera } },
        { fps: 10, qrbox: 250 },
        onScanSuccess,
        onScanError
      ).catch(err => {
        addLog(`Error memulai scanner: ${err}`);
      });
    }

    return () => {
      if (qrCodeScanner) {
        qrCodeScanner.stop().then(() => {
          qrCodeScanner.clear();
          addLog('Scanner dihentikan dan dibersihkan.');
        });
      }
    };
  }, [isScanning, selectedCamera]);

  const onScanSuccess = async (decodedText) => {
    try {
      const cleanNIP = decodedText.replace(/\D/g, '');
      addLog(`QR Code terdeteksi: ${cleanNIP}`);
      setIsScanning(false);

      const url = `https://absensi.harvestdigital.id/api/absensi/scanqr/${cleanNIP}`;
      addLog(`Mencoba akses: ${url}`);

      const response = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
      addLog(`Status response: ${response.status}`);

      const data = await response.json();
      addLog(`Response data: ${JSON.stringify(data)}`);

      if (!response.ok) throw new Error(data.message || 'Terjadi kesalahan pada server');

      if (data && data.NIP && data.nama && data.id_jabatan) {
        setKaryawanData(data);
        setMessage(`NIP: ${data.NIP}, Nama: ${data.nama}, Jabatan: ${data.id_jabatan}`);
        alert(`NIP: ${data.NIP}, Nama: ${data.nama}, Jabatan: ${data.id_jabatan}`);

        localStorage.setItem("NIP", data.NIP);
        localStorage.setItem("nama", data.nama);
        localStorage.setItem("id_jabatan", data.id_jabatan);

        navigate('/scan_absensi');
      }
    } catch (error) {
      addLog(`Error: ${error.message}`);
      setMessage(`Error: ${error.message}`);
      alert(`Gagal mencatat absensi: ${error.message}`);
    }
  };

  const onScanError = (error) => {
    if (!error.includes('NotFound')) {
      addLog(`Scanner error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Scan QR Code Absensi</h3>

        <div className="mb-4">
          <label className="block mb-2">Pilih Kamera:</label>
          <select 
            className="p-2 border rounded mb-4" 
            value={selectedCamera} 
            onChange={(e) => setSelectedCamera(e.target.value)}
          >
            {cameras.map(camera => (
              <option key={camera.id} value={camera.id}>{camera.label || `Kamera ${camera.id}`}</option>
            ))}
          </select>
          <button 
            className={`p-2 rounded ${isScanning ? 'bg-red-500' : 'bg-green-500'} text-white`}
            onClick={() => setIsScanning(!isScanning)}
          >
            {isScanning ? 'Stop Scanning' : 'Start Scanning'}
          </button>
        </div>

        <div id="qr-reader" style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }} />

        {message && (
          <div className={`mt-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            <p className="font-semibold">{message}</p>
          </div>
        )}

        <div className="mt-4 p-2 bg-gray-100 rounded text-left">
          <p className="font-bold mb-2">Debug Log:</p>
          <div className="text-xs font-mono" style={{ maxHeight: '200px', overflow: 'auto' }}>
            {logs.map((log, index) => (
              <div key={index} className="border-b border-gray-200 py-1">
                {log}
              </div>
            ))}
          </div>
        </div>

        {karyawanData && (
          <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded">
            <p className="font-semibold">Data Karyawan:</p>
            <p>NIP: {karyawanData.NIP}</p>
            <p>Nama: {karyawanData.nama}</p>
            <p>Jabatan: {karyawanData.id_jabatan}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQR;
