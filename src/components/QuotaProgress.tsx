'use client';

import React from 'react';
import { Ticket, Users } from 'lucide-react';

interface QuotaProgressProps {
  totalQuota: number;
  remainingStock: number;
}

export default function QuotaProgress({ totalQuota, remainingStock }: QuotaProgressProps) {
  const claimed = Math.max(0, totalQuota - remainingStock);
  const percentage = Math.min(100, Math.round((claimed / totalQuota) * 100));

  return (
    <div className="w-full max-w-xl mx-auto bg-cinema-card/80 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-gold-400" />
          <span className="text-xs sm:text-sm font-bold text-gray-200">
            Sisa Kuota War Voucher
          </span>
        </div>
        <div className="text-right">
          <span className="text-base sm:text-xl font-extrabold text-red-400">
            Tersisa {remainingStock}
          </span>
          <span className="text-xs text-gray-400"> / {totalQuota} Voucher</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-black/70 rounded-full overflow-hidden p-0.5 border border-white/10">
        <div
          className="h-full bg-gradient-to-r from-gold-500 via-orange-500 to-red-600 rounded-full transition-all duration-700 ease-out shadow-lg"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-2 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3 text-gold-400" />
          {claimed} orang sudah mengklaim
        </span>
        <span className="text-gold-400 font-semibold">{percentage}% Terisi</span>
      </div>
    </div>
  );
}
