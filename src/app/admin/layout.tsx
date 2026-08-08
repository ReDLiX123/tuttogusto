import React from 'react';
import { AdminAuthGuard } from '@/presentation/components/admin/AdminAuthGuard';

export const metadata = {
  title: 'Панель Администратора | Туттогусто',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
