'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Package {
  id: number;
  trackingNumber: string;
  sender: string;
  receiver: string;
  destination: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
  weight?: number;
  dimensions?: string;
}

interface Summary {
  totalPackages: number;
  deliveredPackages: number;
  pendingPackages: number;
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [report, setReport] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  //JWT-protected fetch for summary
  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get<Summary>('/api/packages/summary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSummary(res.data);
    } catch {
      toast.error('Failed to load summary');
    }
  };

  //JWT-protected fetch for full report
  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get<Package[]>('/api/packages/report', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReport(res.data);
    } catch {
      toast.error('Failed to load report');
    }
  };

  useEffect(() => {
    Promise.all([fetchSummary(), fetchReport()]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6">Loading reports…</p>;
  }

  const downloadCSV = () => {
    if (!report.length) return;

    const headers = [
      'Tracking Number',
      'Sender',
      'Receiver',
      'Destination',
      'Status',
      'Weight (kg)',
      'Dimensions',
    ];

    const rows = report.map(pkg => [
      pkg.trackingNumber,
      pkg.sender,
      pkg.receiver,
      pkg.destination,
      pkg.status,
      pkg.weight?.toString() ?? '',
      pkg.dimensions ?? '',
    ]);

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `package_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#331b14]">📊 Package Reports</h2>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#fab308]/20 border-[#fab308]">
            <CardContent className="text-center">
              <p className="text-lg font-semibold">Total Packages</p>
              <p className="text-3xl font-bold">{summary.totalPackages}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#a26c0c]/20 border-[#a26c0c]">
            <CardContent className="text-center">
              <p className="text-lg font-semibold">Delivered</p>
              <p className="text-3xl font-bold">{summary.deliveredPackages}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#331b14]/20 border-[#331b14]">
            <CardContent className="text-center">
              <p className="text-lg font-semibold">Pending</p>
              <p className="text-3xl font-bold">{summary.pendingPackages}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-[#fab308]/30 text-[#331b14]">
            <tr>
              <th className="px-4 py-2 border">Tracking #</th>
              <th className="px-4 py-2 border">Sender</th>
              <th className="px-4 py-2 border">Receiver</th>
              <th className="px-4 py-2 border">Destination</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Weight (kg)</th>
              <th className="px-4 py-2 border">Dimensions</th>
            </tr>
          </thead>
          <tbody>
            {report.map((pkg) => (
              <tr key={pkg.id} className="odd:bg-gray-50">
                <td className="px-4 py-2 border">{pkg.trackingNumber}</td>
                <td className="px-4 py-2 border">{pkg.sender}</td>
                <td className="px-4 py-2 border">{pkg.receiver}</td>
                <td className="px-4 py-2 border">{pkg.destination}</td>
                <td className="px-4 py-2 border">{pkg.status}</td>
                <td className="px-4 py-2 border">{pkg.weight ?? '-'}</td>
                <td className="px-4 py-2 border">{pkg.dimensions ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        className="bg-[#fab308] hover:bg-[#a26c0c] text-white"
        onClick={downloadCSV}
      >
        Download CSV
      </Button>
    </div>
  );
}
