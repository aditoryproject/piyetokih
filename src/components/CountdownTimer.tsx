'use client';

import React, { useEffect, useState } from 'react';
import { Timer, Flame } from 'lucide-react';

interface CountdownTimerProps {
  targetDate?: string;
}

export default function CountdownTimer({ targetDate = '2026-10-22T13:00:00+07:00' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const target = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!isClient) {
    return (
      <div className="h-20 w-full animate-pulse bg-gray-900/60 rounded-2xl border border-gold-500/20" />
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-gradient-to-br from-cinema-card/90 via-black/80 to-cinema-card/90 border border-gold-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-gold-400 font-bold text-xs sm:text-sm tracking-wider uppercase">
          <Flame className="w-4 h-4 text-red-500 animate-bounce" />
          <span>Batas Waktu War Voucher</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>Segera Berakhir!</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        <div className="bg-black/60 border border-white/10 rounded-xl p-2 sm:p-3 shadow-inner">
          <span className="block text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold">Hari</span>
        </div>
        <div className="bg-black/60 border border-white/10 rounded-xl p-2 sm:p-3 shadow-inner">
          <span className="block text-2xl sm:text-4xl font-extrabold text-gold-400 font-mono tracking-tight">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold">Jam</span>
        </div>
        <div className="bg-black/60 border border-white/10 rounded-xl p-2 sm:p-3 shadow-inner">
          <span className="block text-2xl sm:text-4xl font-extrabold text-gold-400 font-mono tracking-tight">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold">Menit</span>
        </div>
        <div className="bg-black/60 border border-red-500/30 rounded-xl p-2 sm:p-3 shadow-inner relative overflow-hidden">
          <span className="block text-2xl sm:text-4xl font-extrabold text-red-500 font-mono tracking-tight animate-pulse">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold">Detik</span>
        </div>
      </div>
    </div>
  );
}
