'use client';
import { useState, useEffect, useRef } from 'react';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas background effect - similar to HomePage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Star animation properties
    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      twinklePhase: number;
      color: string;
    }
    
    const stars: Star[] = [];
    
    // Create stars
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.2,
        opacity: 0.3 + Math.random() * 0.3,
        twinkleSpeed: 0.003 + Math.random() * 0.007,
        twinklePhase: Math.random() * Math.PI * 2,
        color: '#ffffff'
      });
    }
    
    let time = 0;
    const drawBackground = () => {
      time += 0.005;
      
      // Dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f172a'); // Dark blue
      gradient.addColorStop(1, '#1e1b4b'); // Dark indigo
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Subtle grid
      const gridOpacity = 0.03;
      ctx.strokeStyle = `rgba(255, 255, 255, ${gridOpacity})`;
      ctx.lineWidth = 1;

      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.globalAlpha = gridOpacity;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.globalAlpha = gridOpacity;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw stars
      stars.forEach(star => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkleFactor = 0.5 + 0.5 * Math.sin(star.twinklePhase);
        const currentOpacity = star.opacity * (0.6 + 0.4 * twinkleFactor);
        const currentSize = star.size * (0.85 + 0.15 * twinkleFactor);
        
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentOpacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(drawBackground);
    };
    
    drawBackground();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
      if (user) {
        router.replace('/home');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace('/home');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google');
    }
  };

  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.replace('/home');
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-0"
      />
      
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-0"></div>
        
        <motion.div 
          className="z-10 bg-slate-800/50 backdrop-blur-xl p-8 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-md relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative gradient */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-600/30 to-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-indigo-600/30 to-purple-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="text-center mb-8">
              <div className="h-16 w-16 mx-auto mb-4 relative">
                <Image 
                  src="/favicon.ico" 
                  alt="MindSurf Logo" 
                  width={64} 
                  height={64} 
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <motion.h1 
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Welcome to MindSurf
              </motion.h1>
              <motion.p 
                className="text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Your AI-Powered Learning Companion
              </motion.p>
            </div>

            <motion.form 
              onSubmit={handleEmailPasswordAuth} 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              {error && (
                <motion.div 
                  className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-2 rounded"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {error}
                </motion.div>
              )}
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </motion.button>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-slate-300 hover:text-indigo-400 transition"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </button>
            </motion.form>

            <motion.div 
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800/80 text-slate-400">Or continue with</span>
                </div>
              </div>
              <motion.button
                onClick={handleGoogleSignIn}
                className="w-full mt-4 bg-white text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-100 hover:shadow-lg transition flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image src="/google-logo.jpg" alt="Google" width={20} height={20} />
                Google
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}