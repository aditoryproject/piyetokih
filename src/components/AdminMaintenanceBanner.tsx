'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Settings, Eye, CheckCircle, Power } from 'lucide-react';

interface AdminMaintenanceBannerProps {
  isMaintenanceMode: boolean;
}

export default function AdminMaintenanceBanner({ isMaintenanceMode }: AdminMaintenanceBannerProps) {
  const [active, setActive] = useState(isMaintenanceMode);
  const [loading, setLoading] = useState(false);

  if (!active) return null;

  const handleToggleOff = async () => {
    if (!confirm('Apakah Anda yakin ingin mematikan Mode Coming Soon dan mempublikasikan website secara penuh ke publik?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isMaintenanceMode: false }),
      });
      if (res.ok) {
        setActive(false);
        window.location.reload();
      } else {
        alert('Gagal memperbarui status. Buka menu Admin Dashboard untuk mengubahnya.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside aria-label="Status Mode Administrator" className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-slate-950 font-bold px-4 py-2 shadow-xl border-b border-amber-400/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-black/20 text-white">
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
          </span>
          <span className="text-white font-extrabold uppercase tracking-wide">
            MODE COMING SOON AKTIF:
          </span>
          <span className="text-amber-100 hidden sm:inline font-medium">
            Pengunjung umum hanya melihat halaman Coming Soon. Anda melihat halaman ini sebagai <b>Admin (Preview Mode)</b>.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-white font-bold text-[11px] transition"
          >
            <Settings className="w-3 h-3 text-amber-300" />
            <span>Dashboard Admin</span>
          </Link>

          <button
            onClick={handleToggleOff}
            disabled={loading}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-black text-[11px] transition shadow disabled:opacity-50"
            title="Publikasikan Website Sekarang"
          >
            <Power className="w-3 h-3" />
            <span>{loading ? 'Menyimpan...' : 'Go Live (Matikan)'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
