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
  const [website, setWebsite] = useState(''); // Honeypot trap for bots
  const [formRenderTime] = useState(() => Date.now()); // Bot speed detection
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [tixidUrl, setTixidUrl] = useState('https://rb.gy/l28pzj');
  const [mtixUrl, setMtixUrl] = useState('https://m.21cineplex.com/id/movies/16PTKH');

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
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          city: city.trim(),
          website, // Honeypot
          _t: formRenderTime, // Speed run check
        }),
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
        `Terima kasih ${name}! Pengingat berhasil dipasang. Kami akan mengabari Anda via WhatsApp & Email saat tiket dan promonya sudah resmi dibuka!`
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
    <section id="presale" className="relative py-20 px-4 sm:px-6 overflow-hidden border-y border-white/[0.08] bg-[#0A0A0D]">
      {/* Subtle atmospheric theatrical glow (Refined, no loud neon) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[450px] bg-amber-500/[0.04] rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        {/* TOP BADGE */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-amber-400/25 text-amber-300 text-[11px] font-black tracking-[0.2em] uppercase mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>PROMO PRESALE &amp; BUY 1 GET 1</span>
        </div>

        {/* REVISED HEADLINE */}
        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-2">
          MAU NONTON BERDUA <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
            BAYAR SATU TIKET? BISA!
          </span>
        </h2>

        {/* REVISED SUBTITLE */}
        <p className="text-sm sm:text-base text-amber-300 font-bold max-w-xl mx-auto mb-10 leading-relaxed">
          Promonya terbatas banget Jadi jangan sampai kehabisan!
        </p>

        {/* 2 ACTION BUTTONS: TIX ID & M-TIX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-14">
          {/* Tombol 1: TIX ID */}
          <a
            href={tixidUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackMetaEvent('InitiateCheckout', { channel: 'TIX_ID', promo: 'BOGO' })}
            className="group relative bg-[#111318] border border-white/10 hover:border-amber-400/50 rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  TIX ID
                </span>
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Promo Terbatas</span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                Beli tiket Buy 1 Get 1 di TIX ID selama persediaan masih ada.
              </h3>
            </div>

            <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
              <span>Beli di TIX ID</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>

          {/* Tombol 2: M-TIX (XXI) */}
          <a
            href={mtixUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackMetaEvent('InitiateCheckout', { channel: 'MTIX_XXI', promo: 'BOGO' })}
            className="group relative bg-[#111318] border border-white/10 hover:border-amber-400/50 rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                  M-TIX (XXI)
                </span>
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Promo Terbatas</span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                Beli tiket Buy 1 Get 1 di M-TIX selama persediaan masih ada.
              </h3>
            </div>

            <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
              <span>Beli di M-TIX XXI</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>
        </div>

        {/* FORMULIR REMINDER WAR PRESALE BUY 1 GET 1 */}
        <div className="max-w-xl mx-auto bg-[#101217] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl text-left relative">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-amber-400 text-xs font-bold uppercase mb-2">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>PENGINGAT RESMI VIA WHATSAPP &amp; EMAIL</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight">
              TIKET PRESALE DAN BUY 1 GET 1 BELUM TERSEDIA?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              Tenang, isi form di bawah ini dulu. Nanti kami kabari saat tiket dan promonya sudah resmi dibuka.
            </p>

            {/* JADWAL DIBUKA */}
            <div className="mt-4 p-3 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Presale dibuka: <strong className="text-white">15-18 November 2026</strong></span>
              </span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-red-400" />
                <span>Buy 1 Get 1 dibuka: <strong className="text-white">19-20 November 2026</strong></span>
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg ? (
            <div className="p-6 rounded-2xl bg-[#161C18] border border-emerald-500/30 text-center space-y-2 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Pengingat Berhasil Didaftarkan</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{successMsg}</p>
              <button
                type="button"
                onClick={() => setSuccessMsg('')}
                className="mt-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition"
              >
                Daftarkan Kontak Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field for bot protection */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Nama Lengkap <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-[#090A0D] border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Nomor WhatsApp Aktif <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-[#090A0D] border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-slate-600"
                />
                <span className="block text-[11px] text-slate-500 mt-1">
                  *Notifikasi link presale akan dikirimkan otomatis ke WhatsApp ini pada 15 November 2026.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Alamat Email <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Contoh: budi@gmail.com"
                  className="w-full bg-[#090A0D] border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Kota Pilihan Menonton <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Contoh: Semarang, Solo, Surabaya, Yogyakarta, dll"
                  className="w-full bg-[#090A0D] border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-white text-sm outline-none transition placeholder:text-slate-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/10 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    PASANG PENGINGAT PRESALE 15 NOVEMBER
                  </span>
                )}
              </button>

              {/* Security reassurance badge */}
              <div className="pt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-3">
                <span>🔒 Enkripsi SSL 256-Bit</span>
                <span>•</span>
                <span>Anti-Spam Protected</span>
                <span>•</span>
                <span>Official Miracle Pictures</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
