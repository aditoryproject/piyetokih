'use client';

import React from 'react';
import AdminLoginForm from '@/components/AdminLoginForm';

export default function AdminLoginPage() {
  return <AdminLoginForm onSuccess={() => { window.location.href = '/admin'; }} />;
}

