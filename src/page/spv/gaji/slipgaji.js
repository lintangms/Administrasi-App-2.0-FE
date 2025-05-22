import { jsPDF } from 'jspdf';

const generateSlipGajiPDF = (gajiData) => {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  
  // Colors (RGB values)
  const primaryColor = [41, 128, 185]; // Blue
  const secondaryColor = [52, 73, 94]; // Dark Gray
  const accentColor = [39, 174, 96]; // Green
  const lightGray = [236, 240, 241];
  
  // Helper function to safely get numeric value
  const safeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    const safeAmount = safeNumber(amount);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(safeAmount);
  };

  // Helper function to format date
  const formatDate = (date) => {
    try {
      if (!date) return new Date().toLocaleDateString('id-ID');
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return new Date().toLocaleDateString('id-ID');
      return dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return new Date().toLocaleDateString('id-ID');
    }
  };

  // Safe text function to handle null/undefined values
  const safeText = (text) => {
    return text ? String(text) : '-';
  };

  // Page setup
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Header Background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Company Logo Area (placeholder)
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, 8, 24, 24, 'F');
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('LOGO', margin + 12, 22, { align: 'center' });

  // Company Info
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PT. NAMA PERUSAHAAN', margin + 35, 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Jl. Alamat Perusahaan No. 123, Kota, Provinsi 12345', margin + 35, 25);
  doc.text('Telp: (021) 1234-5678 | Email: info@perusahaan.com', margin + 35, 30);

  // Slip Gaji Title
  doc.setFillColor(...accentColor);
  doc.rect(0, 40, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SLIP GAJI KARYAWAN', pageWidth / 2, 50, { align: 'center' });

  // Employee Info Section
  let yPos = 70;
  
  // Employee Info Background
  doc.setFillColor(...lightGray);
  doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 35, 'F');
  
  // Employee Info Border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 35);

  doc.setTextColor(...secondaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMASI KARYAWAN', margin + 5, yPos + 2);

  // Employee details in two columns
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const leftCol = margin + 10;
  const rightCol = pageWidth / 2 + 20;

  // Left column
  doc.text('NIP', leftCol, yPos + 10);
  doc.text(`: ${safeText(gajiData.NIP)}`, leftCol + 30, yPos + 10);
  
  doc.text('Nama', leftCol, yPos + 16);
  doc.text(`: ${safeText(gajiData.nama)}`, leftCol + 30, yPos + 16);
  
  doc.text('Status', leftCol, yPos + 22);
  doc.text(': Karyawan', leftCol + 30, yPos + 22);

  // Right column
  doc.text('Periode', rightCol, yPos + 10);
  doc.text(`: ${formatDate(gajiData.tgl_transaksi)}`, rightCol + 30, yPos + 10);
  
  doc.text('Tanggal Cetak', rightCol, yPos + 16);
  doc.text(`: ${formatDate(new Date())}`, rightCol + 30, yPos + 16);

  // Manual Table Section
  yPos += 50;
  
  // Table header
  const tableX = margin;
  const tableWidth = pageWidth - (margin * 2);
  const colWidth = tableWidth / 4;
  const rowHeight = 8;
  
  // Table header background
  doc.setFillColor(...primaryColor);
  doc.rect(tableX, yPos, tableWidth, rowHeight, 'F');
  
  // Table header border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(tableX, yPos, tableWidth, rowHeight);
  
  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('KETERANGAN', tableX + 5, yPos + 5);
  doc.text('JUMLAH', tableX + colWidth + 5, yPos + 5);
  doc.text('', tableX + (colWidth * 2) + 5, yPos + 5);
  doc.text('TOTAL', tableX + (colWidth * 3) + 5, yPos + 5);
  
  yPos += rowHeight;
  
  // Calculate values safely
  const totalDijual = safeNumber(gajiData.total_dijual);
  const ratePerKoin = safeNumber(gajiData.rate_per_koin);
  const gajiKotor = safeNumber(gajiData.gaji_kotor);
  const potongan = safeNumber(gajiData.potongan);
  const kasbon = safeNumber(gajiData.kasbon);
  const thp = safeNumber(gajiData.THP);
  const totalUnsold = safeNumber(gajiData.total_unsold_koin);
  
  // Table data
  const tableData = [
    { label: 'PENDAPATAN', amount: '', total: '', isHeader: true },
    { label: 'Total Sold', amount: formatCurrency(totalDijual * ratePerKoin), total: '' },
    { label: 'Bonus/Insentif', amount: formatCurrency(0), total: '' },
    { label: '', amount: '', total: formatCurrency(gajiKotor), isSubtotal: true, subtotalLabel: 'Sub Total Pendapatan' },
    { label: '', amount: '', total: '', isEmpty: true },
    { label: 'POTONGAN', amount: '', total: '', isHeader: true },
    { label: 'Potongan Lain-lain', amount: formatCurrency(potongan), total: '' },
    { label: 'Kasbon/Pinjaman', amount: formatCurrency(kasbon), total: '' },
    { label: '', amount: '', total: formatCurrency(potongan + kasbon), isSubtotal: true, subtotalLabel: 'Sub Total Potongan' },
    { label: '', amount: '', total: '', isEmpty: true },
    { label: '', amount: '', total: formatCurrency(thp), isTotal: true, totalLabel: 'TOTAL TAKE HOME PAY' },
  ];
  
  // Draw table rows
  tableData.forEach((row, index) => {
    // Row background
    if (row.isSubtotal || row.isTotal) {
      if (row.isTotal) {
        doc.setFillColor(...accentColor);
      } else {
        doc.setFillColor(...lightGray);
      }
      doc.rect(tableX, yPos, tableWidth, rowHeight, 'F');
    } else if (index % 2 === 0) {
      doc.setFillColor(249, 249, 249);
      doc.rect(tableX, yPos, tableWidth, rowHeight, 'F');
    }
    
    // Row border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(tableX, yPos, tableWidth, rowHeight);
    
    // Text color and style
    if (row.isTotal) {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
    } else if (row.isSubtotal || row.isHeader) {
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
    }
    
    // Text content
    if (!row.isEmpty) {
      if (row.isSubtotal) {
        doc.text(safeText(row.subtotalLabel), tableX + (colWidth * 2) + 5, yPos + 5);
        doc.text(safeText(row.total), tableX + (colWidth * 3) + 5, yPos + 5);
      } else if (row.isTotal) {
        doc.text(safeText(row.totalLabel), tableX + (colWidth * 2) + 5, yPos + 5);
        doc.text(safeText(row.total), tableX + (colWidth * 3) + 5, yPos + 5);
      } else {
        doc.text(safeText(row.label), tableX + 5, yPos + 5);
        if (row.amount) doc.text(safeText(row.amount), tableX + colWidth + 5, yPos + 5);
        if (row.total) doc.text(safeText(row.total), tableX + (colWidth * 3) + 5, yPos + 5);
      }
    }
    
    yPos += rowHeight;
  });

  // Additional Info Section
  const finalY = yPos + 15;
  
  // Info box
  doc.setFillColor(...lightGray);
  doc.rect(margin, finalY, pageWidth - (margin * 2), 25, 'F');
  doc.setDrawColor(...primaryColor);
  doc.rect(margin, finalY, pageWidth - (margin * 2), 25);

  doc.setTextColor(...secondaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DETAIL PENJUALAN:', margin + 5, finalY + 8);

  doc.setFont('helvetica', 'normal');
  doc.text(`Total Koin Terjual: ${totalDijual} koin`, margin + 10, finalY + 14);
  doc.text(`Total Unsold: ${totalUnsold} koin`, margin + 10, finalY + 20);
  
  // Right side
  doc.text(`Rate per Koin: ${formatCurrency(ratePerKoin)}`, rightCol, finalY + 14);
  doc.text(`Keterangan: ${safeText(gajiData.ket)}`, rightCol, finalY + 20);

  // Signature Section
  const signY = finalY + 40;
  
  // Signature boxes
  const signBoxWidth = 70;
  const signBoxHeight = 40;
  const leftSignX = margin + 30;
  const rightSignX = pageWidth - margin - signBoxWidth - 30;

  // Left signature box
  doc.setDrawColor(...secondaryColor);
  doc.setLineWidth(0.3);
  doc.rect(leftSignX, signY, signBoxWidth, signBoxHeight);
  
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Karyawan', leftSignX + signBoxWidth/2, signY - 3, { align: 'center' });
  doc.text('(_________________)', leftSignX + signBoxWidth/2, signY + signBoxHeight + 6, { align: 'center' });

  // Right signature box
  doc.rect(rightSignX, signY, signBoxWidth, signBoxHeight);
  doc.text('HRD', rightSignX + signBoxWidth/2, signY - 3, { align: 'center' });
  doc.text('(_________________)', rightSignX + signBoxWidth/2, signY + signBoxHeight + 6, { align: 'center' });

  // Footer
  const footerY = pageHeight - 15;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Dokumen ini digenerate secara otomatis oleh sistem', margin, footerY + 5);
  doc.text(`Dicetak pada: ${formatDate(new Date())} | Halaman 1 dari 1`, pageWidth - margin, footerY + 5, { align: 'right' });

  // Save PDF
  const fileName = `Slip_Gaji_${safeText(gajiData.nama).replace(/\s+/g, '_')}_${new Date().getFullYear()}_${String(new Date().getMonth() + 1).padStart(2, '0')}.pdf`;
  doc.save(fileName);
};

export default generateSlipGajiPDF;