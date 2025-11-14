"use client";

import { EncyclopediaProvider } from '@/context/EncyclopediaContext';

export default function EncyclopediaAdminLayout({ children }) {
  return (
    <EncyclopediaProvider>
      {children}
    </EncyclopediaProvider>
  );
}
