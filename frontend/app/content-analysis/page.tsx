'use client';
import { useState } from 'react';
import { FiUpload, FiYoutube, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ContentAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setError(null);
      setIsProcessing(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to process document');
        }

        const data = await response.json();
        setConversationId(data.conversation_id);
        setMessages([{
          text: "Document processed successfully! You can now ask questions about it.",
          isUser: false
        }]);
        setUploadProgress(100);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while processing the document');
        setMessages([]);
        setConversationId(null);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;

    setError(null);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const response = await fetch(`${API_URL}/process-youtube`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: youtubeUrl.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.detail?.includes('Could not retrieve a transcript')) {
          throw new Error('This video is either unavailable, private, age-restricted, or has no captions available. Please try a different video with available captions.');
        }
        throw new Error(errorData.detail || 'Failed to process YouTube video');
      }

      const data = await response.json();
      setConversationId(data.conversation_id);
      setMessages([{
        text: "YouTube video processed successfully! You can now ask questions about it.",
        isUser: false
      }]);
      setUploadProgress(100);
      setYoutubeUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the YouTube video');
      setMessages([]);
      setConversationId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !conversationId) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInputMessage('');
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.answer, isUser: false }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your question');
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't process your request. Please try again.", 
        isUser: false 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col p-8">
      <motion.div 
        className="max-w-7xl mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center mb-8">
          <div className="h-8 w-8 mr-3 relative">
            <Image 
              src="/favicon.ico" 
              alt="MindSurf Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Smart Content Analysis</h1>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              className="bg-red-900/30 backdrop-blur-sm border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-6 flex items-center shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FiAlertCircle className="mr-3 text-xl text-red-400" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Upload Section */}
          <motion.div 
            className="bg-slate-800/60 backdrop-blur-xl p-6 rounded-xl shadow-2xl border border-slate-700/50"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 mb-6">Upload Your Content</h2>
            
            {/* File Upload Section */}
            <div className="mb-8 group">
              <div className="flex items-center mb-4">
                <FiUpload className="text-indigo-400 text-xl mr-2" />
                <h3 className="text-lg font-medium text-slate-200">Upload PDF or Document</h3>
              </div>
              <div className="border-2 border-dashed border-slate-700/70 hover:border-indigo-500/50 rounded-xl p-8 text-center transition-colors duration-300 group-hover:bg-slate-800/30">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={isProcessing}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer block ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <motion.div 
                    className="text-indigo-400 mb-3"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <FiUpload className="text-4xl mx-auto" />
                  </motion.div>
                  <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                    {selectedFile ? selectedFile.name : 'Drag and drop your file here or click to browse'}
                  </p>
                </label>
              </div>
              {isProcessing && (
                <motion.div 
                  className="mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-full bg-slate-700/50 rounded-full h-2.5">
                    <motion.div 
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-center text-indigo-400 mt-2">
                    Processing document... {uploadProgress}%
                  </p>
                </motion.div>
              )}
            </div>

            {/* YouTube URL Section */}
            <div>
              <div className="flex items-center mb-4">
                <FiYoutube className="text-red-400 text-xl mr-2" />
                <h3 className="text-lg font-medium text-slate-200">YouTube Video Analysis</h3>
              </div>
              <form onSubmit={handleYoutubeSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter YouTube URL"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1 p-3 border border-slate-700 bg-slate-800/80 text-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                  disabled={isProcessing}
                />
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white px-5 py-3 rounded-lg hover:shadow-lg hover:shadow-red-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isProcessing || !youtubeUrl.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Analyze
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Right Side - Chat Interface */}
          <motion.div 
            className="bg-slate-800/60 backdrop-blur-xl p-6 rounded-xl shadow-2xl border border-slate-700/50"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <BsRobot className="text-indigo-400 text-xl mr-2" />
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">AI Assistant</h2>
            </div>
            
            {/* Chat Messages */}
            <div className="h-[400px] overflow-y-auto mb-6 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {messages.length === 0 ? (
                <motion.div 
                  className="text-center text-slate-500 mt-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <FiMessageSquare className="text-5xl mx-auto mb-4 text-indigo-400/60" />
                  <p className="text-slate-400">Upload a document or enter a YouTube URL to start asking questions</p>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-xl shadow-lg ${
                        message.isUser
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                          : 'bg-slate-700/50 text-slate-200 border border-slate-600/30'
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))
              )}
              {isProcessing && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-slate-700/50 text-slate-200 p-4 rounded-xl shadow-lg border border-slate-600/30 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about your content..."
                className="flex-1 p-3 border border-slate-700 bg-slate-800/80 text-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                disabled={!conversationId || isProcessing}
              />
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-3 rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!conversationId || isProcessing || !inputMessage.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}