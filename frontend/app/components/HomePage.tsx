'use client';
import { useState } from 'react';
import { FiMenu, FiX, FiBook, FiUser, FiBarChart2, FiMessageCircle, FiFileText, FiAward } from 'react-icons/fi';
import { MdQuiz, MdOndemandVideo } from 'react-icons/md';
import { BsRobot, BsLightbulb } from 'react-icons/bs';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('learn');

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
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <BsLightbulb className="text-blue-600 text-2xl mr-2" />
            <h1 className="text-2xl font-bold text-blue-600">LearnFlow</h1>
          </div>
          
          <button 
            className="md:hidden text-blue-600 text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          
          <div className={`${isMenuOpen ? 'absolute top-16 left-0 right-0 bg-white shadow-md p-4' : 'hidden'} md:block md:relative md:top-0 md:shadow-none md:p-0`}>
            <ul className="md:flex space-y-4 md:space-y-0 md:space-x-6 items-center">
              <li><a href="#features" className="block py-2 md:py-0 hover:text-blue-600 font-medium">Features</a></li>
              <li><a href="#how-it-works" className="block py-2 md:py-0 hover:text-blue-600 font-medium">How It Works</a></li>
              <li><a href="#testimonials" className="block py-2 md:py-0 hover:text-blue-600 font-medium">Testimonials</a></li>
              <li><a href="#login" className="block py-2 md:py-0 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">Login</a></li>
              <li><a href="#signup" className="block py-2 md:py-0 border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition">Sign Up</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 bg-gradient-to-b from-blue-100 to-blue-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Your AI-Powered <span className="text-blue-600">Learning Companion</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience personalized education that adapts to your unique learning style and pace
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transform hover:scale-105 transition shadow-lg">
                Start Learning Now
              </button>
              <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-full text-lg hover:bg-blue-50 transition">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-xl">
                <img src="/api/placeholder/500/300" alt="LearnFlow AI Platform" className="rounded-lg" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-blue-100 p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <BsRobot className="text-blue-600 text-2xl mr-2" />
                  <p className="text-blue-800 font-medium">AI-powered learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section id="features" className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Smart Learning Features</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our AI-powered platform adapts to your needs, making learning more efficient and engaging
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainFeatures.map((feature, index) => (
              <a 
                key={index} 
                href={feature.path}
                className="bg-blue-50 p-6 rounded-xl hover:shadow-lg transition group hover:bg-blue-100 cursor-pointer block"
              >
                <div className="mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features Tabs */}
      <section id="how-it-works" className="px-6 py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How LearnFlow Works</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our platform uses advanced AI to transform how you learn and understand complex topics
          </p>
          
          <div className="flex flex-wrap justify-center mb-8">
            {detailedFeatures.map(tab => (
              <button 
                key={tab.id}
                className={`px-6 py-3 m-2 rounded-full text-lg transition ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-blue-600 hover:bg-blue-100'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.title}
              </button>
            ))}
          </div>
          
          {detailedFeatures.map(tab => (
            <div 
              key={tab.id} 
              className={`${activeTab === tab.id ? 'block' : 'hidden'} bg-white p-6 md:p-8 rounded-xl shadow-lg`}
            >
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                  <h3 className="text-2xl font-bold mb-4 text-blue-600">{tab.title}</h3>
                  <p className="text-lg text-gray-700 mb-6">{tab.description}</p>
                  <ul className="space-y-3">
                    {tab.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-1 mr-3">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:w-1/2">
                  <img src={tab.image} alt={tab.title} className="rounded-lg shadow-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-16 bg-blue-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img src="/api/placeholder/500/300" alt="Gamified Learning" className="rounded-lg shadow-lg" />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold mb-6">Gamified Learning Experience</h2>
            <p className="text-lg text-gray-700 mb-6">
              Make learning fun and engaging with achievement badges, streaks, and challenges
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FiAward className="text-blue-500 text-xl mt-1 mr-3" />
                <div>
                  <h4 className="font-semibold">Achievement Badges</h4>
                  <p className="text-gray-600">Earn badges as you master new concepts and complete challenges</p>
                </div>
              </li>
              <li className="flex items-start">
                <MdQuiz className="text-blue-500 text-xl mt-1 mr-3" />
                <div>
                  <h4 className="font-semibold">Learning Missions</h4>
                  <p className="text-gray-600">Complete personalized missions tailored to your learning goals</p>
                </div>
              </li>
              <li className="flex items-start">
                <FiUser className="text-blue-500 text-xl mt-1 mr-3" />
                <div>
                  <h4 className="font-semibold">Peer Collaboration</h4>
                  <p className="text-gray-600">Compare progress with peers or collaborate on group challenges</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8">
            Join thousands of students experiencing the future of education with LearnFlow
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-50 transform hover:scale-105 transition shadow-lg">
              Get Started Free
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 px-6 py-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BsLightbulb className="text-blue-400 text-2xl mr-2" />
              <h3 className="text-xl font-bold text-white">LearnFlow</h3>
            </div>
            <p>Your AI-powered learning companion for personalized education.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Features</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition">AI Study Companion</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Content Analysis</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Smart Quizzes</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Progress Tracking</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Tutorials</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <p>Subscribe to our newsletter</p>
            <form className="mt-2 flex">
              <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-full w-full text-gray-800" />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-full">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-700 text-center">
          <p>&copy; 2024 LearnFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}