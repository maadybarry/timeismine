import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Protected() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/protected', {
      credentials: 'include',
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Unauthorized');
        setMessage(data.message);
      })
      .catch((err) => {
        setError('You must be signed in to view this page.');
      });
  }, []);

  return (
    <>
      <Head>
        <title>Protected Page - TimeIsMine</title>
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Protected Page</h2>
          {message && <p className="text-green-700">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </main>
    </>
  );
}
