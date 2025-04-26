'use client';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace('/');
        return;
      }
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
            MindSurf Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">Welcome, {user?.displayName || user?.email}</span>
            <button
              onClick={handleSignOut}
              className="bg-slate-700/50 hover:bg-slate-700/70 text-slate-200 px-4 py-2 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/50 rounded-xl p-6 shadow-xl border border-slate-700/50"
        >
          <h2 className="text-xl font-semibold text-slate-200 mb-4">
            Welcome to your Dashboard
          </h2>
          <p className="text-slate-400">
            This is your personalized learning space. Here you can track your progress, access your learning materials, and manage your account.
          </p>
        </motion.div>
      </main>
    </div>
  );
} 