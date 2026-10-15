import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import AdminDashboardWrapper from '@/components/AdminDashboardWrapper';
import AdminLoginForm from '@/components/AdminLoginForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session.valid) {
    return <AdminLoginForm />;
  }

  return <AdminDashboardWrapper />;
}
