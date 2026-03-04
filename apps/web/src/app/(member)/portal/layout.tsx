import { PortalAuthGuard } from '@/components/auth/portal-auth-guard';
import { PortalShell } from '@/components/layout/portal-shell';

/**
 * Layout for all /portal/** routes.
 *
 * Auth is enforced client-side by PortalAuthGuard, which transparently
 * restores the session from the HttpOnly refresh-token cookie on page refresh
 * without relying on a server-side cookie check that can fail across ports in
 * development (cookie set by localhost:4000 might not always be forwarded to
 * the Next.js server at localhost:3000 by all browsers/environments).
 */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalAuthGuard>
      <PortalShell>{children}</PortalShell>
    </PortalAuthGuard>
  );
}
