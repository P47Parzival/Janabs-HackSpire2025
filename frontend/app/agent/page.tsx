'use client';
import { useEffect, useState } from 'react';
import { BsRobot } from 'react-icons/bs';
import { motion } from 'framer-motion';

interface VapiSDK {
  run: (config: VapiConfig) => VapiInstance;
}

interface VapiConfig {
  apiKey: string;
  assistant: string;
  config: {
    button: {
      position: string;
      size: string;
      color: string;
    };
  };
}

interface VapiInstance {
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    vapiSDK: VapiSDK;
  }
}

export default function AgentPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<VapiInstance | null>(null);

  useEffect(() => {
    // Load Vapi SDK
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
    script.defer = true;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const instance = window.vapiSDK.run({
        apiKey: "983bbb07-5ba4-4be5-a854-3e4cefd68604", // Replace this with your actual API key
        assistant: "32b3134b-bf3c-45e9-8e84-091c2ccde8c8",
        config: {
          button: {
            position: 'bottom-right',
            size: 'large',
            color: '#6366f1',
          },
        },
      });
      setVapiInstance(instance);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleStartCall = () => {
    if (vapiInstance) {
      vapiInstance.start();
      setIsCallActive(true);
    }
  };

  const handleEndCall = () => {
    if (vapiInstance) {
      vapiInstance.stop();
      setIsCallActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <BsRobot className="text-6xl text-indigo-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Windsurf Agent</h1>
          <p className="text-xl text-slate-300">
            Your AI-powered learning companion is ready to help you understand complex topics
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-xl border border-slate-700/50 shadow-xl"
        >
          <div className="text-center">
            {!isCallActive ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartCall}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-indigo-500/30 transition"
              >
                Start Conversation
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEndCall}
                className="bg-red-600 text-white px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-red-500/30 transition"
              >
                End Conversation
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 