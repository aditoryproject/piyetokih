'use client';

import React, { useRef, useState } from 'react';
import { Download, Share2, CheckCircle2, Film, MapPin, Building2 } from 'lucide-react';
import { getCityByNameOrSlug } from '@/lib/cities';

interface VoucherTicketCardProps {
  serialNumber: string;
  name: string;
  phone: string;
  cityLocation?: string;
  venueLocation?: string;
  claimedAt?: string;
  validityText?: string;
  onClose?: () => void;
}

export default function VoucherTicketCard({
  serialNumber,
  name,
  phone,
  cityLocation,
  venueLocation,
  claimedAt = new Date().toLocaleDateString('id-ID'),
  validityText = '19 - 20 November 2026 (Penayangan Perdana)',
  onClose,
}: VoucherTicketCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadPdf = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0B0F17',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 180], // customized ticket dimension
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 100, 180);
      pdf.save(`Voucher-PiyeToKih-${serialNumber}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF ticket:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  // Auto trigger download if URL contains ?download=1
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      if (search && (search.includes('download=1') || search.includes('download=true'))) {
        const timer = setTimeout(() => {
          handleDownloadPdf();
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const cityData = getCityByNameOrSlug(cityLocation);
  const cityVenues = cityData?.cinemas?.map(c => c.name) || [];
  const displayVenue = venueLocation || (cityVenues.length === 1 ? cityVenues[0] : null);

  const handleShare = () => {
    const shareUrl = (typeof window !== 'undefined' && !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1'))
      ? `${window.location.origin}/voucher/${serialNumber}`
      : `https://piyetokihfilm.com/voucher/${serialNumber}`;

    if (navigator.share) {
      navigator.share({
        title: 'Voucher Resmi Film Piye To Kih',
        text: `Klaim voucher nonton film Piye To Kih kode: ${serialNumber}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md mx-auto">
      {/* TICKET CONTAINER */}
      <div
        ref={cardRef}
        className="w-full bg-gradient-to-b from-[#181D29] via-[#0E131E] to-[#0A0D14] border-2 border-gold-500/40 rounded-3xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center border-b border-white/10 pb-3 mb-3 relative z-10">
          <div className="flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] tracking-widest text-gold-400 font-bold uppercase mb-0.5">
            <Film className="w-3.5 h-3.5 text-gold-400" />
            <span>MIRACLE PICTURES PRESENTS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
            PIYE TO KIH?
          </h2>
          <p className="text-[10px] sm:text-[11px] text-amber-300 font-extrabold tracking-wide uppercase">
            OFFICIAL KODE BOOKING
          </p>
        </div>

        {/* PENUKARAN ROADSHOW & MEET AND GREET BADGE */}
        <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-2.5 sm:p-3 text-center mb-3 relative z-10">
          <div className="text-[8.5px] sm:text-[9px] uppercase font-extrabold text-amber-400 tracking-wider">
            PENUKARAN VOUCHER FISIK RESMI
          </div>
          <div className="text-xs sm:text-sm md:text-base font-black text-amber-300 tracking-tight leading-snug my-0.5">
            ROADSHOW &amp; MEET AND GREET {cityLocation ? `KOTA ${cityLocation.toUpperCase()}` : 'DI KOTAMU'}
          </div>
          <div className="text-[9px] sm:text-[10px] text-red-300 font-extrabold mt-0.5">
            ⚠️ Kode booking ini BUKAN tiket dan BUKAN bukti pembayaran
          </div>
          <div className="text-[8.5px] sm:text-[9.5px] text-gray-300 mt-0.5 leading-tight">
            Tunjukkan kode booking ini di booth resmi roadshow untuk melakukan pembayaran dan mengambil Voucher Fisik resmi.
          </div>

          {/* LOKASI MALL & BIOSKOP PENUKARAN */}
          {(displayVenue || cityVenues.length > 0) && (
            <div className="mt-2 pt-2 border-t border-amber-500/30 text-left bg-black/40 rounded-xl p-2 sm:p-2.5">
              <div className="flex items-center gap-1.5 text-[8.5px] sm:text-[9px] font-black uppercase text-amber-400 tracking-wider mb-1">
                <Building2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>LOKASI PENUKARAN (MALL &amp; BIOSKOP):</span>
              </div>
              {displayVenue ? (
                <div className="text-white font-extrabold text-[10.5px] sm:text-[11px] leading-tight flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{displayVenue}</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {cityVenues.map((v, i) => (
                    <div key={i} className="text-white font-extrabold text-[10px] sm:text-[10.5px] leading-tight flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Attendee Info */}
        <div className="space-y-2 mb-3 relative z-10">
          <div className="bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 sm:py-2.5">
            <span className="block text-[8.5px] sm:text-[9.5px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
              NAMA PENERIMA VOUCHER
            </span>
            <span className="text-sm sm:text-base font-black text-white block leading-normal break-words">
              {name || 'Penonton Setia'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-black/50 border border-white/10 rounded-xl px-3 py-2">
              <span className="block text-[8px] sm:text-[8.5px] uppercase font-bold text-gray-400 mb-0.5">
                KOTA ROADSHOW
              </span>
              <span className="font-bold text-gold-400 text-xs sm:text-sm block leading-normal break-words">
                {cityLocation || 'Nasional'}
              </span>
            </div>
            <div className="bg-black/50 border border-white/10 rounded-xl px-3 py-2">
              <span className="block text-[8px] sm:text-[8.5px] uppercase font-bold text-gray-400 mb-0.5">
                TANGGAL KLAIM
              </span>
              <span className="font-semibold text-gray-200 text-xs sm:text-sm block leading-normal break-words">
                {claimedAt}
              </span>
            </div>
          </div>
        </div>

        {/* OFFICIAL DIGITAL STAMP EFFECT */}
        <div className="absolute right-2 sm:right-3 top-24 sm:top-28 transform rotate-[-12deg] pointer-events-none select-none z-10 opacity-70 sm:opacity-80">
          <div className="w-18 h-18 sm:w-22 sm:h-22 border-2 sm:border-3 border-dashed border-red-500/85 rounded-full flex flex-col items-center justify-center p-1 text-center shadow-lg bg-red-950/10">
            <span className="text-[6.5px] sm:text-[7.5px] font-black tracking-widest text-red-400 uppercase">
              ★ OFFICIAL ★
            </span>
            <span className="text-[8.5px] sm:text-[10px] font-black text-red-500 uppercase leading-none my-0.5 tracking-tighter">
              VERIFIED
            </span>
            <span className="text-[5.5px] sm:text-[6.5px] font-bold text-red-400 uppercase tracking-widest">
              MIRACLE PICTURES
            </span>
            <div className="w-8 sm:w-10 h-0.5 bg-red-500/70 my-0.5" />
            <span className="text-[5.5px] sm:text-[6.5px] font-semibold text-red-300">
              PIYE TO KIH
            </span>
          </div>
        </div>

        {/* Perforation Cut line */}
        <div className="relative my-3 sm:my-3.5 flex items-center justify-center">
          <div className="w-full border-b-2 border-dashed border-gray-600/60" />
          <div className="absolute -left-7 sm:-left-9 w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-[#0B0F17] border-r border-gold-500/30" />
          <div className="absolute -right-7 sm:-right-9 w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-[#0B0F17] border-l border-gold-500/30" />
        </div>

        {/* Barcode & Serial Section */}
        <div className="text-center bg-black/60 border border-white/10 rounded-2xl p-3 sm:p-3.5 relative z-10">
          <div className="text-[9px] sm:text-[10px] text-amber-400 font-black uppercase tracking-wider mb-1.5">
            KODE BOOKING PENUKARAN VOUCHER
          </div>

          {/* Barcode Mock Graphic */}
          <div className="h-10 sm:h-12 w-44 sm:w-48 mx-auto flex items-stretch justify-center gap-1 bg-white p-1.5 sm:p-2 rounded shadow-inner mb-1.5">
            {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 3, 5, 2, 4].map((w, idx) => (
              <div
                key={idx}
                className="bg-black rounded-sm"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>

          <div className="font-mono text-base sm:text-lg font-black tracking-widest text-gold-400">
            {serialNumber}
          </div>
        </div>

        {/* Notice & Premiere Validity */}
        <div className="mt-2.5 bg-red-950/40 border border-red-500/40 rounded-xl p-2 sm:p-2.5 text-center text-[9px] sm:text-[9.5px]">
          <span className="block font-black text-red-400 uppercase tracking-wider text-[8px] sm:text-[8.5px]">
            LOKASI PENUKARAN VOUCHER FISIK
          </span>
          <span className="font-black text-amber-300 text-[11px] sm:text-xs block mt-0.5 tracking-tight">
            📍 Booth Khusus Voucher Fisik {cityLocation ? `Kota ${cityLocation}` : ''}
          </span>
          {(displayVenue || cityVenues.length > 0) && (
            <div className="my-1 py-0.5 px-2 bg-black/70 rounded-lg border border-red-500/30 text-[9px] sm:text-[9.5px] text-amber-200 font-bold text-center">
              {displayVenue ? `Lokasi: ${displayVenue}` : `Lokasi Mall: ${cityVenues.join(' • ')}`}
            </div>
          )}
          <span className="text-gray-300 text-[8.5px] sm:text-[9px] block mt-1 leading-snug">
            Tunjukkan Kode Booking ini di booth resmi roadshow untuk menyelesaikan pembayaran dan mengambil Voucher Fisik penayangan ({validityText}).
          </span>
        </div>

        <div className="mt-2 text-center text-[9px] sm:text-[9.5px] text-gray-400 font-medium">
          <p className="flex items-center justify-center gap-1 text-green-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>TERVERIFIKASI RESMI MIRACLE PICTURES</span>
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="w-full mt-3 sm:mt-4 flex flex-wrap sm:flex-nowrap gap-2">
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>{downloading ? 'Menyimpan...' : 'Download PDF Tiket'}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 px-4 rounded-xl transition active:scale-95 shrink-0"
          title="Bagikan / Salin Link"
        >
          <Share2 className="w-4 h-4 shrink-0" />
          <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white font-bold text-xs py-3 px-4 rounded-xl transition shrink-0"
          >
            Tutup
          </button>
        )}
      </div>
    </div>
  );
}
