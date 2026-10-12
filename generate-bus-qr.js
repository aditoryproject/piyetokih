const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://piyetokihfilm.com';
const OUTPUT_DIR = path.join(__dirname, 'public', 'qr-bus-branding');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateQRCodes() {
  console.log('🎬 Memulai pembuatan QR Code Resolusi Ultra Tinggi untuk Branding Bus...');
  console.log('Target URL:', TARGET_URL);

  // 1. GENERATE VECTOR SVG - CLEAN (INFINITE RESOLUTION / LOSSLESS UNTUK PERCETAKAN BUS)
  // Error correction 'H' (High) = 30% redundancy, sangat tahan banting di outdoor
  const svgCleanPath = path.join(OUTPUT_DIR, 'QR_PIYETOKIH_VECTOR_CLEAN.svg');
  await QRCode.toFile(svgCleanPath, TARGET_URL, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
  console.log('✅ [1/4] SVG Vector Clean berhasil dibuat:', svgCleanPath);

  // 2. GENERATE VECTOR SVG DENGAN BRANDING FRAME MIRACLE PICTURES
  // Siap cetak baliho/stiker bus dengan frame, header, dan Call-To-Action (CTA)
  const qrSvgRaw = await QRCode.toString(TARGET_URL, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 1,
    color: {
      dark: '#0A0E17',
      light: '#FFFFFF',
    },
  });

  // Hapus xml header jika ada untuk di-embed dalam composite SVG
  const cleanRawSvg = qrSvgRaw.replace(/<\?xml.*?\?>/, '').replace(/<!DOCTYPE.*?>/, '');

  const brandedSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="1200" height="1600">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090D16" />
      <stop offset="50%" stop-color="#121826" />
      <stop offset="100%" stop-color="#05070B" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="25" stdDeviation="35" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Poster Card -->
  <rect width="1200" height="1600" rx="40" fill="url(#bgGrad)" />
  <rect x="25" y="25" width="1150" height="1550" rx="30" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-opacity="0.4" />

  <!-- Film Header Branding -->
  <g transform="translate(600, 150)" text-anchor="middle">
    <!-- Badge -->
    <rect x="-190" y="-35" width="380" height="50" rx="25" fill="#F59E0B" fill-opacity="0.15" stroke="#F59E0B" stroke-width="2"/>
    <text x="0" y="-3" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="20" fill="#FBBF24" letter-spacing="4">
      FILM BIOSKOP NASIONAL
    </text>

    <!-- Main Title -->
    <text x="0" y="85" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="76" fill="#FFFFFF" letter-spacing="2">
      PIYE TO KIH?
    </text>
    <text x="0" y="130" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="24" fill="#F59E0B" letter-spacing="8">
      MIRACLE PICTURES
    </text>
  </g>

  <!-- QR Code White Card Container -->
  <g transform="translate(175, 420)" filter="url(#cardShadow)">
    <rect width="850" height="850" rx="36" fill="#FFFFFF" />
    <rect x="15" y="15" width="820" height="820" rx="28" fill="none" stroke="#E2E8F0" stroke-width="3" />
    
    <!-- Embedded QR Vector -->
    <g transform="translate(35, 35)">
      <svg width="780" height="780" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        ${cleanRawSvg.substring(cleanRawSvg.indexOf('<svg'))}
      </svg>
    </g>
  </g>

  <!-- Call to Action Banner -->
  <g transform="translate(600, 1370)" text-anchor="middle">
    <rect x="-420" y="-45" width="840" height="90" rx="24" fill="url(#goldGrad)" />
    <text x="0" y="12" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="34" fill="#0A0E17" letter-spacing="1">
      SCAN UNTUK KLAIM TIKET &amp; INFO ROADSHOW
    </text>
    
    <!-- Website URL text -->
    <text x="0" y="95" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="28" fill="#94A3B8" letter-spacing="3">
      piyetokihfilm.com
    </text>
    <text x="0" y="135" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="20" fill="#64748B">
      Tayang Serentak di Bioskop Seluruh Indonesia • 17 Kota Roadshow
    </text>
  </g>
</svg>`;

  const svgBrandedPath = path.join(OUTPUT_DIR, 'QR_PIYETOKIH_BUS_BRANDING_FRAME.svg');
  fs.writeFileSync(svgBrandedPath, brandedSvg, 'utf-8');
  console.log('✅ [2/4] SVG Vector Bus Branding Frame berhasil dibuat:', svgBrandedPath);

  // 3. GENERATE ULTRA HIGH RESOLUTION PNG (4096 x 4096 px / 4K UHD)
  const png4kPath = path.join(OUTPUT_DIR, 'QR_PIYETOKIH_ULTRA_4K_4096px.png');
  await QRCode.toFile(png4kPath, TARGET_URL, {
    type: 'png',
    width: 4096,
    errorCorrectionLevel: 'H',
    margin: 3,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
  console.log('✅ [3/4] PNG Ultra HD 4096px (4K) berhasil dibuat:', png4kPath);

  // 4. GENERATE SUPER ULTRA RESOLUTION PNG (8192 x 8192 px / 8K GIANT PRINT)
  const png8kPath = path.join(OUTPUT_DIR, 'QR_PIYETOKIH_GIANT_8K_8192px.png');
  await QRCode.toFile(png8kPath, TARGET_URL, {
    type: 'png',
    width: 8192,
    errorCorrectionLevel: 'H',
    margin: 3,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
  console.log('✅ [4/4] PNG Giant 8192px (8K) berhasil dibuat:', png8kPath);

  console.log('\n🎉 SEMUA FORMAT QR RESOLUSI TERTINGGI SELESAI DICIPTAKAN!');
}

generateQRCodes().catch(console.error);
