'use client';

import React, { useRef, useState } from 'react';
import { Download, Share2, CheckCircle2, Film } from 'lucide-react';

interface VoucherTicketCardProps {
  serialNumber: string;
  name: string;
  phone: string;
  cityLocation?: string;
  claimedAt?: string;
  validityText?: string;
}

export default function VoucherTicketCard({
  serialNumber,
  name,
  phone,
  cityLocation,
  claimedAt = new Date().toLocaleDateString('id-ID'),
  validityText = '19 - 20 November 2026 (Penayangan Perdana)',
}: VoucherTicketCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

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

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {/* TICKET CONTAINER */}
      <div
        ref={cardRef}
        className="w-full bg-gradient-to-b from-[#181D29] via-[#0E131E] to-[#0A0D14] border-2 border-gold-500/40 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden"
        style={{ minHeight: '480px' }}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center border-b border-white/10 pb-4 mb-4 relative z-10">
          <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-widest text-gold-400 font-bold uppercase mb-1">
            <Film className="w-3.5 h-3.5 text-gold-400" />
            <span>MIRACLE PICTURES PRESENTS</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
            PIYE TO KIH?
          </h2>
          <p className="text-[11px] text-amber-300 font-extrabold tracking-wide uppercase">
            OFFICIAL E-VOUCHER NONTON
          </p>
        </div>

        {/* PENUKARAN ROADSHOW & MEET AND GREET BADGE */}
        <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-3 text-center mb-4 relative z-10">
          <div className="text-[9px] uppercase font-extrabold text-amber-400 tracking-wider">
            PENUKARAN VOUCHER FISIK RESMI
          </div>
          <div className="text-sm sm:text-base font-black text-amber-300 tracking-tight leading-snug my-0.5">
            ROADSHOW &amp; MEET AND GREET DI KOTAMU
          </div>
          <div className="text-[10px] text-red-300 font-extrabold mt-1">
            ⚠️ Voucher digital ini BUKAN bukti pembayaran tiket
          </div>
          <div className="text-[9px] text-gray-300 mt-0.5 leading-tight">
            Kunjungi booth resmi di samping venue / panggung Meet &amp; Greet untuk menukarkan dengan voucher fisik resmi.
          </div>
        </div>

        {/* Attendee Info */}
        <div className="space-y-3 mb-6 relative z-10">
          <div className="bg-black/50 border border-white/10 rounded-xl px-4 py-3">
            <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
              NAMA PENERIMA VOUCHER
            </span>
            <span className="text-base font-black text-white block leading-normal break-words">
              {name || 'Penonton Setia'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5">
              <span className="block text-[9px] uppercase font-bold text-gray-400 mb-1">
                KOTA
              </span>
              <span className="font-bold text-gold-400 block leading-normal break-words">
                {cityLocation || 'Nasional'}
              </span>
            </div>
            <div className="bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5">
              <span className="block text-[9px] uppercase font-bold text-gray-400 mb-1">
                TANGGAL KLAIM
              </span>
              <span className="font-semibold text-gray-200 block leading-normal break-words">
                {claimedAt}
              </span>
            </div>
          </div>
        </div>

        {/* OFFICIAL DIGITAL STAMP EFFECT */}
        <div className="absolute right-3 top-36 transform rotate-[-12deg] pointer-events-none select-none z-10 opacity-80">
          <div className="w-24 h-24 border-4 border-dashed border-red-500/85 rounded-full flex flex-col items-center justify-center p-1.5 text-center shadow-lg bg-red-950/10">
            <span className="text-[7.5px] font-black tracking-widest text-red-400 uppercase">
              ★ OFFICIAL ★
            </span>
            <span className="text-[10px] font-black text-red-500 uppercase leading-none my-0.5 tracking-tighter">
              VERIFIED
            </span>
            <span className="text-[6.5px] font-bold text-red-400 uppercase tracking-widest">
              MIRACLE PICTURES
            </span>
            <div className="w-10 h-0.5 bg-red-500/70 my-0.5" />
            <span className="text-[6.5px] font-semibold text-red-300">
              PIYE TO KIH
            </span>
          </div>
        </div>

        {/* Perforation Cut line */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-b-2 border-dashed border-gray-600/60" />
          <div className="absolute -left-9 w-6 h-6 rounded-full bg-[#0B0F17] border-r border-gold-500/30" />
          <div className="absolute -right-9 w-6 h-6 rounded-full bg-[#0B0F17] border-l border-gold-500/30" />
        </div>

        {/* Barcode & Serial Section */}
        <div className="text-center bg-black/60 border border-white/10 rounded-2xl p-4 relative z-10">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            KODE SERIAL PENUKARAN
          </div>

          {/* Barcode Mock Graphic */}
          <div className="h-12 w-48 mx-auto flex items-stretch justify-center gap-1 bg-white p-2 rounded shadow-inner mb-2">
            {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 3, 5, 2, 4].map((w, idx) => (
              <div
                key={idx}
                className="bg-black rounded-sm"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>

          <div className="font-mono text-lg font-black tracking-widest text-gold-400">
            {serialNumber}
          </div>
        </div>

        {/* Notice & Premiere Validity */}
        <div className="mt-3 bg-red-950/40 border border-red-500/40 rounded-xl p-2.5 text-center text-[10px]">
          <span className="block font-black text-red-400 uppercase tracking-wider text-[9px]">
            LOKASI PENUKARAN VOUCHER FISIK
          </span>
          <span className="font-black text-amber-300 text-xs block mt-0.5 tracking-tight">
            Roadshow &amp; Meet and Greet ({validityText})
          </span>
          <span className="text-gray-300 text-[9px] block mt-1 leading-snug">
            Voucher digital ini bukan bukti pembayaran. Kunjungi booth penukaran resmi di samping panggung / venue Meet &amp; Greet di kotamu untuk menukarkan dengan voucher fisik resmi.
          </span>
        </div>

        <div className="mt-3 text-center text-[10px] text-gray-400 font-medium">
          <p className="flex items-center justify-center gap-1 text-green-400 font-bold mb-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            TERVERIFIKASI RESMI MIRACLE PICTURES
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="w-full mt-4 flex gap-2">
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Menyimpan PDF...' : 'Download PDF Tiket'}</span>
        </button>

        <button
          onClick={() => {
            const shareUrl = (typeof window !== 'undefined' && !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1'))
              ? `${window.location.origin}/voucher/${serialNumber}`
              : `https://piyetokihfilm.com/voucher/${serialNumber}`;

            if (navigator.share) {
              navigator.share({
                title: 'Voucher Resmi Film Piye Toh Kih',
                text: `Klaim voucher nonton film Piye Toh Kih kode: ${serialNumber}`,
                url: shareUrl,
              });
            } else {
              navigator.clipboard.writeText(shareUrl);
              alert('Link resmi voucher berhasil disalin!');
            }
          }}
          className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition"
          title="Bagikan Voucher"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
