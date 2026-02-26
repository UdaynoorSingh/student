'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    setLoading(false);
    if (!response.ok) {
      const data = await response.json();
      setError(data.message || 'Login failed');
      return;
    }

    router.replace('/dashboard');
    router.refresh();
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-[1.05fr_0.95fr]">
      <section className="card hidden md:block">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] muted">Welcome back</p>
        <h1 className="heading-display mt-3 font-[var(--font-display)]">Continue your college conversation</h1>
        <p className="muted mt-4 max-w-sm text-sm">Post updates, share notes, and stay synced with your community in one place.</p>
      </section>

      <section className="card space-y-5">
        <h2 className="text-2xl font-semibold">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        <p className="text-sm muted">No account? <Link className="font-medium text-[#9d4520] hover:text-[#7f3418]" href="/register">Register</Link></p>
      </section>
    </div>
  );
}
