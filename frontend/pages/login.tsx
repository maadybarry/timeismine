import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setSuccess('');
      } else {
        setSuccess('Signed in successfully!');
        setError('');
        setTimeout(() => router.push('/todolist'), 1000);
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
        <title>Sign In - TimeIsMine</title>
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
            <h2 className="text-2xl font-bold mb-2 text-center text-blue-700">Welcome Back</h2>
            <p className="text-gray-500 text-center mb-6">Sign in to access your personalized productivity dashboard.</p>
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
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {success && <p className="text-green-600 text-sm text-center">{success}</p>}
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg shadow font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <p className="text-center text-gray-500 text-sm mt-4">
              New to TimeIsMine?{' '}
              <a href="/signup" className="text-blue-600 hover:underline font-semibold">Create an account</a>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
