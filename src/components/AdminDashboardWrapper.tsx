'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AdminDashboardClient = dynamic(() => import('@/components/AdminDashboardClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col items-center justify-center p-4">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-sm font-bold text-slate-300">Memuat Dashboard Administrator...</p>
      <p className="text-xs text-slate-500 mt-1">Mengamankan sesi &amp; menyinkronkan data film</p>
    </div>
  ),
});

export default function AdminDashboardWrapper() {
  return <AdminDashboardClient />;
}
