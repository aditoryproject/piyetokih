import type { Metadata } from 'next';
import './globals.css';
import { cookies, headers } from 'next/headers';
import MetaPixelTracker from '@/components/MetaPixelTracker';
import Link from 'next/link';
import { Film } from 'lucide-react';
import { getDb } from '@/lib/db';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import AdminMaintenanceBanner from '@/components/AdminMaintenanceBanner';
import PublicHeader from '@/components/PublicHeader';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'PIYE TO KIH? - Official Movie & War Voucher',
  description: 'Landing page resmi film komedi bioskop Piye Toh Kih oleh Miracle Pictures. Klaim War Voucher spesial penayangan bioskop!',
  keywords: 'Piye To Kih, Miracle Pictures, Film Bioskop, War Voucher, Tiket Bioskop',
  referrer: 'strict-origin-when-cross-origin',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  const isAdmin = session.valid;

  const db = getDb();
  const isMaintenanceMode = Boolean(db.settings.isMaintenanceMode);

  // If path is under /admin, we don't render the public header
  const isAdminPath = pathname.startsWith('/admin') || pathname.includes('/admin');
  const showHeader = (!isMaintenanceMode || isAdmin) && !isAdminPath;

  return (
    <html lang="id">
      <body className="antialiased bg-[#0B0F17] text-white selection:bg-gold-500 selection:text-black">
        <MetaPixelTracker />

        {/* Banner Khusus Admin saat Mode Coming Soon Aktif */}
        {isAdmin && isMaintenanceMode && !isAdminPath && (
          <AdminMaintenanceBanner isMaintenanceMode={true} />
        )}

        {/* Cinematic Clean Header (Hanya tampil di halaman publik, tidak pernah di /admin) */}
        <PublicHeader showHeader={showHeader} />

        {/* Main Content: Selalu render children agar tidak ada rute/halaman yang terblokir */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
