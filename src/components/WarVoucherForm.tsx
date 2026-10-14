'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, Ticket, X, MapPin, Building2 } from 'lucide-react';
import VoucherTicketCard from './VoucherTicketCard';
import { trackLeadSubmission } from '@/lib/pixel';
import { getCityByNameOrSlug } from '@/lib/cities';

interface WarVoucherFormProps {
  onSuccessClaim?: (remaining: number) => void;
  defaultCity?: string;
}

export default function WarVoucherForm({ onSuccessClaim, defaultCity }: WarVoucherFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cityLocation, setCityLocation] = useState(defaultCity || '');
  const [venueLocation, setVenueLocation] = useState('');
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

  const activeCity = getCityByNameOrSlug(cityLocation || defaultCity);
  const venues = activeCity?.cinemas?.map(c => c.name) || [];

  useEffect(() => {
    if (defaultCity) {
      setCityLocation(defaultCity);
    }
  }, [defaultCity]);

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
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Alamat email valid wajib diisi');
      return;
    }
    if (!cityLocation) {
      setErrorMsg('Silakan pilih kota asal / rencana menonton');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/vouchers/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, cityLocation, venueLocation }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Gagal mengklaim Code Verifikasi. Silakan coba lagi.');
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
        venueLocation: venueLocation || (venues.length === 1 ? venues[0] : undefined),
        voucherUrl: data.voucherUrl,
        validityText: data.validityText,
      });

      if (onSuccessClaim && data.remainingStock !== undefined) {
        onSuccessClaim(data.remainingStock);
      }
    } catch (err: any) {
      setErrorMsg('Terjadi kendala jaringan. Pastikan koneksi internet stabil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* FORM CARD */}
      <div className="bg-gradient-to-b from-[#151C2C]/95 to-[#0B0F17]/95 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            <span>KLAIM CODE VERIFIKASI RESMI</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Formulir Klaim Code Verifikasi {defaultCity ? `Kota ${defaultCity}` : ''}
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-md mx-auto">
            Dapatkan Code Verifikasi resmi. <b className="text-amber-300">Bukan bukti pembayaran tiket</b>. Penukaran voucher fisik resmi dilakukan saat <b>Roadshow &amp; Meet and Greet</b> di kotamu.
          </p>

          {/* LOKASI PENUKARAN DI BOOTH SAMPING MEET AND GREET + MALL BIOSKOP */}
          <div className="mt-3.5 p-3.5 rounded-2xl bg-black/60 border border-amber-500/30 text-left">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black mb-1">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span>Lokasi Penukaran Voucher Fisik ({activeCity ? `Kota ${activeCity.name}` : 'Roadshow'}):</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed mb-2">
              Penukaran dilakukan di <b>booth resmi samping panggung Meet &amp; Greet</b> di mall / bioskop berikut:
            </p>
            {venues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {venues.map((vName, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#121824] border border-white/10 rounded-xl px-3 py-2 text-xs">
                    <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-bold text-white text-[11px] leading-snug">{vName}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-amber-300 font-bold">
                Booth resmi di samping venue / panggung Meet and Greet Kota {cityLocation || 'kotamu'}.
              </div>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Budi Prasetyo"
              className="w-full bg-black/60 border border-white/15 focus:border-gold-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Nomor WhatsApp Aktif <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full bg-black/60 border border-white/15 focus:border-gold-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-gray-600"
            />
            <span className="block text-[11px] text-gray-400 mt-1">
              *Code Verifikasi &amp; petunjuk penukaran akan otomatis dikirimkan ke nomor WhatsApp ini.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Alamat Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Contoh: budi@gmail.com"
              className="w-full bg-black/60 border border-white/15 focus:border-gold-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center justify-between">
              <span>Kota Roadshow / Kota Menonton <span className="text-red-500">*</span></span>
              {defaultCity ? (
                <span className="text-[10px] text-amber-400 font-bold">Terkunci untuk Kota {defaultCity}</span>
              ) : (
                <span className="text-[10px] text-gray-400 font-normal">Pilih kota Anda</span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                readOnly={Boolean(defaultCity)}
                value={cityLocation}
                onChange={e => setCityLocation(e.target.value)}
                placeholder="Contoh: Solo, Semarang, Yogyakarta, Surabaya, dll"
                className={`w-full bg-black/60 border border-white/15 focus:border-gold-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-gray-600 ${
                  defaultCity ? 'cursor-not-allowed bg-black/80 text-amber-300 font-bold' : ''
                }`}
              />
            </div>
            <span className="block text-[11px] text-gray-400 mt-1">
              *Penukaran voucher fisik dilakukan di booth samping panggung Meet and Greet Kota {cityLocation || 'pilihan'}.
            </span>
          </div>

          {/* RENCANA LOKASI MALL / BIOSKOP PENUKARAN */}
          {venues.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center justify-between">
                <span>Rencana Lokasi Penukaran (Mall / Bioskop)</span>
                <span className="text-[10px] text-amber-400 font-bold">Booth Meet &amp; Greet</span>
              </label>
              <div className="relative">
                <select
                  value={venueLocation}
                  onChange={e => setVenueLocation(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 focus:border-gold-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition cursor-pointer"
                >
                  <option value="">Semua Lokasi Booth Meet &amp; Greet di Kota {activeCity?.name}</option>
                  {venues.map((v, i) => (
                    <option key={i} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <span className="block text-[11px] text-gray-400 mt-1">
                *Pilih mall tempat Anda berencana hadir di booth samping panggung Meet &amp; Greet.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-xl transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menerbitkan Code Verifikasi...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                KLAIM CODE VERIFIKASI RESMI
              </span>
            )}
          </button>
        </form>
      </div>

      {/* POPUP / MODAL SUKSES CODE VERIFIKASI */}
      {claimedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md my-8 animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              onClick={() => setClaimedLead(null)}
              className="absolute -top-3 -right-3 z-30 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold mb-2">
                <CheckCircle className="w-4 h-4" />
                CODE VERIFIKASI BERHASIL DITERBITKAN!
              </div>
              <div className="bg-amber-950/60 border border-amber-500/50 rounded-2xl p-3 text-left space-y-1">
                <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider block">
                  PETUNJUK PENUKARAN VOUCHER FISIK:
                </span>
                <p className="text-xs text-white font-medium">
                  ⚠️ Code ini <b>BUKAN bukti pembayaran tiket</b>.
                </p>
                <p className="text-xs text-amber-300 font-bold">
                  📍 Lokasi Penukaran: Booth resmi di samping panggung Meet &amp; Greet di{' '}
                  <span className="text-white underline">
                    {claimedLead.venueLocation || (venues.length > 0 ? venues.join(' & ') : `Kota ${claimedLead.cityLocation || 'terkait'}`)}
                  </span>
                  !
                </p>
              </div>
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
    </div>
  );
}
