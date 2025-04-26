'use client';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiBook, FiUser, FiBarChart2, FiMessageCircle, FiFileText, FiAward } from 'react-icons/fi';
import { MdQuiz, MdOndemandVideo } from 'react-icons/md';
import { BsRobot, BsLightbulb } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('learn');
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    
    const circles: Circle[] = [];
    for (let i = 0; i < 15; i++) {
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 50 + Math.random() * 150,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        color: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#4f46e5' : '#0ea5e9'
      });
    }
    
    const drawBackground = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update circle positions
      circles.forEach(circle => {
        circle.x += circle.vx;
        circle.y += circle.vy;
        
        // Bounce off walls
        if (circle.x < -circle.radius) circle.x = canvas.width + circle.radius;
        if (circle.x > canvas.width + circle.radius) circle.x = -circle.radius;
        if (circle.y < -circle.radius) circle.y = canvas.height + circle.radius;
        if (circle.y > canvas.height + circle.radius) circle.y = -circle.radius;
        
        // Draw gradient circle
        const gradient = ctx.createRadialGradient(circle.x, circle.y, 0, circle.x, circle.y, circle.radius);
        gradient.addColorStop(0, circle.color + '40'); // 25% opacity
        gradient.addColorStop(1, circle.color + '00'); // 0% opacity
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Create light pattern overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let i = 0; i < canvas.width; i += 20) {
        for (let j = 0; j < canvas.height; j += 20) {
          if (Math.random() > 0.85) {
            ctx.fillRect(i, j, 2, 2);
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(drawBackground);
    };
    
    drawBackground();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const mainFeatures = [
    {
      title: "AI Study Companion",
      description: "Your personalized learning assistant powered by advanced AI to help you understand complex topics",
      icon: <BsRobot className="text-blue-500 text-3xl" />,
      path: "/ai-companion"
    },
    {
      title: "Smart Content Analysis",
      description: "Upload any textbook content or YouTube videos and get simplified explanations instantly",
      icon: <FiFileText className="text-blue-500 text-3xl" />,
      path: "/content-analysis"
    },
    {
      title: "Interactive Quizzes",
      description: "Customized assessments that adapt to your learning pace with instant feedback",
      icon: <MdQuiz className="text-blue-500 text-3xl" />,
      path: "/quizzes"
    },
    {
      title: "Progress Tracking",
      description: "Visual insights into your learning journey with personalized improvement recommendations",
      icon: <FiBarChart2 className="text-blue-500 text-3xl" />,
      path: "/progress"
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
      image: '/api/placeholder/500/300'
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
      image: '/api/placeholder/500/300'
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
      image: '/api/placeholder/500/300'
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
      image: '/api/placeholder/500/300'
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
    <div className="min-h-screen flex flex-col relative">
      {/* Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-0"
      />
      
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="backdrop-blur-xl bg-white/90 shadow-2xl px-6 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div 
              className="flex items-center"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <BsLightbulb className="text-blue-600 text-2xl mr-2" />
              <h1 className="text-2xl font-bold text-blue-600">LearnFlow</h1>
            </motion.div>
            
            <button 
              className="md:hidden text-blue-600 text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
            
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl p-4 md:hidden z-50"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ul className="space-y-4">
                    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <a href="#features" className="block py-2 hover:text-blue-600 font-medium">Features</a>
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <a href="#how-it-works" className="block py-2 hover:text-blue-600 font-medium">How It Works</a>
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <a href="#testimonials" className="block py-2 hover:text-blue-600 font-medium">Testimonials</a>
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <a href="#login" className="block py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-xl hover:shadow-blue-400/50">Login</a>
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <a href="#signup" className="block py-2 border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition">Sign Up</a>
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
                      className="hover:text-blue-600 font-medium relative overflow-hidden group"
                    >
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full duration-300"></span>
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
                  <a href="#login" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-blue-400/50 transition">Login</a>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a href="#signup" className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition">Sign Up</a>
                </motion.li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-6 py-16 md:py-24 relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 mb-6 drop-shadow-lg">
                Your AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Learning Companion</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 drop-shadow">
                Experience personalized education that adapts to your unique learning style and pace
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full text-lg shadow-xl hover:shadow-blue-500/50 transform transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Learning Now
                </motion.button>
                <motion.button 
                  className="bg-white/90 backdrop-blur-sm text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-full text-lg hover:bg-blue-100 transition shadow-md"
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
                <div className="bg-white/90 backdrop-blur-xl p-6 rounded-xl shadow-2xl transform hover:scale-105 transition duration-500">
                  <img src="/api/placeholder/500/300" alt="LearnFlow AI Platform" className="rounded-lg" />
                  <div className="absolute -bottom-4 -right-4 bg-blue-100 p-4 rounded-lg shadow-lg">
                    <div className="flex items-center">
                      <BsRobot className="text-blue-600 text-2xl mr-2" />
                      <p className="text-blue-800 font-medium">AI-powered learning</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Features Grid */}
        <section id="features" className="px-6 py-16 bg-slate-900/75 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-4 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Smart Learning Features
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto"
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
                  className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl hover:shadow-2xl transition group cursor-pointer block relative overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Features Tabs */}
        <section id="how-it-works" className="px-6 py-16 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-4 text-white drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              How LearnFlow Works
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-200 text-center mb-12 max-w-3xl mx-auto"
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
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl' 
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 shadow-lg'
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
                    className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-xl shadow-2xl border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                        <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{tab.title}</h3>
                        <p className="text-lg text-gray-200 mb-6">{tab.description}</p>
                        <ul className="space-y-3">
                          {tab.features.map((feature, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-center"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-1 mr-3 shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-gray-200">{feature}</span>
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
                        <img src={tab.image} alt={tab.title} className="rounded-lg shadow-xl transform hover:scale-105 transition duration-500" />
                      </motion.div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900/90 backdrop-blur-xl text-gray-300 px-6 py-8 mt-auto">
          <div className="max-w-7xl mx-auto">
            <p className="text-center">&copy; 2025 Mindsurf. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}