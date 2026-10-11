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
    claimedAt: string;
  } | null>(null);

  const [validityText, setValidityText] = useState('19 - 22 November 2026 (Penayangan Perdana)');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch settings for validity text
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings?.voucherValidDatesText) {
          setValidityText(d.settings.voucherValidDatesText);
        }
      })
      .catch(() => {});

    if (!serial) return;

    fetch(`/api/admin/leads?search=${serial}`)
      .then(r => r.json())
      .then(data => {
        if (data.leads && data.leads.length > 0) {
          const found = data.leads.find((l: any) => l.serialNumber === serial);
          if (found) {
            setLead(found);
          } else {
            setLead({
              serialNumber: String(serial),
              name: 'Penonton Setia Piye Toh Kih',
              phone: 'Terverifikasi',
              cityLocation: 'Nasional',
              claimedAt: new Date().toLocaleDateString('id-ID'),
            });
          }
        } else {
          setLead({
            serialNumber: String(serial),
            name: 'Penonton Setia Piye Toh Kih',
            phone: 'Terverifikasi',
            cityLocation: 'Nasional',
            claimedAt: new Date().toLocaleDateString('id-ID'),
          });
        }
      })
      .catch(() => {
        setLead({
          serialNumber: String(serial),
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
              E-VOUCHER NONTON RESMI
            </h1>
            <p className="text-xs text-amber-300 font-bold mt-1">
              Voucher dapat ditukarkan di bioskop kesayangan Anda saat periode penayangan.
            </p>
          </div>

          <VoucherTicketCard
            serialNumber={lead.serialNumber}
            name={lead.name}
            phone={lead.phone}
            cityLocation={lead.cityLocation}
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
