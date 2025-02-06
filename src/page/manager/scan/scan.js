import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom'; // Ganti useHistory dengan useNavigate

const ScanQR = () => {
  const [message, setMessage] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [logs, setLogs] = useState([]);
  const [karyawanData, setKaryawanData] = useState(null); // Menyimpan data karyawan
  const [absensiStatus, setAbsensiStatus] = useState(''); // Menyimpan status absensi
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const addLog = (text) => {
    setLogs(prevLogs => {
      const newLogs = [`${new Date().toLocaleTimeString()} - ${text}`, ...prevLogs.slice(0, 9)];
      return newLogs;
    });
  };

  useEffect(() => {
    addLog('Scanner diinisialisasi');
    
    const qrCodeScanner = new Html5QrcodeScanner(
      "qr-reader", 
      {
        fps: 10,
        qrbox: 250,
        aspectRatio: 1.0
      },
      true
    );

    async function onScanSuccess(decodedText) {
      try {
        // Hapus karakter non-numerik jika ada
        const cleanNIP = decodedText.replace(/\D/g, '');
        addLog(`QR Code terdeteksi: ${cleanNIP}`);
        
        setIsScanning(false);
        qrCodeScanner.pause();  // Pause scanner sementara

        // Gunakan endpoint untuk mengambil data karyawan
        const url = `https://absensi.harvestdigital.id/api/absensi/scanqr/${cleanNIP}`;
        addLog(`Mencoba akses: ${url}`);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          },
        });

        addLog(`Status response: ${response.status}`);

        const data = await response.json();
        addLog(`Response data: ${JSON.stringify(data)}`);

        if (!response.ok) {
          throw new Error(data.message || 'Terjadi kesalahan pada server');
        }

        if (data && data.NIP && data.nama && data.id_jabatan) {
          setKaryawanData(data); // Simpan data karyawan
          setMessage(`NIP: ${data.NIP}, Nama: ${data.nama}, Jabatan: ${data.id_jabatan}`);
          alert(`NIP: ${data.NIP}, Nama: ${data.nama}, Jabatan: ${data.id_jabatan}`);

          // Simpan NIP, nama, dan id_jabatan di localStorage
          localStorage.setItem("NIP", data.NIP);
          localStorage.setItem("nama", data.nama);
          localStorage.setItem("id_jabatan", data.id_jabatan);

          // Jika id_absensi ada, artinya absensi dapat diupdate, jika tidak, absensi sudah selesai
          if (data.id_absensi) {
            setAbsensiStatus('Absensi belum selesai, jam pulang belum tercatat.');
            // Arahkan ke halaman AbsensiScan
            navigate('/scan_absensi'); // Ganti dengan path yang sesuai
          } else {
            setAbsensiStatus('Absensi sudah selesai, jam pulang sudah tercatat.');
          }

          // Berhentikan scanner saat pindah halaman
          qrCodeScanner.stop();
          addLog('Scanner dihentikan setelah pindah halaman.');
        }

      } catch (error) {
        addLog(`Error: ${error.message}`);
        
        let errorMessage = error.message;
        if (error.name === 'TypeError') {
          errorMessage = 'Gagal terhubung ke server. Periksa koneksi internet Anda.';
        }
        
        setMessage(`Error: ${errorMessage}`);
        alert(`Gagal mencatat absensi: ${errorMessage}`);
      } finally {
        setTimeout(() => {
          setIsScanning(true);
          qrCodeScanner.resume();
          addLog('Scanner dilanjutkan');
        }, 3000);
      }
    }

    function onScanError(error) {
      // Hanya log error yang bukan "NotFound" untuk mengurangi spam log
      if (!error.includes('NotFound')) {
        addLog(`Scanner error: ${error}`);
      }
    }

    qrCodeScanner.render(onScanSuccess, onScanError);

    // Cleanup function to stop and clear the scanner properly
    return () => {
      addLog('Scanner dibersihkan');
      qrCodeScanner.clear();  // Attempt to clear the scanner first
      // Attempting to stop if 'stop' method is available
      if (qrCodeScanner.stop) {
        qrCodeScanner.stop().catch((error) => {
          addLog(`Error during cleanup: ${error.message}`);
        });
      }
    };
  }, [navigate]);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Scan QR Code Absensi</h3>
        <div 
          id="qr-reader" 
          style={{ 
            width: "100%", 
            maxWidth: "500px", 
            margin: "0 auto",
            border: "2px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden"
          }}
        />
        
        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            <p className="font-semibold">{message}</p>
          </div>
        )}
        
        {!isScanning && (
          <p className="mt-2 text-gray-600">
            Memproses... Scanner akan aktif kembali dalam beberapa detik.
          </p>
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
            <p>Status Absensi: {absensiStatus}</p>
          </div>
        )}
      </div>
    </div>
  );  
};

export default ScanQR;
