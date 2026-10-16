'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    question: 'Kode Booking itu tiket?',
    answer:
      'Bukan. Kode booking adalah bukti registrasi antrean kuota untuk mendapatkan voucher fisik di booth roadshow. Kode booking bukan tiket masuk bioskop dan bukan bukti pembayaran.',
  },
  {
    question: 'Voucher bisa langsung dipakai saat roadshow?',
    answer:
      'Tidak. Voucher fisik yang Anda bayar & ambil di booth roadshow berlaku untuk penayangan umum/serentak mulai tanggal 19–20 November 2026 di seluruh jaringan bioskop mitra.',
  },
  {
    question: 'Special Screening dan Voucher sama?',
    answer:
      'Berbeda. Special Screening adalah sesi nonton duluan bersama para pemain film di tanggal roadshow kota ini dan tiketnya dibeli via loket/aplikasi resmi bioskop (XXI / Cinépolis / CGV / Platinum / NSC). Sedangkan Voucher adalah voucher fisik promo untuk penayangan serentak 19–20 November.',
  },
  {
    question: 'Di mana saya membeli tiket Special Screening?',
    answer:
      'Tiket Special Screening dibeli langsung melalui platform ticketing resmi bioskop mitra terkait (seperti aplikasi M-Tix XXI, Cinépolis App, CGV App) atau langsung di loket kasir bioskop pada hari H.',
  },
];

export default function CityFaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq-roadshow" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-amber-400 flex items-center justify-center gap-1.5 mb-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>TANYA JAWAB</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase mb-2">
          FAQ SINGKAT ROADSHOW &amp; VOUCHER
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Jawaban jelas agar kamu tidak bingung membedakan tiket nonton duluan dan voucher.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQ_LIST.map((item, idx) => {
          const isOpen = openIdx === idx;

          return (
            <div
              key={idx}
              className="bg-[#121620] border border-white/10 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all shadow-md"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-amber-300 transition-colors"
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 animate-fade-in">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
