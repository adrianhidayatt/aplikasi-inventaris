// File: app/auth/update-password/page.tsx
'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleUpdatePassword = async () => {
    setMessage('');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Password Anda berhasil diupdate! Anda akan diarahkan ke halaman login.');
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-900">Buat Password Baru</h1>
        {message && <p className="text-center text-sm p-3 rounded-md bg-green-50 text-green-700">{message}</p>}
        <div className="space-y-4">
          <div>
            <label htmlFor="password">Password Baru</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button onClick={handleUpdatePassword} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            Simpan Password Baru
          </button>
        </div>
      </div>
    </main>
  );
}