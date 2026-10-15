'use client';

import React from 'react';
import { Ticket, Users, Flame, Zap, ShieldCheck } from 'lucide-react';

interface QuotaProgressProps {
  totalQuota: number;
  remainingStock: number;
  cityName?: string;
}

export default function QuotaProgress({ totalQuota, remainingStock, cityName }: QuotaProgressProps) {
  const safeTotal = Math.max(1, totalQuota || 500);
  const safeRemaining = Math.max(0, remainingStock !== undefined ? remainingStock : safeTotal);
  const claimed = Math.max(0, safeTotal - safeRemaining);
  const percentage = Math.min(100, Math.round((claimed / safeTotal) * 100));

  const isLowStock = safeRemaining <= safeTotal * 0.25 || safeRemaining < 50;

  return (
    <div className="w-full max-w-xl mx-auto relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#182133] via-[#0E1522] to-[#0A0D14] p-5 sm:p-7 shadow-2xl backdrop-blur-md">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Urgency Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          </span>
          <div>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-400 block">
              STATUS KUOTA VOUCHER {cityName ? `• KOTA ${cityName.toUpperCase()}` : ''}
            </span>
            <span className="text-[10px] text-slate-400">
              Sistem Klaim E-Voucher Terverifikasi
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] sm:text-xs font-bold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          <span>{isLowStock ? 'KUOTA MENIPIS!' : 'SEGERA HABIS!'}</span>
        </div>
      </div>

      {/* Main Metric Showcase */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <span className="text-xs text-slate-400 block font-medium mb-1">
            Sisa Tiket Voucher Tersedia
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              {safeRemaining.toLocaleString('id-ID')}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-semibold">
              / {safeTotal.toLocaleString('id-ID')} Voucher
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold text-xs sm:text-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{percentage}% TERKLAIM</span>
          </div>
        </div>
      </div>

      {/* Dynamic Animated Progress Bar */}
      <div className="space-y-1.5 mb-4">
        <div className="w-full h-3.5 bg-black/80 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            style={{ width: `${Math.max(4, percentage)}%` }}
          />
        </div>
      </div>

      {/* Social Proof & Trust Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span><strong className="text-white font-bold">{claimed.toLocaleString('id-ID')}</strong> penonton telah mengamankan voucher</span>
        </span>
        <span className="flex items-center gap-1 text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Siapa cepat dia dapat</span>
        </span>
      </div>
    </div>
  );
}
