'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';                // your axios instance with JWT interceptor
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

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

export default function PackageListPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters / search state
  const [searchTN, setSearchTN] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL'|'PENDING'|'IN_TRANSIT'|'DELIVERED'>('ALL');

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPackage, setEditPackage] = useState<Package|null>(null);

  // Fetch either all, filtered or single
  /*const fetchPackages = async () => {
    setLoading(true);
    try {
      let data: Package[] = [];
      if (searchTN.trim()) {
        // exact match by trackingNumber
        const res = await api.get<Package>(`/api/packages/${encodeURIComponent(searchTN.trim())}`);
        data = [res.data];
      } else {
        // filter by status or all
        const statusQuery = filterStatus !== 'ALL' ? `?status=${filterStatus}` : '';
        const res = await api.get<Package[]>(`/api/packages/search${statusQuery}`);
        data = res.data;
      }
      setPackages(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setPackages([]);
      } else {
        toast.error('Failed to fetch packages');
      }
    } finally {
      setLoading(false);
    }
  };*/

  const fetchPackages = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    let data: Package[] = [];

    if (searchTN.trim()) {
      const res = await api.get<Package>(
        `/api/packages/${encodeURIComponent(searchTN.trim())}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      data = [res.data];
    } else {
      const statusQuery = filterStatus !== 'ALL' ? `?status=${filterStatus}` : '';
      const res = await api.get<Package[]>(
        `/api/packages/search${statusQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      data = res.data;
    }

    setPackages(data);
  } catch (err: any) {
    if (err.response?.status === 404) {
      setPackages([]);
    } else {
      toast.error('Failed to fetch packages');
    }
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSearchFilter = () => {
    fetchPackages();
  };

  const handleDelete = async (id: number) => {
  try {
    const token = localStorage.getItem('token');
    await api.delete(`/api/packages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Package deleted');
    fetchPackages();
  } catch {
    toast.error('Delete failed');
  }
};

/*
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/packages/${id}`);
      toast.success('Package deleted');
      fetchPackages();
    } catch {
      toast.error('Delete failed');
    }
  };
*/
const handleEditSave = async () => {
  if (!editPackage) return;
  try {
    const token = localStorage.getItem('token');
    await api.put(`/api/packages/${editPackage.id}`, editPackage, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Package updated');
    setEditDialogOpen(false);
    setEditPackage(null);
    fetchPackages();
  } catch {
    toast.error('Update failed');
  }
};
/*
  const handleEditSave = async () => {
    if (!editPackage) return;
    try {
      await api.put(`/api/packages/${editPackage.id}`, editPackage);
      toast.success('Package updated');
      setEditDialogOpen(false);
      setEditPackage(null);
      fetchPackages();
    } catch {
      toast.error('Update failed');
    }
  };*/

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#331b14]">📦 Package Management</h2>

      {/* Search & Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Search by Tracking #"
          value={searchTN}
          onChange={e => setSearchTN(e.target.value)}
          className="bg-cyan-50 flex-1 border-[#fab308]"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="p-2 bg-amber-300 border border-[#fab308] rounded"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
        </select>
        <Button
          className="bg-[#fab308] hover:bg-[#a26c0c] text-white"
          onClick={handleSearchFilter}
        >
          Search / Filter
        </Button>
      </div>

      {loading ? (
        <p className="text-[#331b14]">Loading…</p>
      ) : packages.length === 0 ? (
        <p className="text-gray-500">No packages found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {packages.map(pkg => (
            <Card key={pkg.id} className="bg-[#fef7e5] border border-[#a26c0c] shadow">
              <CardContent className="p-4 text-[#331b14] space-y-1">
                <p><strong>Tracking #:</strong> {pkg.trackingNumber}</p>
                <p><strong>Sender:</strong> {pkg.sender}</p>
                <p><strong>Receiver:</strong> {pkg.receiver}</p>
                <p><strong>Destination:</strong> {pkg.destination}</p>
                <p><strong>Status:</strong> {pkg.status}</p>
                <p><strong>Weight:</strong> {pkg.weight ?? 'N/A'} kg</p>
                <p><strong>Dimensions:</strong> {pkg.dimensions ?? 'N/A'}</p>
                <div className="flex gap-3 mt-4">
                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-[#fab308] hover:bg-[#a26c0c] text-white"
                        onClick={() => {
                          setEditPackage(pkg);
                          setEditDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Package</DialogTitle>
                      </DialogHeader>
                      {editPackage && (
                        <div className="space-y-2">
                          <Label>Sender</Label>
                          <Input
                            value={editPackage.sender}
                            onChange={e =>
                              setEditPackage(prev => ({ ...prev!, sender: e.target.value }))
                            }
                          />
                          <Label>Receiver</Label>
                          <Input
                            value={editPackage.receiver}
                            onChange={e =>
                              setEditPackage(prev => ({ ...prev!, receiver: e.target.value }))
                            }
                          />
                          <Label>Destination</Label>
                          <Input
                            value={editPackage.destination}
                            onChange={e =>
                              setEditPackage(prev => ({ ...prev!, destination: e.target.value }))
                            }
                          />
                          <Label>Status</Label>
                          <select
                            className="w-full border p-2 rounded"
                            value={editPackage.status}
                            onChange={e =>
                              setEditPackage(prev => ({
                                ...prev!,
                                status: e.target.value as Package['status'],
                              }))
                            }
                          >
                            <option value="PENDING">Pending</option>
                            <option value="IN_TRANSIT">In Transit</option>
                            <option value="DELIVERED">Delivered</option>
                          </select>
                          <Label>Weight</Label>
                          <Input
                            type="number"
                            value={editPackage.weight ?? ''}
                            onChange={e =>
                              setEditPackage(prev => ({
                                ...prev!,
                                weight: parseFloat(e.target.value),
                              }))
                            }
                          />
                          <Label>Dimensions</Label>
                          <Input
                            value={editPackage.dimensions ?? ''}
                            onChange={e =>
                              setEditPackage(prev => ({
                                ...prev!,
                                dimensions: e.target.value,
                              }))
                            }
                          />
                        </div>
                      )}
                      <DialogFooter className="pt-4">
                        <Button
                          className="bg-[#fab308] hover:bg-[#a26c0c] text-white"
                          onClick={handleEditSave}
                        >
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleDelete(pkg.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
