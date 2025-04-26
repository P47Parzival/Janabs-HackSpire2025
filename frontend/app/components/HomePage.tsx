'use client';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiBook, FiUser, FiBarChart2, FiMessageCircle, FiFileText, FiAward } from 'react-icons/fi';
import { MdQuiz, MdOndemandVideo } from 'react-icons/md';
import { BsRobot, BsLightbulb } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('learn');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80, // Offset for navbar
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    // Animated background effect
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
    
    // Create gradient mesh background
    interface Circle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
    }
    
    // Create a more visually interesting star system
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
          size: Math.random() * 1.2 + 0.5, // Small size
          opacity: 0.4 + Math.random() * 0.3, // Medium opacity
          speedX: (Math.random() - 0.5) * 0.05, // Very slow movement
          speedY: (Math.random() - 0.5) * 0.05,
          twinkleSpeed: 0.01 + Math.random() * 0.02,
          twinklePhase: Math.random() * Math.PI * 2,
          color: '#ffffff' // White stars
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
          size: Math.random() * 1.5 + 1.2, // Medium size
          opacity: 0.5 + Math.random() * 0.4,
          speedX: (Math.random() - 0.5) * 0.03,
          speedY: (Math.random() - 0.5) * 0.03,
          twinkleSpeed: 0.015 + Math.random() * 0.025,
          twinklePhase: Math.random() * Math.PI * 2,
          color
        });
      }
      
      // Create a few bright stars (less numerous)
      for (let i = 0; i < 20; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1.8, // Larger size
          opacity: 0.7 + Math.random() * 0.3, // Higher opacity
          speedX: (Math.random() - 0.5) * 0.01, // Almost still
          speedY: (Math.random() - 0.5) * 0.01,
          twinkleSpeed: 0.02 + Math.random() * 0.03, // More pronounced twinkling
          twinklePhase: Math.random() * Math.PI * 2,
          color: '#ffffff' // White color
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
      
      // Add subtle grid pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
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
        
        // Add glow effect for larger stars
        if (star.size > 1.5) {
          // Inner glow
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${0.15 * currentOpacity})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Create subtle cross rays for the brightest stars
          if (star.size > 2) {
            ctx.globalAlpha = 0.1 * currentOpacity;
            ctx.strokeStyle = star.color;
            ctx.lineWidth = 0.5;
            
            // Horizontal ray
            ctx.beginPath();
            ctx.moveTo(star.x - star.size * 4, star.y);
            ctx.lineTo(star.x + star.size * 4, star.y);
            ctx.stroke();
            
            // Vertical ray
            ctx.beginPath();
            ctx.moveTo(star.x, star.y - star.size * 4);
            ctx.lineTo(star.x, star.y + star.size * 4);
            ctx.stroke();
          }
        }
        
        // Reset global alpha
        ctx.globalAlpha = 1.0;
      });
      
      // Occasionally create a shooting star
      if (Math.random() > 0.995) { // Approx once every few seconds
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * (canvas.height / 3); // Start from top third
        
        const length = 50 + Math.random() * 100;
        const angle = Math.PI / 4 + Math.random() * Math.PI / 2; // Down and to the right/left
        
        const endX = startX + length * Math.cos(angle);
        const endY = startY + length * Math.sin(angle);
        
        const shootingStarGradient = ctx.createLinearGradient(startX, startY, endX, endY);
        shootingStarGradient.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
        shootingStarGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
        shootingStarGradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
        
        ctx.strokeStyle = shootingStarGradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      
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

  const mainFeatures = [
    {
      title: "AI Study Companion",
      description: "Your personalized learning assistant powered by advanced AI to help you understand complex topics",
      icon: <BsRobot className="text-indigo-400 text-3xl" />,
      path: "/ai-companion"
    },
    {
      title: "Smart Content Analysis",
      description: "Upload any textbook content or YouTube videos and get simplified explanations instantly",
      icon: <FiFileText className="text-indigo-400 text-3xl" />,
      path: "/content-analysis"
    },
    {
      title: "Interactive Quizzes",
      description: "Customized assessments that adapt to your learning pace with instant feedback",
      icon: <MdQuiz className="text-indigo-400 text-3xl" />,
      path: "/quizzes"
    },
    {
      title: "MindSurp Agent",
      description: "Talk to our AI and take a virtual quiz",
      icon: <FiBarChart2 className="text-indigo-400 text-3xl" />,
      path: "/agent"
    }
  ];

  const detailedFeatures = [
    {
      id: 'learn',
      title: 'Personalized Learning',
      description: 'Our AI analyzes your learning style and customizes content delivery to match your unique needs.',
      features: [
        'Smart content simplification',
        'Personalized explanations',
        'Adaptive learning paths',
        'Concept revisitation for difficult topics'
      ],
      image: '/personalized-learning.jpg' // Updated to use your image
    },
    {
      id: 'explain',
      title: 'Simplified Explanations',
      description: 'Upload any complex material and our AI breaks it down into easily digestible concepts.',
      features: [
        'Text content analysis',
        'Video lecture simplification',
        'Step-by-step breakdowns',
        'Student-friendly language'
      ],
      image: '/personalized-learning.jpg' // Updated to use your image
    },
    {
      id: 'chat',
      title: 'AI Study Buddy',
      description: 'A conversational assistant that answers questions and helps you work through difficult concepts.',
      features: [
        'Text and voice interaction',
        'Step-by-step explanations',
        '24/7 learning support',
        'Conceptual clarifications'
      ],
      image: '/personalized-learning.jpg' // Updated to use your image
    },
    {
      id: 'quiz',
      title: 'Smart Quiz Builder',
      description: 'Automatically generated quizzes tailored to your learning goals and current knowledge level.',
      features: [
        'Custom difficulty levels',
        'Instant feedback',
        'Targeted resource suggestions',
        'Comprehensive review materials'
      ],
      image: '/personalized-learning.jpg' // Updated to use your image
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Computer Science Student",
      quote: "LearnFlow helped me understand complex algorithms in ways my textbooks never could.",
      avatar: "/api/placeholder/60/60"
    },
    {
      name: "Sarah Miller",
      role: "Medical Student",
      quote: "The simplified explanations feature saved me countless hours of study time.",
      avatar: "/api/placeholder/60/60"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative font-sans">
      {/* Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-0"
      />
      
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="backdrop-blur-xl bg-slate-900/80 shadow-md border-b border-slate-800/50 px-6 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div 
              className="flex items-center"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Using favicon.ico instead of mindsurf-logo.png */}
              <div className="h-8 w-8 mr-2 relative">
                <Image 
                  src="/favicon.ico" 
                  alt="MindSurf Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">MindSurf</h1>
            </motion.div>
            
            <button 
              className="md:hidden text-indigo-400 text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
            
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  className="absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-xl shadow-xl border border-slate-800/50 p-4 md:hidden z-50"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ul className="space-y-4">
                    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <a href="#features" className="block py-2 hover:text-indigo-400 text-slate-200 font-medium">Features</a>
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <a href="#how-it-works" className="block py-2 hover:text-indigo-400 text-slate-200 font-medium">How It Works</a>
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <a href="#testimonials" className="block py-2 hover:text-indigo-400 text-slate-200 font-medium">Testimonials</a>
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <a href="#login" className="block py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-indigo-500/20">Login</a>
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <a href="#signup" className="block py-2 border-2 border-indigo-500 text-indigo-400 px-4 py-2 rounded-full hover:bg-indigo-950/50 transition">Sign Up</a>
                    </motion.li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="hidden md:block">
              <ul className="flex space-x-6 items-center">
                {["Features", "How It Works", "Testimonials"].map((item, index) => (
                  <motion.li 
                    key={item}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <a 
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="hover:text-indigo-400 text-slate-200 font-medium relative overflow-hidden group"
                    >
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full duration-300"></span>
                    </a>
                  </motion.li>
                ))}
                <motion.li 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a href="#login" className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 rounded-full shadow-lg hover:shadow-indigo-500/30 transition">Login</a>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a href="#signup" className="border-2 border-indigo-500 text-indigo-400 px-5 py-2 rounded-full hover:bg-indigo-950/50 transition">Sign Up</a>
                </motion.li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-6 py-16 md:py-28 relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
                Your AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Learning Companion</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 drop-shadow">
                Experience personalized education that adapts to your unique learning style and pace
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button 
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-full text-lg shadow-xl hover:shadow-indigo-500/30 transform transition duration-300"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Learning Now
                </motion.button>
                <motion.button 
                  className="bg-slate-800/70 backdrop-blur-sm text-indigo-400 border-2 border-indigo-500 px-8 py-3 rounded-full text-lg hover:bg-slate-800/90 transition shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                <div className="bg-slate-800/70 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50 shadow-2xl transform hover:scale-105 transition duration-500">
                  {/* Replace with MindSurf image */}
                  <div className="w-full h-[300px] flex items-center justify-center">
                    <Image 
                      src="/mindsurf.jpg" 
                      alt="MindSurf AI Platform" 
                      width={200} 
                      height={200} 
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-indigo-900/80 p-4 rounded-lg shadow-lg border border-indigo-700/50 backdrop-blur-xl">
                    <div className="flex items-center">
                      <BsRobot className="text-indigo-400 text-2xl mr-2" />
                      <p className="text-slate-200 font-medium">AI-powered learning</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Features Grid */}
        <section id="features" className="px-6 py-16 bg-slate-900/60 backdrop-blur-xl border-y border-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Smart Learning Features
            </motion.h2>
            <motion.p 
              className="text-xl text-slate-300 text-center mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our AI-powered platform adapts to your needs, making learning more efficient and engaging
            </motion.p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {mainFeatures.map((feature, index) => (
                <motion.a 
                  key={index} 
                  href={feature.path}
                  className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 p-6 rounded-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition group cursor-pointer block relative overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-200">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Features Tabs */}
        <section id="how-it-works" className="px-6 py-16 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              How MindSurf Works
            </motion.h2>
            <motion.p 
              className="text-xl text-slate-300 text-center mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our platform uses advanced AI to transform how you learn and understand complex topics
            </motion.p>
            
            <div className="flex flex-wrap justify-center mb-8">
              {detailedFeatures.map((tab, index) => (
                <motion.button 
                  key={tab.id}
                  className={`px-6 py-3 m-2 rounded-full text-lg transition duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-slate-800/50 backdrop-blur-sm text-slate-300 hover:bg-slate-800/80 border border-slate-700/50'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.title}
                </motion.button>
              ))}
            </div>
            
            <AnimatePresence mode="wait">
              {detailedFeatures.map(tab => (
                activeTab === tab.id && (
                  <motion.div 
                    key={tab.id}
                    className="bg-slate-800/60 backdrop-blur-xl p-6 md:p-8 rounded-xl shadow-2xl border border-slate-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                        <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">{tab.title}</h3>
                        <p className="text-lg text-slate-300 mb-6">{tab.description}</p>
                        <ul className="space-y-3">
                          {tab.features.map((feature, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-center"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full p-1 mr-3 shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-slate-300">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <motion.div 
                        className="md:w-1/2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <div className="border border-slate-700/50 rounded-lg overflow-hidden shadow-xl hover:shadow-indigo-500/10 transition duration-300">
                          <img src={tab.image} alt={tab.title} className="rounded-lg transform hover:scale-105 transition duration-500" />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900/80 backdrop-blur-xl text-slate-400 border-t border-slate-800/50 px-6 py-8 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              {/* Using favicon.ico instead of mindsurf-logo.png */}
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