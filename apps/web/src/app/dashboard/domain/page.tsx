'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui';

export default function DomainPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/settings?tab=domain');
  }, [router]);

  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center space-x-3">
        <Spinner size="sm" />
        <span className="text-xs font-semibold text-slate-700">Redirecting to Domain Settings...</span>
      </div>
    </div>
  );
}
