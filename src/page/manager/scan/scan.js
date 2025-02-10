import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const ScanQR = () => {
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const scannerRef = useRef(null);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  useEffect(() => {
    // Initialize QR Scanner
    if (!scannerRef.current) {
      const qrScanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: 250,
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          rememberLastUsedCamera: true,
        },
        false
      );
      scannerRef.current = qrScanner;
    }

    // Function to handle successful scan
    const onScanSuccess = (decodedText) => {
      setScanResult(decodedText);
      setIsScanning(false);
      if (scannerRef.current) {
        scannerRef.current.clear();
      }

      if (isValidUrl(decodedText)) {
        window.location.href = decodedText; // Redirect to the URL scanned
      } else {
        // If not a valid URL, reset scanning state
        setTimeout(() => {
          setScanResult('');
          setIsScanning(true);
          if (scannerRef.current) {
            scannerRef.current.render(onScanSuccess, onScanError);
          }
        }, 3000);
      }
    };

    // Function to handle scanning errors
    const onScanError = (error) => {
      if (!error.includes('NotFound')) {
        console.error('QR Scan error:', error);
      }
    };

    // Start rendering the scanner
    if (scannerRef.current) {
      scannerRef.current.render(onScanSuccess, onScanError);
    }

    // Clean up scanner when component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">QR Code Scanner</h3>
        
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
        
        {scanResult && !isValidUrl(scanResult) && (
          <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">
            <p className="font-semibold">Scanned content is not a valid URL:</p>
            <p className="break-all">{scanResult}</p>
          </div>
        )}
        
        {!isScanning && (
          <p className="mt-2 text-gray-600">
            {isValidUrl(scanResult) 
              ? "Redirecting to scanned URL..." 
              : "Scanner will resume in a few seconds..."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ScanQR;
