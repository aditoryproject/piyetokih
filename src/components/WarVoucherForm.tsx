'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, Ticket, X, MapPin, Lock, ArrowRight } from 'lucide-react';
import VoucherTicketCard from './VoucherTicketCard';
import { trackLeadSubmission } from '@/lib/pixel';
import { getCityByNameOrSlug } from '@/lib/cities';

interface WarVoucherFormProps {
  onSuccessClaim?: (remaining: number) => void;
  defaultCity?: string;
  totalQuota?: number;
  remainingStock?: number;
  defaultVenue?: string;
}

export default function WarVoucherForm({
  onSuccessClaim,
  defaultCity = 'Semarang',
  totalQuota = 500,
  remainingStock: initialRemaining = 387,
  defaultVenue,
}: WarVoucherFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cityLocation, setCityLocation] = useState(defaultCity || 'Semarang');
  const [venueLocation, setVenueLocation] = useState(
    defaultVenue ||
      'The Park Mall Semarang — Lantai 2 (Area Atrium Depan Cinema XXI) (16.00 - 17.00 WIB)'
  );
  const [remaining, setRemaining] = useState(initialRemaining);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [claimedLead, setClaimedLead] = useState<{
    serialNumber: string;
    name: string;
    phone: string;
    cityLocation?: string;
    venueLocation?: string;
    voucherUrl: string;
    validityText?: string;
  } | null>(null);

  useEffect(() => {
    if (defaultCity) {
      setCityLocation(defaultCity);
    }
    if (defaultVenue) {
      setVenueLocation(defaultVenue);
    } else if (defaultCity?.toLowerCase() === 'semarang') {
      setVenueLocation(
        'The Park Mall Semarang — Lantai 2 (Area Atrium Depan Cinema XXI) (16.00 - 17.00 WIB)'
      );
    }

    // Auto scroll based on ad intent query (?intent=voucher / ?intent=screening / ?intent=rundown)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const intent = params.get('intent');
      if (intent === 'voucher') {
        const timer = setTimeout(() => {
          const el = document.getElementById('booking-voucher');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        return () => clearTimeout(timer);
      } else if (intent === 'screening') {
        const timer = setTimeout(() => {
          const el = document.getElementById('pilihan-bioskop');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [defaultCity, defaultVenue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama lengkap wajib diisi');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setErrorMsg('Nomor WhatsApp aktif wajib diisi dengan benar');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/vouchers/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          cityLocation,
          venueLocation,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Gagal menerbitkan Kode Booking. Silakan coba lagi.');
        setLoading(false);
        return;
      }

      // Fire confetti
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FACC15', '#DC2626', '#FFFFFF'],
        });
      } catch {}

      // Fire Meta Pixel Lead with City
      trackLeadSubmission(data.serialNumber, cityLocation);

      setClaimedLead({
        serialNumber: data.serialNumber,
        name,
        phone,
        cityLocation,
        venueLocation,
        voucherUrl: data.voucherUrl,
        validityText: data.validityText,
      });

      if (data.remainingStock !== undefined) {
        setRemaining(data.remainingStock);
        if (onSuccessClaim) {
          onSuccessClaim(data.remainingStock);
        }
      }
    } catch (err: any) {
      setErrorMsg('Terjadi kendala jaringan. Pastikan koneksi internet stabil.');
    } finally {
      setLoading(false);
    }
  };

  const claimedPercent = Math.round(((totalQuota - remaining) / totalQuota) * 100);
  let statusBadgeText = 'MASIH TERSEDIA';
  let statusBadgeClass = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400';

  if (remaining <= 0) {
    statusBadgeText = 'BOOKING DITUTUP';
    statusBadgeClass = 'bg-slate-700/40 border-slate-600 text-slate-400';
  } else if (claimedPercent >= 95) {
    statusBadgeText = 'TINGGAL SEDIKIT';
    statusBadgeClass = 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse';
  } else if (claimedPercent >= 80) {
    statusBadgeText = 'HAMPIR HABIS';
    statusBadgeClass = 'bg-orange-500/20 border-orange-500/50 text-orange-400';
  } else if (claimedPercent >= 60) {
    statusBadgeText = 'MULAI MENIPIS';
    statusBadgeClass = 'bg-amber-500/20 border-amber-500/50 text-amber-300';
  }

  return (
    <section id="booking-voucher" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-amber-400">
          VOUCHER ROADSHOW · PENAYANGAN SERENTAK
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 mb-2">
          AMANKAN VOUCHER NONTONMU
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Isi data sebentar, dapatkan Kode Booking Voucher, lalu tunjukkan kodenya di booth PIYE TO KIH? saat roadshow {cityLocation}.
        </p>
      </div>

      {/* 5-Step Progress Flow - Developer Monospaced Pipeline */}
      <div className="bg-[#121620] border border-white/10 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl">
        <div className="text-center mb-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
            ALUR BOOKING &amp; PENGAMBILAN VOUCHER
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          {/* Step 1 */}
          <div className="bg-[#181f2c] border border-white/5 rounded-xl p-3 text-center flex flex-col justify-center items-center">
            <span className="font-mono text-xs font-bold text-amber-400 mb-1">01</span>
            <span className="text-[11px] font-bold text-white uppercase leading-tight">ISI FORM</span>
            <span className="text-[9.5px] text-slate-400 mt-0.5">Nama &amp; WhatsApp</span>
          </div>

          {/* Step 2 */}
          <div className="bg-[#181f2c] border border-white/5 rounded-xl p-3 text-center flex flex-col justify-center items-center">
            <span className="font-mono text-xs font-bold text-amber-400 mb-1">02</span>
            <span className="text-[11px] font-bold text-white uppercase leading-tight">DAPAT KODE</span>
            <span className="text-[9.5px] text-slate-400 mt-0.5">Kode Booking</span>
          </div>

          {/* Step 3 */}
          <div className="bg-[#181f2c] border border-white/5 rounded-xl p-3 text-center flex flex-col justify-center items-center">
            <span className="font-mono text-xs font-bold text-amber-400 mb-1">03</span>
            <span className="text-[11px] font-bold text-white uppercase leading-tight">DATANG KE BOOTH</span>
            <span className="text-[9.5px] text-slate-400 mt-0.5">Booth Roadshow</span>
          </div>

          {/* Step 4 */}
          <div className="bg-[#181f2c] border border-white/5 rounded-xl p-3 text-center flex flex-col justify-center items-center">
            <span className="font-mono text-xs font-bold text-amber-400 mb-1">04</span>
            <span className="text-[11px] font-bold text-white uppercase leading-tight">BAYAR &amp; AMBIL</span>
            <span className="text-[9.5px] text-slate-400 mt-0.5">Voucher Fisik</span>
          </div>

          {/* Step 5 */}
          <div className="col-span-2 sm:col-span-1 bg-amber-500/10 border border-amber-500/40 rounded-xl p-3 text-center flex flex-col justify-center items-center">
            <span className="font-mono text-xs font-bold text-amber-300 mb-1">05</span>
            <span className="text-[11px] font-bold text-amber-300 uppercase leading-tight">NONTON 19–20 NOV</span>
            <span className="text-[9.5px] text-amber-400/80 mt-0.5">Tayang Serentak</span>
          </div>
        </div>

        {/* Warning Banner inside Step Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            Perhatian: Kode Booking merupakan registrasi antrean, bukan tiket masuk dan bukan bukti pembayaran.
          </p>
        </div>
      </div>

      {/* Status Kuota Box */}
      <div className="bg-[#121620] border border-white/10 rounded-3xl p-5 sm:p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              STATUS KUOTA VOUCHER ROADSHOW {cityLocation.toUpperCase()}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-amber-400">
                {remaining} voucher masih tersedia
              </span>
            </div>
          </div>
          <div>
            <span className={`inline-block px-2.5 py-1 rounded border text-[10px] font-mono font-bold uppercase tracking-wider ${statusBadgeClass}`}>
              {statusBadgeText}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mb-3 font-mono">
          Alokasi kuota: {remaining} / {totalQuota} voucher ({cityLocation})
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(10, 100 - claimedPercent)}%` }}
          />
        </div>
      </div>

      {/* FORMULIR BOOKING VOUCHER */}
      <div className="bg-[#121620] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
            FORMULIR REGISTRASI VOUCHER
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Silakan lengkapi form berikut untuk menerbitkan Kode Booking Anda.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAMA LENGKAP */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              NAMA LENGKAP <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dimas Bagus Prasetyo"
              className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* NOMOR WHATSAPP */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              NOMOR WHATSAPP AKTIF <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition"
            />
            <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
              <p>Kode booking dan informasi booth akan dikirim ke nomor ini.</p>
              <p className="text-slate-500">1 nomor WhatsApp hanya dapat membuat 1 kode booking aktif.</p>
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              EMAIL <span className="text-slate-400 font-normal">(OPSIONAL)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* KOTA ROADSHOW */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              KOTA ROADSHOW
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={cityLocation}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-white/10 text-slate-300 text-xs sm:text-sm cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <Lock className="w-3 h-3" />
                <span>Terkunci (Kota {cityLocation})</span>
              </span>
            </div>
          </div>

          {/* RENCANA LOKASI BOOTH */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              RENCANA LOKASI BOOTH
            </label>
            <select
              value={venueLocation}
              onChange={(e) => setVenueLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition"
            >
              <option value={venueLocation}>
                {venueLocation}
              </option>
            </select>
          </div>

          {/* CTA BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wide py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/15 transition-all active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'MEMPROSES KODE BOOKING...' : 'DAPATKAN KODE BOOKING'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* POPUP / MODAL TIKET KETIKA BERHASIL MENGKLAIM */}
      {claimedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-md my-8 bg-[#121620] border border-amber-500/40 rounded-3xl p-6 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setClaimedLead(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-20"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>KODE BOOKING RESMI TERBIT</span>
              </span>
              <h3 className="text-xl font-black text-white">🎟️ SIAP! VOUCHERMU SUDAH DIBOOKING</h3>
              <p className="text-xs text-slate-300 mt-1">
                Tunjukkan kode ini di booth {claimedLead.venueLocation || cityLocation} untuk menyelesaikan pembayaran &amp; menerima Voucher Fisik 19–20 November.
              </p>
            </div>

            <VoucherTicketCard
              serialNumber={claimedLead.serialNumber}
              name={claimedLead.name}
              phone={claimedLead.phone}
              cityLocation={claimedLead.cityLocation}
              venueLocation={claimedLead.venueLocation}
              validityText={claimedLead.validityText}
            />
          </div>
        </div>
      )}
    </section>
  );
}
