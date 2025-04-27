'use client';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiBook, FiUser, FiBarChart2, FiMessageCircle, FiFileText, FiAward } from 'react-icons/fi';
import { MdQuiz, MdOndemandVideo } from 'react-icons/md';
import { BsRobot, BsLightbulb } from 'react-icons/bs';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

interface RevealTextProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

interface FloatingCardProps {
  children: React.ReactNode;
  delay?: number;
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  factor?: number;
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('learn');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const RevealText = ({ children, delay = 0, className = '' }: RevealTextProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    
    return (
      <div
        ref={ref}
        className={className}
        style={{
          transform: isInView ? "none" : "translateY(40px)",
          opacity: isInView ? 1 : 0,
          transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
        }}
      >
        {children}
      </div>
    );
  };

  const FloatingCard = ({ children, delay = 0 }: FloatingCardProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    
    return (
      <div
        ref={ref}
        style={{
          transform: isInView
            ? "translateY(0px)"
            : "translateY(50px)",
          opacity: isInView ? 1 : 0,
          transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-xl" 
          style={{
            opacity: isInView ? 0.5 : 0,
            transform: isInView ? "translateY(10px)" : "translateY(0px)",
            transition: `all 1.2s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
          }}
        ></div>
        {children}
      </div>
    );
  };

  const ParallaxSection = ({ children, className = '', factor = 0.2 }: ParallaxSectionProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], [0, -100 * factor]);
    
    return (
      <motion.div 
        ref={ref}
        style={{ y }} 
        className={className}
      >
        {children}
      </motion.div>
    );
  };

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
    
    // Updated star system interface
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
        
        // Reset global alpha
        ctx.globalAlpha = 1.0;
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
      
      // Add some slowly falling stars
      // Make a small percentage of stars fall slowly
      stars.forEach(star => {
        // Small chance to start falling if not already falling
        if (!star.isFalling && Math.random() > 0.9997) {
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
      image: '/personalisedimage.jpg' // Updated to use your image
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
      image: '/personalisedimage2.jpg' // Updated to use your image
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
      image: '/personalisedimage3.jpg' // Updated to use your image
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
      image: '/personalisedimage4.jpg' // Updated to use your image
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
        

        {/* Hero Section */}
        <ParallaxSection className="px-6 py-16 md:py-28 relative" factor={0.1}>
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mx-auto max-w-3xl"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
                Your AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Learning Companion</span>
              </h1>
              <p className="text-xl text-slate-300 mb-10 drop-shadow">
                Experience personalized education that adapts to your unique learning style and pace
              </p>
            </motion.div>
          </div>
        </ParallaxSection>

        {/* Main Features Grid with scroll reveal */}
        <section id="features" className="px-6 py-16 bg-slate-900/60 backdrop-blur-xl border-y border-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <RevealText className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                Smart Learning Features
              </h2>
            </RevealText>
            <RevealText delay={0.2} className="text-center">
              <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
                Our AI-powered platform adapts to your needs, making learning more efficient and engaging
              </p>
            </RevealText>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {mainFeatures.map((feature, index) => (
                <FloatingCard key={index} delay={0.1 + index * 0.1}>
                  <motion.a 
                    href={feature.path}
                    className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 p-6 rounded-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition group cursor-pointer block relative overflow-hidden"
                    whileHover={{ y: -10 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-200">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </motion.a>
                </FloatingCard>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Features Tabs */}
        <section id="how-it-works" className="px-6 py-16 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto">
            <RevealText className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 drop-shadow-lg">
                How MindSurf Works
              </h2>
            </RevealText>
            <RevealText delay={0.2} className="text-center">
              <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
                Our platform uses advanced AI to transform how you learn and understand complex topics
              </p>
            </RevealText>
            
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
                        <RevealText>
                          <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">{tab.title}</h3>
                        </RevealText>
                        <RevealText delay={0.1}>
                          <p className="text-lg text-slate-300 mb-6">{tab.description}</p>
                        </RevealText>
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
                      <div className="md:w-1/2 flex justify-end">
                        <FloatingCard delay={0.3}>
                          <div className="border border-slate-700/50 rounded-lg overflow-hidden shadow-xl hover:shadow-indigo-500/10 transition duration-300">
                            <img 
                              src={tab.image} 
                              alt={tab.title} 
                              className="rounded-lg transform hover:scale-105 transition duration-500 w-full h-auto object-cover max-h-68" 
                            />
                          </div>
                        </FloatingCard>
                      </div>
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