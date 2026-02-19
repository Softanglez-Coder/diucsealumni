import { redirect } from 'next/navigation';

import { PortalShell } from '@/components/layout/portal-shell';
import { getServerSession } from '@/lib/auth-server';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <PortalShell>{children}</PortalShell>;
}
