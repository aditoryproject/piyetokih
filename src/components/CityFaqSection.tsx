'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    question: '“Kode Booking ini udah jadi tiket belum?”',
    answer:
      'Belum. Kode Booking cuma buat booking Voucher Fisik. Bawa kode vouchernya ke booth PIYE TO KIH?, lakukan pembayaran, lalu ambil voucher fisikmu.',
  },
  {
    question: '“Vouchernya bisa langsung dipakai pas roadshow?”',
    answer:
      'Belum bisa. Voucher yang kamu ambil saat roadshow hanya bisa dipakai untuk nonton Film PIYE TO KIH? tanggal 19–20 November 2026.',
  },
  {
    question: '“Tiket Nonton Duluan sama Voucher itu beda, ya?”',
    answer:
      'Beda. Tiket Nonton Duluan adalah tiket Special Screening di kota roadshow sebelum 19 November. Voucher dipakai untuk penayangan 19–20 November.',
  },
  {
    question: '“Kalau mau Nonton Duluan, beli tiketnya di mana?”',
    answer:
      'Pilih bioskop di halaman ini, lalu klik Nonton Duluan. Kamu akan diarahkan ke platform ticketing resmi sesuai bioskop yang kamu pilih.',
  },
  {
    question: '“Kalau udah punya kode booking, tinggal datang aja?”',
    answer:
      'Iya. Tunjukkan Kode Booking di booth PIYE TO KIH?, bayar Rp10.000/voucher, lalu ambil Voucher Fisikmu.',
  },
  {
    question: '“Kalau gak booking online, masih bisa beli voucher di booth?”',
    answer:
      'Bisa, selama voucher masih tersedia. Tapi kalau sudah punya Kode Booking, proses di booth jadi lebih praktis.',
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
        <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-amber-400 block mb-1.5">
          [ FAQ ] TANYA JAWAB ROADSHOW
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
