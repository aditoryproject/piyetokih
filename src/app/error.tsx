'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121826] border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-bold text-white mb-2">Terjadi Kendala Memuat Halaman</h1>
        <p className="text-xs text-slate-400 mb-6">
          Halaman sedang mengalami kendala sementara. Silakan coba muat ulang halaman.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Muat Ulang Halaman</span>
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white pt-2 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </a>
        </div>
      </div>
    </div>
  );
}
