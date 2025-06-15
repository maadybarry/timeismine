import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';

function isStrongPassword(password: string) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!isStrongPassword(form.password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
        setSuccess('');
      } else {
        setSuccess('Account created! You can now sign in.');
        setForm({ email: '', password: '', confirmPassword: '' });
      }
    } catch (err) {
      setError('Network error');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - TimeIsMine</title>
      </Head>
      <div className="min-h-screen flex flex-col">
        {/* Topbar with product name and clock icon */}
        <nav className="w-full flex items-center px-8 py-4 bg-white shadow-sm">
          <Link href="/" className="flex items-center text-2xl font-bold text-blue-600">
            <svg className="w-7 h-7 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/></svg>
            TimeIsMine
          </Link>
        </nav>
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="w-full max-w-md bg-white rounded-lg shadow p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2 text-center text-blue-700">Create Your Account</h2>
            <p className="text-gray-500 text-center mb-6">Sign up to unlock AI-powered task management and smart scheduling.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {success && <p className="text-green-600 text-sm text-center">{success}</p>}
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg shadow font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            <p className="text-center text-gray-500 text-sm mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline font-semibold">Sign In</a>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
