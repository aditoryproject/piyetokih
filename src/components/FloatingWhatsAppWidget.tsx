'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  MessageCircle,
  X,
  Send,
  Ticket,
  MapPin,
  Gift,
  Smile,
} from 'lucide-react';
import { CITIES_DATA } from '@/lib/cities';
import { trackMetaEvent } from '@/lib/pixel';

interface FloatingWhatsAppWidgetProps {
  whatsappNumber?: string;
}

export default function FloatingWhatsAppWidget({
  whatsappNumber = '',
}: FloatingWhatsAppWidgetProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [hasUnreadPulse, setHasUnreadPulse] = useState(true);
  const widgetRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format nomor WhatsApp (hanya angka, pastikan diawali 62)
  let cleanPhone = (whatsappNumber || '').replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }

  // Jangan tampilkan di halaman Admin, API, atau jika nomor bot resmi belum disetting di admin
  const isHiddenRoute =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/api') ||
    !cleanPhone ||
    cleanPhone.length < 9;

  // Deteksi jika user sedang berada di halaman kota spesifik
  let currentCityName = '';
  if (pathname?.startsWith('/city/')) {
    const slug = pathname.replace('/city/', '').split('/')[0]?.toLowerCase();
    const matched = CITIES_DATA.find(c => c.slug.toLowerCase() === slug);
    if (matched) {
      currentCityName = matched.name;
    }
  }

  // Tutup widget ketika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Lock scroll body saat modal terbuka di mobile agar tidak jump/terhalang
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 640) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (isHiddenRoute) {
    return null;
  }

  const handleOpenWidget = () => {
    setIsOpen(prev => !prev);
    setHasUnreadPulse(false);
  };

  const getWaUrl = (text: string) => {
    const encoded = encodeURIComponent(text.trim());
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  };

  const handleOptionClick = (actionTitle: string) => {
    try {
      trackMetaEvent('Contact', {
        channel: 'whatsapp_official_piyetokih',
        topic: actionTitle,
        city: currentCityName || 'Nasional',
        path: pathname,
      });
    } catch {}
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    try {
      trackMetaEvent('Contact', {
        channel: 'whatsapp_official_piyetokih',
        topic: 'Custom Question',
        city: currentCityName || 'Nasional',
        path: pathname,
      });
    } catch {}

    const targetUrl = getWaUrl(customText);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setCustomText('');
    setIsOpen(false);
  };

  // 4 Pilihan Cepat Khas Mas Kidi
  const quickActions = [
    {
      id: 'presale',
      icon: Ticket,
      badge: 'Paling Diminati 🔥',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      title: 'Beli Tiket Presale & Nonton Duluan',
      desc: 'Nonton duluan sebelum 19 Nov bareng cast di bioskop kota roadshow!',
      prefill: currentCityName
        ? `Halo Mas Kidi! Mau nonton duluan sebelum 19 Nov di Kota ${currentCityName}, bisa beli tiket presale nya di mana ya? 🍿`
        : `Halo Mas Kidi! Mau nonton duluan sebelum 19 Nov, bisa beli tiket presale nya di mana ya? 🍿`,
    },
    {
      id: 'roadshow',
      icon: MapPin,
      badge: currentCityName ? `Kota ${currentCityName} 📍` : '17 Kota 📍',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: currentCityName
        ? `Jadwal Roadshow Kota ${currentCityName}`
        : 'Cek Jadwal Roadshow di Kotaku',
      desc: currentCityName
        ? `Rundown jam, temu pemain, & penukaran voucher fisik di ${currentCityName}`
        : 'Rundown sekolah, kampus, radio, meet & greet mall, & roster pemain',
      prefill: currentCityName
        ? `Halo Mas Kidi! Mau tanya jadwal lengkap Roadshow, Nonton Duluan, & booth voucher film Piye To Kih di ${currentCityName} dong!`
        : `Halo Mas Kidi! Mau tanya jadwal lengkap roadshow, temu pemain, & booth voucher di kotaku dong.`,
    },
    {
      id: 'bogo',
      icon: Gift,
      badge: 'Promo 15 Nov 🎁',
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      title: 'Info Promo Buy 1 Get 1 (BOGO)',
      desc: 'Daftar pengingat H-1 kuota 1.000 TIX ID & 500 M-TIX XXI 19 Nov',
      prefill: `Halo Mas Kidi! Mau info promo Buy 1 Get 1 (BOGO) tiket bioskop penayangan 19 November dong. Mau amankan kuota reminder WA! 🎟️`,
    },
    {
      id: 'general',
      icon: Smile,
      badge: 'Tanya Bebas 💬',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      title: 'Tanya Bebas / Ngobrol Mas Kidi',
      desc: 'Sinopsis film, pemain, OST Lek Dahlan, atau jokes santai',
      prefill: `Halo Mas Kidi! Piye kabare? Mau tanya-tanya seputar film komedi PIYE TO KIH? THE MOVIE dong lur! 😄`,
    },
  ];

  return (
    <>
      {/* 1. BACKDROP OVERLAY KHUSUS MOBILE KETIKA POPOVER DIBUKA */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm sm:bg-black/30 z-40 transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* 2. CHAT POPOVER WIDGET (MODERN DARK GLASSMORPHISM) */}
      {isOpen && (
        <div
          ref={widgetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Chat WhatsApp Resmi Piye To Kih"
          className="fixed z-50 bottom-[max(0.75rem,env(safe-area-inset-bottom,12px))] inset-x-3 sm:inset-x-auto sm:right-6 sm:bottom-24 w-auto sm:w-[380px] max-w-[420px] mx-auto sm:mx-0 flex flex-col bg-[#0E131F]/98 border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(245,158,11,0.2)] backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 max-h-[calc(100dvh-2.5rem)] sm:max-h-[min(580px,85vh)]"
          style={{ isolation: 'isolate' }}
        >
          {/* HEADER POPOVER */}
          <div className="shrink-0 relative bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-transparent p-3.5 sm:p-4 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-base shadow-md border border-amber-300/40 select-none">
                  🎭
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0E131F] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white tracking-wide">
                    Mas Kidi
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black uppercase tracking-wider">
                    Official WA Piye To Kih
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Online • Siap Bantu Tiket &amp; Jadwal
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition active:scale-95 touch-manipulation"
              aria-label="Tutup jendela chat Mas Kidi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* CHAT GREETING BUBBLE + QUICK CHOICES (SCROLLABLE BODY) */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs shrink-0 mt-0.5 border border-amber-500/30 select-none">
                🍿
              </div>
              <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-tl-sm p-3 text-xs leading-relaxed text-slate-200 shadow-inner">
                <p className="font-semibold text-amber-300 mb-1">
                  Halo, Dulur! Piye kabare?☺️
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Mau cari tiket presale nonton duluan, cek jadwal kota, atau promo Buy 1 Get 1? 
                  <strong className="text-white"> Klik pilihan di bawah ya lur ben cepet Mas Kidi jawab:</strong>
                </p>
              </div>
            </div>

            {/* 4 PILIHAN CEPAT (NATIVE ANCHOR LINKS UNTUK ANTI-BLOCK MOBILE BROWSER) */}
            <div className="space-y-2 pt-1">
              {quickActions.map(action => {
                const IconComponent = action.icon;
                const linkHref = getWaUrl(action.prefill);

                return (
                  <a
                    key={action.id}
                    href={linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleOptionClick(action.title)}
                    className="w-full text-left p-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-500/[0.12] active:bg-amber-500/20 border border-white/[0.06] hover:border-amber-500/40 transition-all duration-150 group flex items-start gap-2.5 touch-manipulation cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-400 flex items-center justify-center shrink-0 transition-colors mt-0.5 border border-amber-500/20">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {action.title}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border shrink-0 ${action.badgeColor}`}>
                          {action.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {action.desc}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* INPUT FORM PERTANYAAN CUSTOM (BOTTOM ANCHORED) */}
          <form
            onSubmit={handleCustomSubmit}
            className="shrink-0 p-2.5 sm:p-3 bg-[#080B12] border-t border-white/[0.08] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="Atau ketik pertanyaanmu di sini..."
              className="flex-1 bg-white/[0.05] border border-white/[0.1] focus:border-amber-500/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
            />
            <button
              type="submit"
              disabled={!customText.trim()}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1 transition active:scale-95 shadow-sm touch-manipulation shrink-0"
              title="Kirim ke WhatsApp Mas Kidi"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* 3. TOMBOL UTAMA STICKY / FLOATING (MOBILE-RESPONSIVE DENGAN SAFE-AREA INSET) */}
      <div
        className={`fixed z-40 select-none print:hidden pointer-events-auto transition-transform duration-200 ${
          isOpen ? 'hidden sm:block' : 'block'
        }`}
        style={{
          bottom: 'max(1rem, env(safe-area-inset-bottom, 16px))',
          right: 'max(0.75rem, env(safe-area-inset-right, 12px))',
          isolation: 'isolate',
        }}
      >
        <button
          onClick={handleOpenWidget}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_8px_30px_rgb(245,158,11,0.4)] hover:shadow-[0_12px_35px_rgb(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 border border-amber-300/60 touch-manipulation"
          aria-expanded={isOpen}
          aria-label="Buka Chat WhatsApp Resmi Piye To Kih"
        >
          {/* Avatar Icon Mas Kidi */}
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center text-xs sm:text-sm font-black shadow-inner select-none">
              🎭
            </div>
            {/* Live pulsating green dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-950" />
            </span>
          </div>

          {/* Label Teks Responsif */}
          <span className="flex items-center gap-1.5 font-black">
            <span className="text-xs sm:text-sm">Tanya Mas Kidi</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-950/20 text-[10px] font-black uppercase tracking-wider hidden sm:inline-block">
              Official WA
            </span>
          </span>

          <MessageCircle className="w-4 h-4 fill-slate-950/20 group-hover:rotate-12 transition-transform duration-200" />

          {/* Tooltip Badge jika belum pernah diklik */}
          {hasUnreadPulse && !isOpen && (
            <span className="absolute -top-3 -left-2 bg-rose-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-lg border border-white/20 animate-bounce hidden sm:inline-block select-none">
              Butuh Tiket? 💬
            </span>
          )}
        </button>
      </div>
    </>
  );
}

