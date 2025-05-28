'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const publicRoutes = ['/auth/login', '/auth/register'];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublic = publicRoutes.includes(pathname);

    if (!token && !isPublic) {
      router.push('/auth/login');
    }

    if (token && isPublic) {
      router.push('/dashboard/packages');
    }
  }, [token, pathname, router]);

  return <>{children}</>;
}
