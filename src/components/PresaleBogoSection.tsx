'use client';

import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Calendar,
  Bell,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Send,
  Film,
  MapPin,
  Clock,
} from 'lucide-react';
import { trackCityCustomEvent, trackMetaEvent } from '@/lib/pixel';

export default function PresaleBogoSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [tixidUrl, setTixidUrl] = useState('https://www.tix.id');
  const [mtixUrl, setMtixUrl] = useState('https://m.21cineplex.com');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings?.bogoCinemaLinks?.tixid) setTixidUrl(d.settings.bogoCinemaLinks.tixid);
        if (d.settings?.bogoCinemaLinks?.xxi) setMtixUrl(d.settings.bogoCinemaLinks.xxi);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !phone.trim() || !email.trim() || !city.trim()) {
      setErrorMsg('Semua kolom formulir pengingat wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/bogo/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, city }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Gagal mendaftarkan pengingat. Silakan coba lagi.');
        setLoading(false);
        return;
      }

      // Fire Meta Pixel tracking
      trackMetaEvent('Lead', {
        content_name: 'BOGO_Presale_Reminder',
        city,
      });
      trackCityCustomEvent(city, 'BogoReminder', { name, phone });

      setSuccessMsg(
        `Terima kasih ${name}! Pengingat berhasil dipasang. Kami akan otomatis menghubungi Anda via WhatsApp & Email pada 15 November 2026 saat presale Buy 1 Get 1 resmi dibuka.`
      );
      setName('');
      setPhone('');
      setEmail('');
      setCity('');
    } catch {
      setErrorMsg('Terjadi kendala jaringan. Pastikan koneksi internet stabil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="presale" className="relative py-16 px-4 sm:px-6 overflow-hidden border-y border-white/10 bg-gradient-to-b from-[#0B0F17] via-[#101726] to-[#0B0F17]">
      {/* Background glow ambient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[450px] bg-gradient-to-b from-amber-500/15 via-red-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        {/* TOP BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600/20 via-amber-600/20 to-red-600/20 border border-amber-500/40 text-amber-300 text-xs font-black tracking-widest uppercase mb-4 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>PROMO PRESALE BUY 1 GET 1 NASIONAL</span>
        </div>

        {/* HEADLINE */}
        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-3">
          PRESALE EKSKLUSIF <br />
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
            BUY 1 GET 1 FILM &quot;PIYE TO KIH?&quot;
          </span>
        </h2>

        {/* PERIODE PENJUALAN & TAYANG PERDANA INFO BOX */}
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 bg-black/60 border border-amber-500/30 rounded-2xl px-6 py-3.5 mb-8 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Periode Pembelian: <b className="text-amber-300">15 November – 18 November 2026</b></span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Film className="w-4 h-4 text-red-400 shrink-0" />
            <span>Khusus Penayangan Perdana: <b className="text-red-400">19 November 2026</b></span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Amankan tiket nonton berdua hanya bayar 1 tiket! Kuota promo ini sangat terbatas, hanya tersedia <b>1.000 tiket di TIX ID</b> dan <b>500 tiket di M-TIX (XXI)</b>.
        </p>

        {/* 2 ACTION BUTTONS: TIX ID & M-TIX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-14">
          {/* Tombol 1: TIX ID (1.000 Kuota) */}
          <a
            href={tixidUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackMetaEvent('InitiateCheckout', { channel: 'TIX_ID', promo: 'BOGO' })}
            className="group relative bg-gradient-to-b from-[#182333] to-[#0E1724] border-2 border-emerald-500/40 hover:border-emerald-400 rounded-3xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  KUOTA 1.000 TIKET
                </span>
                <span className="text-[10px] font-extrabold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>Buka 15 Nov</span>
                </span>
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                Beli Presale di TIX ID
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pesan tiket Buy 1 Get 1 di aplikasi TIX ID untuk seluruh jaringan bioskop mitra.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-black text-emerald-400 group-hover:text-emerald-300">
              <span>Buka Aplikasi TIX ID</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Tombol 2: M-TIX (500 Kuota) */}
          <a
            href={mtixUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackMetaEvent('InitiateCheckout', { channel: 'MTIX_XXI', promo: 'BOGO' })}
            className="group relative bg-gradient-to-b from-[#231A18] to-[#140E0D] border-2 border-amber-500/40 hover:border-amber-400 rounded-3xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                  KUOTA 500 TIKET
                </span>
                <span className="text-[10px] font-extrabold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Buka 15 Nov</span>
                </span>
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                Beli Presale di M-TIX (XXI)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pesan tiket Buy 1 Get 1 di aplikasi resmi M-TIX Cinema XXI seluruh Indonesia.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-black text-amber-400 group-hover:text-amber-300">
              <span>Buka M-TIX Cinema XXI</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        </div>

        {/* FORMULIR REMINDER WAR PRESALE BUY 1 GET 1 */}
        <div className="max-w-xl mx-auto bg-gradient-to-b from-[#151D2C] to-[#0C121D] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left relative">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black uppercase mb-2">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>PASANG PENGINGAT (REMINDER) PRESALE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Takut Kehabisan Kuota 15 November?
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 max-w-md mx-auto leading-relaxed">
              Daftarkan kontak Anda di bawah ini! Kami akan <b>otomatis mengirimkan pesan pengingat ke WhatsApp &amp; Email</b> Anda tepat saat Presale Buy 1 Get 1 dibuka tanggal 15 November 2026.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg ? (
            <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-2 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-emerald-300">Pendaftaran Reminder Berhasil!</h4>
              <p className="text-xs text-slate-200 leading-relaxed">{successMsg}</p>
              <button
                type="button"
                onClick={() => setSuccessMsg('')}
                className="mt-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition"
              >
                Daftarkan Kontak Lainnya
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-slate-600"
                />
                <span className="block text-[11px] text-slate-400 mt-1">
                  *Notifikasi link presale akan otomatis dikirimkan ke nomor ini pada 15 November 2026.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Contoh: budi@gmail.com"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Kota Rencana Menonton <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Contoh: Semarang, Solo, Surabaya, Yogyakarta, dll"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-slate-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 hover:text-white font-black text-sm sm:text-base py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/20 transition-all transform active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Menyimpan Pengingat...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    INGATKAN SAYA SAAT WAR PRESALE DIBUKA (15 NOV)
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
