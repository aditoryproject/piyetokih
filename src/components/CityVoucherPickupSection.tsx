'use client';

import React from 'react';
import { Clock, MapPin, CheckCircle2, AlertTriangle, Info, Store } from 'lucide-react';
import { BoothInfo } from '@/lib/cities';

interface CityVoucherPickupSectionProps {
  cityName: string;
  dateStr: string;
  boothInfo?: BoothInfo;
}

export default function CityVoucherPickupSection({
  cityName,
  dateStr,
  boothInfo,
}: CityVoucherPickupSectionProps) {
  const venueTitle = boothInfo?.venue || `BOOTH ROADSHOW PIYE TO KIH? ${cityName.toUpperCase()}`;
  const floorDetail = boothInfo?.floor || 'Area Panggung Meet & Greet / Bioskop Mitra';
  const timeSchedule = boothInfo?.timeStr || '16.00 – 17.00 WIB';
  const directionsText =
    boothInfo?.directions ||
    `Cari booth oranye dengan spanduk resmi PIYE TO KIH? di area roadshow ${cityName}.`;
  const exclusiveNoticeText =
    boothInfo?.exclusiveNotice ||
    `Penukaran voucher fisik resmi hanya dilayani langsung di booth roadshow Kota ${cityName} pada jam yang telah ditentukan. Kasir bioskop tidak melayani penukaran kode booking.`;

  return (
    <section id="titik-pengambilan" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-amber-400">
          LOKASI BOOTH ROADSHOW {cityName.toUpperCase()}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 mb-2">
          TITIK PENGAMBILAN VOUCHER FISIK
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Tunjukkan Kode Booking Voucher Anda di booth khusus roadshow berikut untuk membayar dan menerima Voucher Fisik.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-amber-500/40 bg-[#0e121a] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Badge */}
        <div className="inline-block px-3 py-1 rounded bg-amber-500 text-slate-950 font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-6">
          LOKASI PENUKARAN VOUCHER FISIK (BUKAN BIOSKOP)
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Venue Info & Preparations */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {venueTitle}
              </h3>
              <p className="text-amber-400 font-bold text-sm sm:text-base mt-1">
                {floorDetail}
              </p>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <b>{timeSchedule}</b> (Tanggal {dateStr})
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">{directionsText}</span>
              </div>
            </div>

            {/* Preparation sub-card */}
            <div className="bg-[#141a24] border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs sm:text-sm mb-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Yang Perlu Disiapkan di Booth:</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Tunjukkan SMS / WhatsApp / Tangkapan Layar <b>KODE BOOKING</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Lakukan pembayaran voucher fisik sesuai nominal di kasir booth</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Terima lembaran <b>VOUCHER FISIK</b> untuk penayangan 19–20 November</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Warning / Notice Box */}
          <div className="lg:col-span-5 bg-[#141a24] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-2.5 text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider text-amber-400">
                PENTING — BACA AGAR TIDAK SALAH LOKASI
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {exclusiveNoticeText}
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-amber-300/90 font-medium">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Datang tepat waktu sebelum booth ditutup sesuai jadwal.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
