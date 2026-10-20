'use client';

import React from 'react';
import { Clock, MapPin, CheckCircle2, AlertTriangle, Info, Store } from 'lucide-react';
import { BoothInfo, cleanVenueToMallName } from '@/lib/cities';

interface CityVoucherPickupSectionProps {
  cityName: string;
  dateStr: string;
  boothInfo?: BoothInfo;
  schoolVenue?: string;
  campusVenue?: string;
}

export default function CityVoucherPickupSection({
  cityName,
  dateStr,
  boothInfo,
  schoolVenue,
  campusVenue,
}: CityVoucherPickupSectionProps) {
  const mallTitle = cleanVenueToMallName(boothInfo?.venue) || `BOOTH ROADSHOW PIYE TO KIH? ${cityName.toUpperCase()}`;
  const mallFloor = cleanVenueToMallName(boothInfo?.floor) || 'Area Panggung Meet & Greet Offline';
  const mallTime = boothInfo?.timeStr || '16.00 – 17.00 WIB';

  return (
    <section id="titik-pengambilan" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header per Page 10 */}
      <div className="text-center mb-8">
        <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-amber-400">
          TITIK PENGAMBILAN VOUCHER FISIK
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 mb-2">
          Ambil Vouchermu di Sini
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Bawa Kode Bookingmu ke booth PIYE TO KIH?, bayar <b>Rp10.000/voucher</b>, lalu ambil voucher fisikmu untuk ditukar dengan tiket di Bioskop saat penayangan 19–20 November.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-amber-500/40 bg-[#0e121a] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Badge */}
        <div className="inline-block px-3 py-1 rounded bg-amber-500 text-slate-950 font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-6">
          LOKASI PENUKARAN VOUCHER FISIK (BUKAN BIOSKOP)
        </div>

        {/* Categories of Booth: Sekolah, Kampus, Mall (Only render active ones) */}
        {(() => {
          const booths: Array<{ badge: string; title: string; desc: string; isHighlight?: boolean }> = [];
          if (schoolVenue) {
            booths.push({
              badge: `[ 0${booths.length + 1} ] KUNJUNGAN SEKOLAH`,
              title: schoolVenue,
              desc: 'Booth resmi tersedia saat sesi sapa pagi & bagi-bagi merchandise di sekolah.',
            });
          }
          if (campusVenue) {
            booths.push({
              badge: `[ 0${booths.length + 1} ] KUNJUNGAN KAMPUS`,
              title: campusVenue,
              desc: 'Booth resmi buka saat sharing session komedi & temu tawa bareng mahasiswa.',
            });
          }
          booths.push({
            badge: `[ 0${booths.length + 1} ] MALL ROADSHOW & MEET GREET`,
            title: mallTitle,
            desc: `${mallFloor} (${mallTime})`,
            isHighlight: true,
          });

          return (
            <div className="mb-8">
              <p className="text-xs sm:text-sm font-semibold text-amber-300 mb-3">
                {booths.length > 1
                  ? 'Lokasi booth penukaran voucher tersedia di Mall Roadshow resmi serta agenda kunjungan kota:'
                  : 'Lokasi booth penukaran voucher resmi tersedia di Mall Roadshow kota:'}
              </p>
              <div
                className={`grid grid-cols-1 ${
                  booths.length === 2
                    ? 'sm:grid-cols-2'
                    : booths.length === 1
                    ? 'max-w-md mx-auto'
                    : 'md:grid-cols-3'
                } gap-3.5`}
              >
                {booths.map((b, i) => (
                  <div
                    key={i}
                    className={`bg-[#141a24] ${
                      b.isHighlight ? 'border border-amber-500/40' : 'border border-white/10'
                    } rounded-xl p-4 flex flex-col justify-between`}
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                        {b.badge}
                      </span>
                      <h4 className="text-sm font-bold text-white mb-1">
                        {b.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {b.desc}
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold mt-3">
                      ✓ Bayar &amp; Ambil Voucher Rp10.000
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Checklist per Page 10 */}
        <div className="bg-[#141a24] border border-white/10 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 text-amber-400 font-black text-xs sm:text-sm mb-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Alur Pengambilan Voucher Fisik:</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
            <li className="flex items-start gap-2.5">
              <span className="text-amber-400 font-bold">•</span>
              <span>Tunjukkan <b>Kode Booking</b> di booth PIYE TO KIH?.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-amber-400 font-bold">•</span>
              <span>Dapatkan voucher fisik di booth roadshow (bayar <b>Rp10.000/voucher</b>), <u>bukan di kasir bioskop</u>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-amber-400 font-bold">•</span>
              <span>Bawa <b>Voucher Fisik</b> ke bioskop dan tukarkan menjadi tiket nonton <b>19–20 November 2026</b>.</span>
            </li>
          </ul>
        </div>

        {/* Warning / Notice Box */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-amber-300 block mb-0.5">PENTING:</span>
            Kasir bioskop tidak melayani penukaran Kode Booking dari website. Kode Booking wajib dibawa dan ditukarkan menjadi lembaran Voucher Fisik di booth roadshow terlebih dahulu.
          </div>
        </div>
      </div>
    </section>
  );
}
