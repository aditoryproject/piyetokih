'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, LogOut, Home, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error('Admin Dashboard caught error:', error);
  }, [error]);

  const handleLogoutAndReset = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {}
    // Clear cookies explicitly on client side
    document.cookie = 'ptk_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
      <div className="w-full max-w-md bg-[#121826] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h1 className="text-xl font-black text-white tracking-tight mb-2">
          Terjadi Kendala Memuat Dashboard
        </h1>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Sistem mendeteksi kendala pada antarmuka admin. Silakan muat ulang atau reset sesi login untuk melanjutkan.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Muat Ulang Halaman</span>
          </button>

          <button
            onClick={handleLogoutAndReset}
            className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700/80 active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Reset Sesi &amp; Login Ulang</span>
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 pt-2 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Utama</span>
          </a>
        </div>

        {/* Technical Details Toggle */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-left">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-[11px] font-medium text-slate-500 hover:text-slate-400"
          >
            <span>Detail Diagnostik Teknis</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-red-400 overflow-x-auto max-h-40 whitespace-pre-wrap break-words">
              {error?.message || 'Unknown error'}
              {error?.digest ? `\nDigest: ${error.digest}` : ''}
              {error?.stack ? `\n\n${error.stack}` : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
