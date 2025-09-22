// File: app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

// Komponen kecil untuk ikon SVG Google agar lebih rapi
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.218,44,30.668,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

export default function LoginPage() {
  const [view, setView] = useState<'sign-in' | 'sign-up' | 'forgot-password'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setMessage('Error: ' + error.message); } 
    else { setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk mengklik link aktivasi.'); }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage('Error: ' + error.message);
      setLoginAttempts(prev => prev + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/update-password`,
    });
    if (error) { setMessage('Error: ' + error.message); }
    else { setMessage('Link untuk reset password telah dikirim ke email Anda.'); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-1 space-y-6">
        <div className="flex justify-center">
          <Image src="/toko gemilang logo remove bg.png" alt="TB. GEMILANG INVENTORY" width={50} height={50} className="rounded-full" />
        </div>
        
        {view !== 'forgot-password' && (
          <div className="flex border-b-2 border-gray-200">
            <button onClick={() => setView('sign-in')} className={`w-1/2 py-4 text-center font-semibold transition-colors duration-300 ${view === 'sign-in' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}>Sign In</button>
            <button onClick={() => setView('sign-up')} className={`w-1/2 py-4 text-center font-semibold transition-colors duration-300 ${view === 'sign-up' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}>Sign Up</button>
          </div>
        )}

        <div>
          {view === 'sign-in' && (
            <form onSubmit={handleSignIn} className="space-y-6">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              {loginAttempts >= 3 && (
                <div className="text-right">
                  <button type="button" onClick={() => setView('forgot-password')} className="text-sm text-indigo-600 hover:underline">Lupa Password?</button>
                </div>
              )}
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">Sign In</button>
            </form>
          )}
          {view === 'sign-up' && (
            <form onSubmit={handleSignUp} className="space-y-6">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              <input type="password" placeholder="Password (minimal 6 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">Sign Up</button>
            </form>
          )}
          {view === 'forgot-password' && (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <h2 className="text-xl font-semibold text-center text-gray-800">Lupa Password</h2>
              <p className="text-sm text-center text-gray-600">Masukkan email Anda untuk menerima link reset.</p>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">Kirim Instruksi</button>
              <button type="button" onClick={() => setView('sign-in')} className="w-full text-center text-sm text-indigo-600 hover:underline pt-4">Kembali ke Sign In</button>
            </form>
          )}

          {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
          
          {view !== 'forgot-password' && (
            <>
              <div className="relative flex py-5 items-center"><div className="flex-grow border-t border-gray-300"></div><span className="flex-shrink mx-4 text-gray-400">atau</span><div className="flex-grow border-t border-gray-300"></div></div>
              <button onClick={handleSignInWithGoogle} className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                <GoogleIcon/> Lanjutkan dengan Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}