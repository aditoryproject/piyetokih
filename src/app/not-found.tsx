import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <h2 className="text-3xl font-black text-white mb-2">404 - Halaman Tidak Ditemukan</h2>
      <p className="text-slate-400 text-sm mb-6 max-w-md">
        Halaman yang Anda tuju tidak ditemukan atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  );
}
