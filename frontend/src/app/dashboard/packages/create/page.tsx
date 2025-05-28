'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function CreatePackagePage() {
  const [form, setForm] = useState({
    trackingNumber: '',
    sender: '',
    receiver: '',
    destination: '',
    status: 'PENDING',
    weight: '',
    dimensions: '',
  })

  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const { trackingNumber, sender, receiver, destination, status } = form
    if (!trackingNumber || !sender || !receiver || !destination || !status) {
      return 'Please fill in all required fields.'
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setSuccess('')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:8080/api/packages', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSuccess('✅ Package created successfully.')
      setError('')
      setForm({
        trackingNumber: '',
        sender: '',
        receiver: '',
        destination: '',
        status: 'PENDING',
        weight: '',
        dimensions: '',
      })
      setTimeout(() => router.push('/dashboard/packages'), 1500)
    } catch (err: any) {
      const backendMsg = err.response?.data?.message
      if (backendMsg?.includes('already exists')) {
        setError('Tracking number already exists.')
      } else {
        setError(backendMsg || 'Failed to create package.')
      }
      setSuccess('')
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg border border-[#a26c0c]">
      <h2 className="text-2xl font-bold mb-6 text-[#331b14]">Create New Package</h2>
      {error && <p className="text-red-600 font-medium mb-4">{error}</p>}
      {success && <p className="text-green-600 font-medium mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="trackingNumber"
          placeholder="Tracking Number *"
          value={form.trackingNumber}
          onChange={handleChange}
          className="text-black w-full p-2 border rounded border-[#fab308]"
          required
        />
        <input
          type="text"
          name="sender"
          placeholder="Sender Name *"
          value={form.sender}
          onChange={handleChange}
          className="text-black w-full p-2 border rounded border-[#fab308]"
          required
        />
        <input
          type="text"
          name="receiver"
          placeholder="Receiver Name *"
          value={form.receiver}
          onChange={handleChange}
          className="text-black w-full p-2 border rounded border-[#fab308]"
          required
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination *"
          value={form.destination}
          onChange={handleChange}
          className="text-black w-full p-2 border rounded border-[#fab308]"
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="text-black w-full p-2 border rounded border-[#fab308]"
          required
        >
          <option value="PENDING">Pending</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
        </select>
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={handleChange}
          className="text-black w-full p-2 border rounded border-[#fab308]"
        />
        <input
          type="text"
          name="dimensions"
          placeholder="Dimensions (e.g., 10x20x30 cm)"
          value={form.dimensions}
          onChange={handleChange}
          className="text-black w-full p-2 border rounded border-[#fab308]"
        />

        <button
          type="submit"
          className="text-black w-full bg-[#fab308] hover:bg-[#a26c0c] text-[#331b14] font-semibold py-2 rounded shadow-md transition"
        >
          Create Package
        </button>
      </form>
    </div>
  )
}
