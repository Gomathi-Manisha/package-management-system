// src/components/layout/Header.tsx
'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[#fab308] text-[#0f0414] px-6 py-2 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">Welcome to UPS Package Management</div>
      <Image src="/ups-logo.png" alt="UPS Logo" width={50} height={50} />
    </header>
  );
}
