"use client";

import { EncyclopediaProvider } from '@/context/EncyclopediaContext';
import AdminGuard from '@/components/Admin/AdminGuard';

export default function EncyclopediaAdminLayout({ children }) {
  return (
    <AdminGuard>
      <EncyclopediaProvider>
        {children}
      </EncyclopediaProvider>
    </AdminGuard>
  );
}
