'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Ticket, X, MapPin } from 'lucide-react';
import VoucherTicketCard from './VoucherTicketCard';
import { trackLeadSubmission } from '@/lib/pixel';
import { CITIES_DATA } from '@/lib/cities';

interface WarVoucherFormProps {
  onSuccessClaim?: (remaining: number) => void;
}

export default function WarVoucherForm({ onSuccessClaim }: WarVoucherFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cityLocation, setCityLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [claimedLead, setClaimedLead] = useState<{
    serialNumber: string;
    name: string;
    phone: string;
    cityLocation?: string;
    voucherUrl: string;
    validityText?: string;
  } | null>(null);

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
        body: JSON.stringify({ name, phone, email, cityLocation }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Gagal mengklaim voucher. Silakan coba lagi.');
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

      // Fire Meta Pixel Lead
      trackLeadSubmission(data.serialNumber);

      setClaimedLead({
        serialNumber: data.serialNumber,
        name,
        phone,
        cityLocation,
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
            <span>WAR E-VOUCHER NONTON</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Formulir War Voucher Nonton
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-md mx-auto">
            Dapatkan e-voucher resmi berseri unik. <b className="text-amber-300">Voucher dapat ditukarkan di bioskop kesayangan Anda</b> saat periode penayangan film!
          </p>
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
              *PDF voucher ber-barcode akan otomatis dikirimkan ke nomor ini.
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
              <span>Kota Domisili / Kota Menonton <span className="text-red-500">*</span></span>
              <span className="text-[10px] text-gray-400 font-normal">Ketik kota Anda</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                list="indonesia-cities"
                value={cityLocation}
                onChange={e => setCityLocation(e.target.value)}
                placeholder="Contoh: Solo, Semarang, Surabaya, Jakarta, Bandung, dll"
                className="w-full bg-black/60 border border-white/15 focus:border-gold-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-gray-600"
              />
              <datalist id="indonesia-cities">
                <option value="Surakarta (Solo)" />
                <option value="Semarang" />
                <option value="Yogyakarta" />
                <option value="Surabaya" />
                <option value="Malang" />
                <option value="Madiun" />
                <option value="Sidoarjo" />
                <option value="Magelang" />
                <option value="Kediri" />
                <option value="Gresik" />
                <option value="Mojokerto" />
                <option value="Nganjuk" />
                <option value="Ngawi" />
                <option value="Ponorogo" />
                <option value="Sragen" />
                <option value="Blitar" />
                <option value="Tulungagung" />
                <option value="Jakarta" />
                <option value="Bandung" />
                <option value="Bekasi" />
                <option value="Tangerang" />
                <option value="Depok" />
                <option value="Bogor" />
                <option value="Medan" />
                <option value="Makassar" />
                <option value="Denpasar (Bali)" />
                <option value="Palembang" />
              </datalist>
            </div>
            <span className="block text-[11px] text-gray-400 mt-1">
              *Membantu kami melihat potensi dan animo penonton di kota Anda.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-xl transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses E-Voucher...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                KLAIM E-VOUCHER NONTON
              </span>
            )}
          </button>
        </form>
      </div>

      {/* POPUP / MODAL SUKSES TIKET VOUCHER */}
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold mb-1">
                <CheckCircle className="w-4 h-4" />
                E-VOUCHER BERHASIL DIKLAIM!
              </div>
              <p className="text-xs text-gray-300">
                Voucher dapat ditukarkan di bioskop kesayangan Anda saat periode penayangan film.
              </p>
            </div>

            <VoucherTicketCard
              serialNumber={claimedLead.serialNumber}
              name={claimedLead.name}
              phone={claimedLead.phone}
              cityLocation={claimedLead.cityLocation}
              validityText={claimedLead.validityText}
            />
          </div>
        </div>
      )}
    </div>
  );
}
