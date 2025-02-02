import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader'; // Mengimpor QrReader dengan benar
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const ScanQR = () => {
  const [showModal, setShowModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [isScanning, setIsScanning] = useState(false); // State untuk mengontrol pemindaian

  // Handle QR scan result
  const handleScan = async (data) => {
    if (data) {
      try {
        const response = await axios.get(data); // URL dari QR code
        if (response.status === 201) {
          setNotificationMessage('Absensi Masuk berhasil dicatat!');
          setNotificationType('success');
        } else {
          setNotificationMessage('Gagal mencatat absensi.');
          setNotificationType('error');
        }
      } catch (error) {
        setNotificationMessage('Terjadi kesalahan pada server.');
        setNotificationType('error');
      }
      setShowModal(true);
      setIsScanning(false); // Stop scanning after a successful scan
    }
  };

  // Handle error scanning QR code
  const handleError = (err) => {
    setNotificationMessage('Gagal memindai QR Code.');
    setNotificationType('error');
    setShowModal(true);
  };

  // Close notification modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Start scanning
  const startScanning = () => {
    setIsScanning(true);
  };

  return (
    <div>
      <h2>Scan QR Code untuk Absensi</h2>
      <Button variant="primary" onClick={startScanning}>
        Mulai Scan QR Code
      </Button>

      {isScanning && (
        <div style={{ marginTop: '20px' }}>
          <QrReader
            delay={300}
            style={{ width: '100%' }}
            onScan={handleScan}
            onError={handleError}
          />
        </div>
      )}

      {/* Modal Notifikasi */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{notificationType === 'success' ? 'Sukses!' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{notificationMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
  
export default ScanQR;