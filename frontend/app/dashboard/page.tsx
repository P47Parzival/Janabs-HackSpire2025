'use client';
import { useEffect, useState, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import Image from 'next/image';
import { FiCalendar, FiClock, FiAward, FiBarChart2, FiTrendingUp, FiBook, FiTarget } from 'react-icons/fi';
import { MdQuiz, MdAutoGraph } from 'react-icons/md';
import { BsLightbulb, BsGraphUp, BsRobot } from 'react-icons/bs';
import Link from 'next/link';
import { stripePromise } from '@/lib/stripe';
import { loadStripe } from '@stripe/stripe-js';

// Mock data for demonstration
interface UserStats {
  streak: number;
  totalTimeSpent: number; // in minutes
  quizzesTaken: number;
  quizAvgScore: number;
  topicsExplored: string[];
  badges: Badge[];
  recentActivity: Activity[];
  learningPath: LearningPathProgress;
  recommendations: Recommendation[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  date: string;
  color: string;
}

interface Activity {
  id: string;
  type: 'quiz' | 'content' | 'agent' | 'tutorial';
  title: string;
  score?: number;
  date: string;
  timeSpent: number; // in minutes
}

interface LearningPathProgress {
  name: string;
  progress: number;
  nextStep: string;
  estimatedTimeToComplete: number; // in minutes
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'content' | 'tutorial';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  link: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Add this state for avatar selection
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
  
  // Array of available Ghibli-inspired avatars
  const avatarOptions = [
    '/ghibli-1.jpg',
    '/ghibli-2.jpg',
    '/ghibli-3.jpg',
    '/ghibli-4.jpg'
  ];

  // Randomly select an avatar on initial load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * avatarOptions.length);
    setSelectedAvatar(randomIndex);
  }, []);

  // Canvas background effect - similar to HomePage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
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
      speedX: number;
      speedY: number;
      twinkleSpeed: number;
      twinklePhase: number;
      color: string;
      isFalling: boolean;
      fallSpeed: number;
    }
    
    // Circle animation properties
    interface Circle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
    }
    
    const stars: Star[] = [];
    
    // Create different types of stars for a more realistic night sky
    const createStars = () => {
      // Clear existing stars
      stars.length = 0;
      
      // Create distant small stars (more numerous)
      for (let i = 0; i < 120; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 0.8 + 0.3, // Smaller size range
          opacity: 0.3 + Math.random() * 0.2, // Reduced opacity for less brightness
          speedX: (Math.random() - 0.5) * 0.001, // Almost no horizontal movement
          speedY: (Math.random() - 0.5) * 0.001, // Almost no vertical movement
          twinkleSpeed: 0.003 + Math.random() * 0.007, // Slower twinkling
          twinklePhase: Math.random() * Math.PI * 2,
          color: '#ffffff', // White stars
          isFalling: false,
          fallSpeed: 0
        });
      }
      
      // Create medium stars
      for (let i = 0; i < 50; i++) {
        const colorChoice = Math.random();
        // Some stars with slight color variations
        const color = colorChoice < 0.7 ? '#ffffff' : // White
                      colorChoice < 0.8 ? '#fffbe6' : // Yellowish
                      colorChoice < 0.9 ? '#e6f2ff' : // Blueish
                      '#ffe6ee'; // Pinkish
                      
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.0 + 0.7, // Adjusted medium size
          opacity: 0.4 + Math.random() * 0.2, // Lower opacity for less brightness
          speedX: (Math.random() - 0.5) * 0.001, // Almost no horizontal movement
          speedY: (Math.random() - 0.5) * 0.001, // Almost no vertical movement
          twinkleSpeed: 0.005 + Math.random() * 0.01, // Slower twinkling
          twinklePhase: Math.random() * Math.PI * 2,
          color,
          isFalling: false,
          fallSpeed: 0
        });
      }
      
      // Create a few bright stars (less numerous and less bright)
      for (let i = 0; i < 15; i++) { // Reduced from 20 to 15
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.3 + 1.0, // Slightly smaller size
          opacity: 0.4 + Math.random() * 0.2, // Lower max opacity
          speedX: (Math.random() - 0.5) * 0.001, // Almost no horizontal movement
          speedY: (Math.random() - 0.5) * 0.001, // Almost no vertical movement
          twinkleSpeed: 0.008 + Math.random() * 0.015, // Slower twinkling
          twinklePhase: Math.random() * Math.PI * 2,
          color: '#ffffff', // White color
          isFalling: false,
          fallSpeed: 0
        });
      }
    };
    
    createStars();
    
    const circles: Circle[] = [];
    for (let i = 0; i < 12; i++) {
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 70 + Math.random() * 160,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: i % 4 === 0 ? '#6366f1' : i % 4 === 1 ? '#8b5cf6' : i % 4 === 2 ? '#0ea5e9' : '#06b6d4'
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
      
      // Add subtle grid pattern with pulsing effect
      const gridOpacity = 0.02 + Math.abs(Math.sin(time * 0.5) * 0.015); // Pulsing opacity
      ctx.strokeStyle = `rgba(255, 255, 255, ${gridOpacity})`;
      ctx.lineWidth = 1;

      // Staggered grid lines for more depth
      const gridSize = 30;
      const majorGridInterval = 4; // Every 4th line is brighter

      for (let x = 0; x < canvas.width; x += gridSize) {
        const isMajorGrid = Math.floor(x / gridSize) % majorGridInterval === 0;
        ctx.globalAlpha = isMajorGrid ? gridOpacity * 1.5 : gridOpacity;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        const isMajorGrid = Math.floor(y / gridSize) % majorGridInterval === 0;
        ctx.globalAlpha = isMajorGrid ? gridOpacity * 1.5 : gridOpacity;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Reset global alpha
      ctx.globalAlpha = 1.0;
      
      // Draw and update stars with advanced effects
      stars.forEach(star => {
        // Move stars slowly across the screen
        star.x += star.speedX;
        star.y += star.speedY;
        
        // Wrap around screen edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
        
        // Calculate twinkling effect (pulsing size and opacity)
        star.twinklePhase += star.twinkleSpeed;
        const twinkleFactor = 0.5 + 0.5 * Math.sin(star.twinklePhase);
        const currentOpacity = star.opacity * (0.6 + 0.4 * twinkleFactor);
        const currentSize = star.size * (0.85 + 0.15 * twinkleFactor);
        
        // Draw star with glow effect
        // Base star (center point)
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentOpacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect for larger stars - with reduced intensity
        if (star.size > 1.5) {
          // Inner glow - reduced opacity and size
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4 // Reduced from star.size * 5
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${0.12 * currentOpacity})`); // Reduced from 0.20
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2); // Reduced from star.size * 5
          ctx.fill();
          
          // Cross rays for brighter stars - with reduced intensity
          if (star.size > 2) {
            ctx.globalAlpha = 0.08 * currentOpacity; // Reduced from 0.15
            ctx.strokeStyle = star.color;
            ctx.lineWidth = 0.4; // Reduced from 0.6
            
            // Horizontal ray - shorter
            ctx.beginPath();
            ctx.moveTo(star.x - star.size * 4, star.y); // Reduced from star.size * 6
            ctx.lineTo(star.x + star.size * 4, star.y); // Reduced from star.size * 6
            ctx.stroke();
            
            // Vertical ray - shorter
            ctx.beginPath();
            ctx.moveTo(star.x, star.y - star.size * 4); // Reduced from star.size * 6
            ctx.lineTo(star.x, star.y + star.size * 4); // Reduced from star.size * 6
            ctx.stroke();
            
            // Add diagonal rays for even more visual effect - shorter and less visible
            ctx.beginPath();
            ctx.moveTo(star.x - star.size * 2, star.y - star.size * 2); // Reduced from star.size * 3
            ctx.lineTo(star.x + star.size * 2, star.y + star.size * 2); // Reduced from star.size * 3
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(star.x - star.size * 2, star.y + star.size * 2); // Reduced from star.size * 3
            ctx.lineTo(star.x + star.size * 2, star.y - star.size * 2); // Reduced from star.size * 3
            ctx.stroke();
          }
        }
        
        // Add small chance for stars to fall
        if (Math.random() > 0.9997) {
          star.isFalling = true;
          star.fallSpeed = 0.3 + Math.random() * 0.7;
        }
        
        // Update position for falling stars
        if (star.isFalling) {
          star.y += star.fallSpeed;
          
          // Create a small trail effect for falling stars
          ctx.globalAlpha = 0.2 * star.opacity;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y - 5);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();
          
          // Reset if it goes offscreen
          if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
            star.isFalling = false;
          }
        }
      });

      // Update circle positions
      circles.forEach(circle => {
        circle.x += circle.vx;
        circle.y += circle.vy;
        
        // Bounce off walls
        if (circle.x < -circle.radius) circle.x = canvas.width + circle.radius;
        if (circle.x > canvas.width + circle.radius) circle.x = -circle.radius;
        if (circle.y < -circle.radius) circle.y = canvas.height + circle.radius;
        if (circle.y > canvas.height + circle.radius) circle.y = -circle.radius;
        
        // Draw gradient circle with glow effect
        const gradient = ctx.createRadialGradient(circle.x, circle.y, 0, circle.x, circle.y, circle.radius);
        gradient.addColorStop(0, circle.color + '40'); // 25% opacity
        gradient.addColorStop(0.8, circle.color + '10'); // 6% opacity
        gradient.addColorStop(1, circle.color + '00'); // 0% opacity
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Enhance shooting stars
      // More frequent and visually appealing shooting stars with color variations
      if (Math.random() > 0.993) { // Make them more frequent
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * (canvas.height / 3); // Start from top third
        
        const length = 150 + Math.random() * 250; // Longer trail for better visibility
        const angle = Math.PI / 4 + Math.random() * Math.PI / 2; // Down and to the right/left
        
        const endX = startX + length * Math.cos(angle);
        const endY = startY + length * Math.sin(angle);
        
        // Random color for some shooting stars - occasionally colored
        const colorChoice = Math.random();
        const starColor = colorChoice > 0.7 ? 
          'rgba(255, 255, 255, ' : 
          colorChoice > 0.5 ? 
          'rgba(135, 206, 250, ' : // Light blue
          colorChoice > 0.3 ? 
          'rgba(255, 182, 193, ' : // Light pink
          'rgba(240, 230, 140, '; // Light yellow
        
        // Enhanced shooting star with more vibrant glow
        const shootingStarGradient = ctx.createLinearGradient(startX, startY, endX, endY);
        shootingStarGradient.addColorStop(0, starColor + '0.0)');
        shootingStarGradient.addColorStop(0.1, starColor + '0.4)');
        shootingStarGradient.addColorStop(0.4, starColor + '0.8)');
        shootingStarGradient.addColorStop(1.0, starColor + '0.0)');
        
        ctx.strokeStyle = shootingStarGradient;
        ctx.lineWidth = 3; // Slightly thicker line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Add a more pronounced glow around the shooting star
        ctx.strokeStyle = starColor + '0.1)';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Add pulse effect at the front of the shooting star
        ctx.fillStyle = starColor + '0.9)';
        ctx.beginPath();
        ctx.arc(startX, startY, 1.5 + Math.sin(time * 10) * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // Add small particles behind the shooting star with varying sizes
        const particleCount = Math.floor(6 + Math.random() * 6);
        for (let i = 0; i < particleCount; i++) {
          const t = Math.random();
          const particleX = startX + (endX - startX) * t;
          const particleY = startY + (endY - startY) * t;
          const particleSize = 0.8 + Math.random() * 1.2;
          
          ctx.fillStyle = starColor + (0.5 + Math.random() * 0.4) + ')';
          ctx.beginPath();
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      animationFrameId = requestAnimationFrame(drawBackground);
    };
    
    drawBackground();
    
    // Handle window resize by recreating the stars
    const handleResize = () => {
      resizeCanvas();
      createStars();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace('/');
        return;
      }
      setUser(user);
      setIsLoading(false);

      // In a real app, you would fetch this data from your backend
      // This is mock data for demonstration
      setUserStats({
        streak: 12,
        totalTimeSpent: 865,
        quizzesTaken: 24,
        quizAvgScore: 82,
        topicsExplored: ['Machine Learning', 'Quantum Computing', 'Data Structures', 'Neural Networks'],
        badges: [
          { 
            id: 'badge1', 
            name: 'Learning Enthusiast', 
            description: '10-day streak', 
            icon: '🔥', 
            date: '2023-04-12',
            color: 'from-orange-400 to-amber-500'
          },
          { 
            id: 'badge2', 
            name: 'Quiz Master', 
            description: 'Scored 100% in 5 quizzes', 
            icon: '🧠', 
            date: '2023-04-10',
            color: 'from-indigo-400 to-blue-500'
          },
          { 
            id: 'badge3', 
            name: 'Explorer', 
            description: 'Discovered 10 new topics', 
            icon: '🧭', 
            date: '2023-04-08',
            color: 'from-green-400 to-emerald-500'
          },
        ],
        recentActivity: [
          { 
            id: 'act1', 
            type: 'quiz', 
            title: 'Neural Networks Basics', 
            score: 92, 
            date: '2023-04-14', 
            timeSpent: 25 
          },
          { 
            id: 'act2', 
            type: 'content', 
            title: 'Introduction to Machine Learning', 
            date: '2023-04-13', 
            timeSpent: 45 
          },
          { 
            id: 'act3', 
            type: 'agent', 
            title: 'AI Assistant Chat Session', 
            date: '2023-04-12', 
            timeSpent: 30 
          },
        ],
        learningPath: {
          name: 'Advanced Machine Learning',
          progress: 68,
          nextStep: 'Neural Network Architecture',
          estimatedTimeToComplete: 320
        },
        recommendations: [
          {
            id: 'rec1',
            title: 'Convolutional Neural Networks',
            description: 'Based on your interest in Neural Networks',
            type: 'tutorial',
            difficulty: 'medium',
            estimatedTime: 45,
            link: '/ai-companion'
          },
          {
            id: 'rec2',
            title: 'Test Your Machine Learning Knowledge',
            description: 'A quiz based on your recent learning',
            type: 'quiz',
            difficulty: 'medium',
            estimatedTime: 20,
            link: '/quizzes'
          },
          {
            id: 'rec3',
            title: 'Machine Learning Mathematics',
            description: 'Fill the gap in your learning path',
            type: 'content',
            difficulty: 'hard',
            estimatedTime: 60,
            link: '/content-analysis'
          },
        ]
      });
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

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-400/20 text-green-400';
      case 'medium': return 'bg-yellow-400/20 text-yellow-400';
      case 'hard': return 'bg-red-400/20 text-red-400';
      default: return 'bg-blue-400/20 text-blue-400';
    }
  };

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'quiz': return <MdQuiz className="text-indigo-400" />;
      case 'content': return <FiBook className="text-blue-400" />;
      case 'agent': return <BsRobot className="text-purple-400" />;
      case 'tutorial': return <BsLightbulb className="text-amber-400" />;
      default: return <FiTarget className="text-green-400" />;
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSubscription = async (priceId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen flex flex-col relative font-sans bg-transparent">
      {/* Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-0"
        style={{ pointerEvents: 'none' }}
      />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="bg-slate-800/40 backdrop-blur-md border-b border-slate-700/30 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image 
                src="/favicon.ico" 
                alt="MindSurf Logo" 
                width={32} 
                height={32} 
                className="object-contain drop-shadow-lg"
              />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                MindSurf Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/home" className="text-slate-300 hover:text-indigo-400 transition">
                Home
              </Link>
              <span className="text-slate-300">Welcome, {user?.displayName || user?.email?.split('@')[0]}</span>
              <button
                onClick={() => {
                  const pricingSection = document.getElementById('pricing-section');
                  if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Review Pricing
              </button>
              <button
                onClick={handleSignOut}
                className="bg-slate-700/40 hover:bg-slate-700/60 text-slate-200 px-4 py-2 rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6 space-y-8">
          {/* User Welcome & Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800/40 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-700/30 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* User Profile Section with Ghibli-inspired styling */}
              <div className="md:w-2/5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/10 rounded-xl blur-xl"></div>
                <div className="relative flex flex-col items-center md:items-start p-4 md:p-6">
                  <div className="mb-4 relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500/50 shadow-lg shadow-indigo-500/30">
                      <Image 
                        src={avatarOptions[selectedAvatar]} 
                        alt="Ghibli Avatar" 
                        width={96} 
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 mb-1 text-center md:text-left">
                    {user?.displayName || user?.email?.split('@')[0]}
                  </h2>
                  
                  <p className="text-slate-400 mb-4 text-center md:text-left">{user?.email}</p>
                  
                  {/* Avatar Selection Section */}
                  <div className="flex justify-center md:justify-start gap-2 mb-4">
                    {avatarOptions.map((avatar, index) => (
                      <motion.div 
                        key={index}
                        onClick={() => setSelectedAvatar(index)}
                        className={`w-10 h-10 rounded-full overflow-hidden cursor-pointer ${selectedAvatar === index ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-800' : 'border border-slate-600/30'}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image 
                          src={avatar}
                          alt={`Avatar option ${index + 1}`}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    {/* Streak */}
                    <div className="bg-slate-700/40 p-3 rounded-lg flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg">
                        <FiCalendar className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Current Streak</p>
                        <div className="flex items-baseline">
                          <span className="text-xl font-bold text-white">{userStats?.streak}</span>
                          <span className="ml-1 text-slate-400 text-sm">days</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Study Time */}
                    <div className="bg-slate-700/40 p-3 rounded-lg flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
                        <FiClock className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Total Study Time</p>
                        <div className="flex items-baseline">
                          <span className="text-xl font-bold text-white">{formatTime(userStats?.totalTimeSpent || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Achievements & Future Tasks */}
              <div className="md:w-3/5 md:border-l border-slate-600/30 pl-0 md:pl-6 mt-6 md:mt-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                    Your Achievements Journey
                  </h3>
                  <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-1 rounded-full">
                    Level {Math.floor((userStats?.badges.length || 0) * 1.5) + 3}
                  </span>
                </div>
                
                {/* Achievement Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-300 text-sm">Achievement Progress</span>
                    <span className="text-indigo-400 text-sm">{userStats?.badges.length}/10</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
                      style={{ width: `${(userStats?.badges.length || 0) * 10}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Recent Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {userStats?.badges.map((badge, index) => (
                    <div
                      key={badge.id}
                      className="group relative cursor-pointer"
                      title={badge.name}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl bg-gradient-to-br ${badge.color} shadow-lg border border-slate-600/30`}>
                        {badge.icon}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 text-xs text-slate-300 group-hover:bg-indigo-500 group-hover:text-white transition">
                        {index + 1}
                      </div>
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-slate-800 rounded-lg shadow-xl border border-slate-600/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                        <p className="font-medium text-white text-xs text-center">{badge.name}</p>
                        <p className="text-slate-400 text-xs text-center mt-1">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Locked future badges */}
                  {Array.from({ length: Math.max(0, 10 - (userStats?.badges.length || 0)) }).map((_, i) => (
                    <div
                      key={`locked-${i}`}
                      className="relative cursor-not-allowed"
                      title="Locked Achievement"
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-slate-700/30 shadow-inner border border-slate-600/30 text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Next Achievement */}
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                  <h4 className="text-slate-200 font-medium mb-2 flex items-center">
                    <span className="mr-2">Next Achievement</span>
                    <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded">+100 XP</span>
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg opacity-60">
                      <FiTarget className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-300 text-sm font-medium">Quiz Champion</p>
                      <p className="text-slate-400 text-xs">Complete 5 more quizzes with 90%+ score</p>
                      <div className="w-full h-1.5 bg-slate-700/50 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subscription Plans */}
          <motion.div
            id="pricing-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800/40 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-700/30"
          >
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 mb-6">
              Choose Your Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <div className="bg-slate-700/40 border border-slate-600/50 rounded-xl p-6 flex flex-col">
                <h3 className="text-xl font-semibold text-slate-200 mb-2">Free</h3>
                <p className="text-3xl font-bold text-white mb-4">$0<span className="text-slate-400 text-lg">/month</span></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-slate-300">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Basic AI Companion
                  </li>
                  <li className="flex items-center text-slate-300">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Limited Quizzes
                  </li>
                  <li className="flex items-center text-slate-300">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Basic Content Analysis
                  </li>
                </ul>
                <button className="mt-auto bg-slate-600/40 hover:bg-slate-600/60 text-slate-200 px-4 py-2 rounded-lg transition">
                  Current Plan
                </button>
              </div>

              {/* Better Agent Plan */}
              <div className="bg-slate-700/40 border border-indigo-500/50 rounded-xl p-6 flex flex-col">
                <h3 className="text-xl font-semibold text-slate-200 mb-2">Better Agent</h3>
                <p className="text-3xl font-bold text-white mb-4">$4.99<span className="text-slate-400 text-lg">/month</span></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-slate-300">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Enhanced AI Companion
                  </li>
                  <li className="flex items-center text-slate-300">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited Quizzes
                  </li>
                  <li className="flex items-center text-slate-300">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced Content Analysis
                  </li>
                </ul>
                <button
                  onClick={() => handleSubscription(process.env.NEXT_PUBLIC_STRIPE_BETTER_AGENT_PRICE_ID!)}
                  disabled={loading}
                  className="mt-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Upgrade Now'}
                </button>
              </div>

              {/* Advanced Agent Plan */}
              <div className="bg-slate-700/40 border border-purple-500/50 rounded-xl p-6 flex flex-col">
                <h3 className="text-xl font-semibold text-slate-200 mb-2">Advanced Agent</h3>
                <p className="text-3xl font-bold text-white mb-4">$8.99<span className="text-slate-400 text-lg">/month</span></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-slate-300">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Premium AI Companion
                  </li>
                  <li className="flex items-center text-slate-300">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Priority Support
                  </li>
                  <li className="flex items-center text-slate-300">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    All Premium Features
                  </li>
                </ul>
                <button
                  onClick={() => handleSubscription(process.env.NEXT_PUBLIC_STRIPE_ADVANCE_AGENT_PRICE_ID!)}
                  disabled={loading}
                  className="mt-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Upgrade Now'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-800/40 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-700/30"
          >
            <div className="flex items-center mb-6">
              <FiAward className="text-indigo-400 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Your Achievements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userStats?.badges.map(badge => (
                <motion.div 
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-slate-700/40 border border-slate-600/50 rounded-lg p-4 flex flex-col items-center"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 bg-gradient-to-br ${badge.color}`}>
                    {badge.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 text-center mb-1">{badge.name}</h3>
                  <p className="text-sm text-slate-400 text-center mb-2">{badge.description}</p>
                  <span className="text-xs text-slate-500">Earned on {new Date(badge.date).toLocaleDateString()}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Learning Path Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-slate-800/40 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-700/30"
          >
            <div className="flex items-center mb-6">
              <MdAutoGraph className="text-indigo-400 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Learning Path Progress</h2>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-slate-200">{userStats?.learningPath.name}</h3>
                <span className="text-indigo-400 font-semibold">{userStats?.learningPath.progress}%</span>
              </div>
              <div className="w-full bg-slate-700/70 h-3 rounded-full">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${userStats?.learningPath.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-slate-700/40 border border-slate-600/50 rounded-lg p-4">
              <h4 className="text-slate-200 font-medium mb-2">Next Step: {userStats?.learningPath.nextStep}</h4>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Estimated time: {formatTime(userStats?.learningPath.estimatedTimeToComplete || 0)}</span>
                <Link 
                  href="/quizzes" 
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:shadow-lg hover:shadow-indigo-500/20 transition"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Link href="/ai-companion" className="bg-slate-800/40 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-700/30 flex flex-col items-center hover:border-indigo-500/50 transition group">
              <BsRobot className="text-3xl mb-3 text-indigo-400 group-hover:scale-110 transition" />
              <h3 className="text-lg font-medium text-slate-200 mb-1">AI Companion</h3>
              <p className="text-sm text-slate-400 text-center">Get personalized learning assistance</p>
            </Link>
            
            <Link href="/content-analysis" className="bg-slate-800/40 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-700/30 flex flex-col items-center hover:border-indigo-500/50 transition group">
              <FiBook className="text-3xl mb-3 text-indigo-400 group-hover:scale-110 transition" />
              <h3 className="text-lg font-medium text-slate-200 mb-1">Content Analysis</h3>
              <p className="text-sm text-slate-400 text-center">Upload materials for instant insights</p>
            </Link>
            
            <Link href="/quizzes" className="bg-slate-800/40 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-700/30 flex flex-col items-center hover:border-indigo-500/50 transition group">
              <MdQuiz className="text-3xl mb-3 text-indigo-400 group-hover:scale-110 transition" />
              <h3 className="text-lg font-medium text-slate-200 mb-1">Practice Quizzes</h3>
              <p className="text-sm text-slate-400 text-center">Test your knowledge with adaptive quizzes</p>
            </Link>
            
            <Link href="/agent" className="bg-slate-800/40 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-700/30 flex flex-col items-center hover:border-indigo-500/50 transition group">
              <BsGraphUp className="text-3xl mb-3 text-indigo-400 group-hover:scale-110 transition" />
              <h3 className="text-lg font-medium text-slate-200 mb-1">MindSurf Agent</h3>
              <p className="text-sm text-slate-400 text-center">Interact with our AI learning assistant</p>
            </Link>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="mt-auto bg-slate-900/40 backdrop-blur-md text-slate-400 border-t border-slate-800/30 px-6 py-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-6 w-6 mr-2 relative">
                <Image 
                  src="/favicon.ico" 
                  alt="MindSurf Logo" 
                  width={24} 
                  height={24} 
                  className="object-contain"
                />
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 font-semibold">MindSurf</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-indigo-400 transition">Terms</a>
              <a href="#" className="hover:text-indigo-400 transition">Privacy</a>
              <a href="#" className="hover:text-indigo-400 transition">Contact</a>
            </div>
            <p>&copy; 2025 MindSurf. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}