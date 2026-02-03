'use client';

import { useRequireAuth } from '@/hooks/useAuth';
import { Header, DashboardContent } from '@/components/layout/Header';

export default function DashboardPage() {
  const { isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardContent />
    </div>
  );
}