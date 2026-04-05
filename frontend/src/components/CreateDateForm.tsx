'use client';

import { axios } from '@/lib/axios';
import { useState, FormEvent } from 'react';

interface CreateDateFormProps {
  onDateCreated: (date: DateItem) => void;
}

interface CreateDateResponse {
  message: string;
  data: DateItem;
}

interface DateItem {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  user: {
    id: number;
    name: string;
  };
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split('; ');

  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');

    if (key === name) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

export default function CreateDateForm({ onDateCreated }: CreateDateFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {

      const payload = {
        title, description, is_public: isPublic
      }

      const res = await axios.post<CreateDateResponse>('/api/dates', payload);


      onDateCreated(res.data.data);
      setTitle('');
      setDescription('');
      setIsPublic(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create date');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border border-sky-300 rounded-xl">
      <h2 className="font-bold text-lg mb-2">Create New Date</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="p-2 border rounded"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={e => setIsPublic(e.target.checked)}
        />
        Public
      </label>
      <button
        type="submit"
        disabled={loading}
        className="bg-sky-500 text-white p-2 rounded hover:bg-sky-600 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Date'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
