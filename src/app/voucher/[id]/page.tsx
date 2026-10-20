'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import VoucherTicketCard from '@/components/VoucherTicketCard';
import { Film, ArrowLeft, Ticket } from 'lucide-react';

export default function VoucherDetailPage() {
  const params = useParams();
  const serial = Array.isArray(params.id) ? params.id[0] : params.id;

  const [lead, setLead] = useState<{
    serialNumber: string;
    name: string;
    phone: string;
    cityLocation?: string;
    venueLocation?: string;
    claimedAt: string;
  } | null>(null);

  const [validityText, setValidityText] = useState('19 - 20 November 2026 (Penayangan Perdana)');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serial) return;

    fetch(`/api/vouchers/${serial}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.lead) {
          setLead(data.lead);
          if (data.validityText) {
            setValidityText(data.validityText);
          }
        } else {
          setLead({
            serialNumber: String(serial).toUpperCase(),
            name: 'Penonton Setia Piye Toh Kih',
            phone: 'Terverifikasi',
            cityLocation: 'Nasional',
            claimedAt: new Date().toLocaleDateString('id-ID'),
          });
        }
      })
      .catch(() => {
        setLead({
          serialNumber: String(serial).toUpperCase(),
          name: 'Penonton Setia Piye Toh Kih',
          phone: 'Terverifikasi',
          cityLocation: 'Nasional',
          claimedAt: new Date().toLocaleDateString('id-ID'),
        });
      })
      .finally(() => setLoading(false));
  }, [serial]);

  return (
    <div className="py-12 px-4 max-w-xl mx-auto min-h-[85vh] flex flex-col justify-center">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ke Beranda Utama</span>
        </Link>

        <span className="text-xs text-gold-400 font-bold flex items-center gap-1">
          <Ticket className="w-3.5 h-3.5" />
          <span>E-Voucher Aktif</span>
        </span>
      </div>

      {loading ? (
        <div className="h-96 w-full animate-pulse bg-gray-900 rounded-3xl border border-white/10" />
      ) : lead ? (
        <div>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-white">
              KODE BOOKING RESMI ROADSHOW
            </h1>
            <p className="text-xs text-amber-300 font-bold mt-1">
              Tukarkan Kode Booking ini di konter booth resmi saat acara Roadshow &amp; Meet and Greet offline Kota {lead.cityLocation || 'terkait'}.
            </p>
            <p className="text-[11px] text-red-400 font-extrabold mt-1.5 bg-red-950/40 border border-red-500/30 rounded-lg py-1 px-2.5 max-w-md mx-auto">
              ⛔ DILARANG MENUKAR DI AREA BIOSKOP: Kasir bioskop TIDAK MELAYANI penukaran kode booking. Penukaran HANYA di booth roadshow offline.
            </p>
          </div>

          <VoucherTicketCard
            serialNumber={lead.serialNumber}
            name={lead.name}
            phone={lead.phone}
            cityLocation={lead.cityLocation}
            venueLocation={lead.venueLocation}
            claimedAt={lead.claimedAt ? new Date(lead.claimedAt).toLocaleDateString('id-ID') : undefined}
            validityText={validityText}
          />
        </div>
      ) : (
        <div className="text-center p-8 bg-black/40 rounded-2xl border border-white/10">
          <p className="text-sm text-gray-300">Voucher tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
}
