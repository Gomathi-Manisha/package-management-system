'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiMenu } from 'react-icons/fi';
import Link from 'next/link';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');         // Expire token
    router.push('/');                         // Redirect to home
  };

  const navItems = [
    { name: 'Packages', href: '/dashboard/packages' },
    { name: 'Create Package', href: '/dashboard/packages/create' },
    { name: 'Reports', href: '/dashboard/reports' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-[#fab308] text-[#0f0414] shadow fixed top-0 left-0 w-full z-50">
        <h1 className="text-lg font-bold">UPS Dashboard</h1>
        <button onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#331b14] text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static transition-transform duration-300 ease-in-out`}
      >
        <div className="px-6 py-6 text-xl font-bold bg-[#fab308] text-[#0f0414]">
          UPS Management
        </div>

        <ul className="mt-4 space-y-2 px-4 pb-20">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-2 rounded-lg ${
                  pathname === item.href
                    ? 'bg-[#fab308] text-[#0f0414]'
                    : 'hover:bg-[#5d3d14]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full px-4 mb-4">
          <button
            className="block w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-center"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
