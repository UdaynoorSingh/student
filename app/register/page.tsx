'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [collegeId, setCollegeId] = useState('');
  const [colleges, setColleges] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/colleges').then((res) => res.json()).then((data) => setColleges(data.colleges || []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, collegeId })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message || 'Registration failed');
      return;
    }

    router.push('/dashboard');
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[0.95fr_1.05fr]">
      <section className="card hidden md:block">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] muted">Get started</p>
        <h1 className="heading-display mt-3 font-[var(--font-display)]">Create your Sluglime profile</h1>
        <p className="muted mt-4 text-sm">Join your college feed and start sharing notes, updates, and resources with your classmates.</p>
      </section>

      <section className="card space-y-5">
        <h2 className="text-2xl font-semibold">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <select className="input" value={role} onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <select className="input" value={collegeId} onChange={(e) => setCollegeId(e.target.value)} required>
            <option value="">Select college</option>
            {colleges.map((college) => <option key={college._id} value={college._id}>{college.name}</option>)}
          </select>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full">Create account</button>
        </form>
      </section>
    </div>
  );
}
