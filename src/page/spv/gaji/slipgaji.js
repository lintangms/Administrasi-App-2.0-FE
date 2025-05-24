import { jsPDF } from 'jspdf';
import LogoHarvest from './LOGO_HARVEST.png'; // Ganti logo pakai import langsung dari file

const generateSlipGajiPDF = (gajiData) => {
  const doc = new jsPDF('portrait', 'mm', 'a4');
  
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

  // Helper function to format number with thousand separator
  const formatNumber = (number) => {
    const safeAmount = safeNumber(number);
    return new Intl.NumberFormat('id-ID').format(safeAmount);
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

  // Function to convert number to words (Indonesian)
  const numberToWords = (num) => {
    const ones = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
    const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];
    const teens = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];

    if (num === 0) return 'nol';
    
    const convertHundreds = (n) => {
      let result = '';
      if (n >= 100) {
        if (Math.floor(n / 100) === 1) {
          result += 'seratus ';
        } else {
          result += ones[Math.floor(n / 100)] + ' ratus ';
        }
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        n = 0;
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result.trim();
    };

    if (num >= 1000000000) {
      return convertHundreds(Math.floor(num / 1000000000)) + ' miliar ' + numberToWords(num % 1000000000);
    } else if (num >= 1000000) {
      return convertHundreds(Math.floor(num / 1000000)) + ' juta ' + numberToWords(num % 1000000);
    } else if (num >= 1000) {
      if (Math.floor(num / 1000) === 1) {
        return 'seribu ' + numberToWords(num % 1000);
      } else {
        return convertHundreds(Math.floor(num / 1000)) + ' ribu ' + numberToWords(num % 1000);
      }
    } else {
      return convertHundreds(num);
    }
  };

  // Function to draw logo from imported image
  const drawLogo = (x, y, width, height) => {
    const img = new Image();
    img.src = LogoHarvest;
    img.onload = () => {
      doc.addImage(img, 'PNG', x, y, width, height);
    };
  };

  // Call drawLogo with desired position and size
  drawLogo(10, 10, 30, 30); 

  // Page setup
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Get data values
  const soldKoin = safeNumber(gajiData.total_dijual);
  const unsoldKoin = safeNumber(gajiData.total_unsold_koin);
  const potonganPercent = safeNumber(gajiData.potongan);
  const kasbon = safeNumber(gajiData.kasbon);
  const rateTNL = safeNumber(gajiData.rata_rata_rate || gajiData.rate_tnl || 100);
  const thp = safeNumber(gajiData.THP);

  // Calculate Gaji Kotor
  const gajiKotorSold = soldKoin * rateTNL;
  const gajiKotorUnsold = unsoldKoin * rateTNL;
  const totalGajiKotor = gajiKotorSold + gajiKotorUnsold;

  const potonganAmount = totalGajiKotor * (potonganPercent / 100);
  const gajiSetelahPotongan = totalGajiKotor - potonganAmount; 

  // Final THP (after kasbon)
  const finalTHP = gajiSetelahPotongan - kasbon;

  // Colors
  const primaryColor = [41, 128, 185]; // Warna biru kop

  // Set default text color
  doc.setTextColor(0, 0, 0);

  // Header Background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Company Logo
  drawLogo(margin, 8, 24, 24); // Gambar logo

  // Company Header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PT. HARVEST GAME', margin + 35, 18);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('XJVX+9X, Buring, Kec. Kedungkandang, Kota Malang, Jawa Timur', margin + 35, 24);
  doc.text('Telp: (0341) 123-4567 | Email: info@harvestgame.com', margin + 35, 28);

  // Title Section
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(236, 240, 241);
  doc.rect(margin, 50, pageWidth - (margin * 2), 16, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SLIP GAJI KARYAWAN', pageWidth / 2, 60, { align: 'center' });

  // Period
  const currentDate = new Date();
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const period = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Periode: ${period}`, pageWidth / 2, 72, { align: 'center' });

  // Employee Information Section - FIXED POSITIONING
  let yPos = 82;
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 2, 2, 'F');
  
  // Border
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 2, 2, 'S');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('INFORMASI KARYAWAN', margin + 5, yPos + 7);

  yPos += 12;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  // Employee details in organized layout
  const leftCol = margin + 10;
  const rightCol = pageWidth / 2 + 10;

  // Left column
  doc.setFont('helvetica', 'bold');
  doc.text('Nama', leftCol, yPos);
  doc.text(':', leftCol + 22, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(safeText(gajiData.nama), leftCol + 26, yPos);

  // Right column
  doc.setFont('helvetica', 'bold');
  doc.text('Jabatan', rightCol, yPos);
  doc.text(':', rightCol + 22, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('Farmer', rightCol + 26, yPos);

  yPos += 6;
  // Left column
  doc.setFont('helvetica', 'bold');
  doc.text('NIP', leftCol, yPos);
  doc.text(':', leftCol + 22, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(safeText(gajiData.NIP), leftCol + 26, yPos);

  // Right column
  doc.setFont('helvetica', 'bold');
  doc.text('Status', rightCol, yPos);
  doc.text(':', rightCol + 22, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('Karyawan Lama', rightCol + 26, yPos);

  // Detail Penjualan Section - FIXED POSITIONING
  yPos += 18;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DETAIL PENJUALAN & PERHITUNGAN GAJI', pageWidth / 2, yPos + 7, { align: 'center' });

  yPos += 16;
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(252, 252, 252);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 45, 'F');
  
  // Border
  doc.setDrawColor(189, 195, 199);
  doc.setLineWidth(0.3);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 45, 'S');

  yPos += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  // Data Penjualan
  const detailLeftCol = margin + 8;
  const detailRightCol = pageWidth / 2 + 8;

  doc.text('SOLD KOIN', detailLeftCol, yPos);
  doc.text('=', detailLeftCol + 35, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formatNumber(soldKoin)} koin`, detailLeftCol + 38, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('RATA-RATA RATE TNL', detailRightCol, yPos);
  doc.text('=', detailRightCol + 45, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(rateTNL), detailRightCol + 48, yPos);

  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('UNSOLD KOIN', detailLeftCol, yPos);
  doc.text('=', detailLeftCol + 35, yPos);
  doc.setFont('helvetica', 'normal');
  if (unsoldKoin > 0) {
    doc.text(`${formatNumber(unsoldKoin)} koin`, detailLeftCol + 38, yPos);
  } else {
    doc.setTextColor(127, 140, 141);
    doc.text('Tidak ada', detailLeftCol + 38, yPos);
    doc.setTextColor(0, 0, 0);
  }

  doc.setFont('helvetica', 'bold');
  doc.text('POTONGAN', detailRightCol, yPos);
  doc.text('=', detailRightCol + 45, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${potonganPercent}%`, detailRightCol + 48, yPos);

  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('KASBON', detailLeftCol, yPos);
  doc.text('=', detailLeftCol + 35, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(kasbon), detailLeftCol + 38, yPos);

  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL KOIN', detailLeftCol, yPos);
  doc.text('=', detailLeftCol + 35, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formatNumber(soldKoin + unsoldKoin)} koin`, detailLeftCol + 38, yPos);

  // Perhitungan Section - FIXED POSITIONING AND HEIGHT
  yPos += 18;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PERHITUNGAN GAJI', pageWidth / 2, yPos + 7, { align: 'center' });

  yPos += 16;
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  // FIXED HEIGHT TO PREVENT OVERFLOW
  doc.rect(margin, yPos, pageWidth - (margin * 2), 70, 'FD');

  yPos += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  // Step 1: Gaji Kotor Calculation
  doc.text('1. PERHITUNGAN GAJI KOTOR:', margin + 5, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`   • Sold Koin: ${formatNumber(soldKoin)} × ${formatCurrency(rateTNL)} = ${formatCurrency(gajiKotorSold)}`, margin + 8, yPos);
  
  if (unsoldKoin > 0) {
    yPos += 5;
    doc.text(`   • Unsold Koin: ${formatNumber(unsoldKoin)} × ${formatCurrency(rateTNL)} = ${formatCurrency(gajiKotorUnsold)}`, margin + 8, yPos);
  }
  
  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(230, 230, 230);
  doc.rect(margin + 5, yPos - 3, pageWidth - (margin * 2) - 10, 7, 'F');
  doc.text(`   TOTAL GAJI KOTOR = ${formatCurrency(totalGajiKotor)}`, margin + 8, yPos);

  // Step 2: After Potongan
  yPos += 12;
  doc.setFillColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('2. SETELAH POTONGAN:', margin + 5, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`   ${formatCurrency(totalGajiKotor)} × ${potonganPercent}% = ${formatCurrency(potonganAmount)}`, margin + 8, yPos);
  yPos += 5;
  doc.text(`   ${formatCurrency(totalGajiKotor)} - ${formatCurrency(potonganAmount)} = ${formatCurrency(gajiSetelahPotongan)}`, margin + 8, yPos);

  // Step 3: Final THP
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('3. TAKE HOME PAY (THP):', margin + 5, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`   ${formatCurrency(gajiSetelahPotongan)} - ${formatCurrency(kasbon)} (Kasbon) = ${formatCurrency(finalTHP)}`, margin + 8, yPos);

  // Final THP Highlight - FIXED POSITIONING
  yPos += 20;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, yPos - 4, pageWidth - (margin * 2), 16, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`GAJI BERSIH (THP): ${formatCurrency(thp)}`, pageWidth / 2, yPos + 5, { align: 'center' });

  // Terbilang - FIXED POSITIONING
  yPos += 22;
  doc.setTextColor(0, 0, 0);
  const terbilangText = numberToWords(thp).trim() + ' rupiah';
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(margin + 10, yPos - 3, pageWidth - (margin * 2) - 20, 10, 2, 2, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text(`Terbilang: "${terbilangText}"`, pageWidth / 2, yPos + 2, { align: 'center' });

  // Additional Information - FIXED POSITIONING
  yPos += 18;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 18, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMASI TAMBAHAN:', margin + 5, yPos + 6);
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tanggal Transaksi: ${formatDate(gajiData.tgl_transaksi)}`, margin + 5, yPos + 11);
  doc.text(`Keterangan: ${safeText(gajiData.ket)}`, margin + 5, yPos + 15);

  // Signature section - ADJUSTED POSITIONING
  yPos += 30;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Malang, ${formatDate(new Date())}`, pageWidth - margin - 50, yPos);

  // Signature boxes - simple blue border
  const signBoxWidth = 60;
  const signBoxHeight = 30;
  const leftSignX = margin + 15;
  const rightSignX = pageWidth - margin - signBoxWidth - 15;

  // Employee signature
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(leftSignX, yPos + 5, signBoxWidth, signBoxHeight, 3, 3, 'F');
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(leftSignX, yPos + 5, signBoxWidth, signBoxHeight, 3, 3, 'S');
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Karyawan', leftSignX + signBoxWidth/2, yPos + 2, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('(_____________________)', leftSignX + signBoxWidth/2, yPos + signBoxHeight + 6, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(safeText(gajiData.nama), leftSignX + signBoxWidth/2, yPos + signBoxHeight + 11, { align: 'center' });

  // Manager signature
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(rightSignX, yPos + 5, signBoxWidth, signBoxHeight, 3, 3, 'F');
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(rightSignX, yPos + 5, signBoxWidth, signBoxHeight, 3, 3, 'S');
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Manager', rightSignX + signBoxWidth/2, yPos + 2, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('(_____________________)', rightSignX + signBoxWidth/2, yPos + signBoxHeight + 6, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Syamsul Arifin', rightSignX + signBoxWidth/2, yPos + signBoxHeight + 11, { align: 'center' });

  // Footer - POSITIONED AT BOTTOM
  const footerY = pageHeight - 12;
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  
  doc.setFontSize(7);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'italic');
  doc.text('Dokumen ini digenerate secara otomatis oleh sistem PT. Harvest Game', margin, footerY + 3);
  doc.text(`Dicetak pada: ${formatDate(new Date())} | Halaman 1 dari 1`, pageWidth - margin, footerY + 3, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('* Slip gaji ini adalah dokumen resmi perusahaan *', pageWidth / 2, footerY + 7, { align: 'center' });

  // Save PDF with improved filename
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const currentYear = new Date().getFullYear();
  const cleanName = safeText(gajiData.nama).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  const fileName = `Slip_Gaji_${cleanName}_${currentYear}_${currentMonth}_PT_Harvest_Game.pdf`;
  
  doc.save(fileName);
};

export default generateSlipGajiPDF;