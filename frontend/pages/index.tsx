import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>TimeIsMine - AI To-Do List</title>
        <meta name="description" content="AI-assisted to-do list for productivity" />
      </Head>
      {/* Navigation Bar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <span className="flex items-center text-2xl font-bold text-blue-600">
          <svg className="w-7 h-7 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/></svg>
          TimeIsMine
        </span>
        <Link href="/login" legacyBehavior>
          <a className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Sign In</a>
        </Link>
      </nav>
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100">
        <section className="text-center mt-16 mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Take Control of Your Time</h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            AI-powered to-do list that helps you prioritize, schedule, and achieve more every day.
          </p>
          <a href="#features" className="inline-block px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded shadow hover:bg-blue-700 transition">Get Started</a>
        </section>
        {/* Features Overview */}
        <section id="features" className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-blue-500 text-3xl mb-2">⚡</span>
            <h3 className="font-bold text-lg mb-1">Smart Prioritization</h3>
            <p className="text-gray-500 text-center">Let AI sort your tasks by urgency, importance, and context.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-blue-500 text-3xl mb-2">🗓️</span>
            <h3 className="font-bold text-lg mb-1">AI Scheduling</h3>
            <p className="text-gray-500 text-center">Get optimal time suggestions based on your calendar and habits.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-blue-500 text-3xl mb-2">📈</span>
            <h3 className="font-bold text-lg mb-1">Productivity Insights</h3>
            <p className="text-gray-500 text-center">Track trends and discover your best focus times.</p>
          </div>
        </section>
      </main>
    </>
  );
}
