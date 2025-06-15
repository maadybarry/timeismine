import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function TodoList() {
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch tasks on mount
  useEffect(() => {
    fetch('http://localhost:4000/api/tasks', { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setTasks(data.tasks || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tasks.');
        setLoading(false);
      });
  }, [router]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const res = await fetch('http://localhost:4000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: input.trim() })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTasks([...tasks, data]);
      setInput('');
    } catch {
      setError('Failed to add task.');
    }
  };

  const toggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      const res = await fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ completed: !task.completed })
      });
      if (!res.ok) throw new Error();
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    } catch {
      setError('Failed to update task.');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setTasks(tasks.filter(t => t.id !== id));
    } catch {
      setError('Failed to delete task.');
    }
  };

  const logout = async () => {
    await fetch('http://localhost:4000/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/login');
  };

  return (
    <>
      <Head>
        <title>To-Do List - TimeIsMine</title>
      </Head>
      {/* Topbar with product name and clock icon, matching login/signup */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <span className="flex items-center text-2xl font-bold text-blue-600">
          <svg className="w-7 h-7 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/></svg>
          TimeIsMine
        </span>
        <button onClick={logout} className="px-3 py-1 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 transition font-semibold">Logout</button>
      </nav>
      <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 py-10">
        <div className="w-full max-w-lg bg-white rounded-lg shadow p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-2 text-blue-700 text-center">Your Tasks</h2>
          <p className="text-gray-500 text-center mb-6">Manage your daily priorities and let AI help you stay on track.</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={addTask} className="flex gap-2 mb-6 w-full">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Add a new task and press Enter..."
              className="flex-1 rounded-lg border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60">
              Add Task
            </button>
          </form>
          {loading ? (
            <p className="text-center text-gray-500">Loading your tasks...</p>
          ) : (
            <ul className="space-y-2 w-full">
              {tasks.length === 0 ? (
                <li className="text-center text-gray-400">No tasks yet. Start by adding your first task!</li>
              ) : (
                tasks.map(task => (
                  <li key={task.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
                    <span
                      className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'} text-base`}
                      onClick={() => toggleTask(task.id)}
                      title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {task.text}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="ml-4 text-red-500 hover:text-red-700 text-xl font-bold"
                      title="Delete task"
                    >
                      &times;
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
