'use client';
import { useState } from 'react';
import { FiUpload, FiYoutube, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';

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

        const response = await fetch('http://localhost:8000/upload', {
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
      const response = await fetch('http://localhost:8000/process-youtube', {
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
      const response = await fetch('http://localhost:8000/chat', {
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
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">Smart Content Analysis</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Upload Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Upload Your Content</h2>
            
            {/* File Upload Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FiUpload className="text-blue-500 text-xl mr-2" />
                <h3 className="text-lg font-medium">Upload PDF or Document</h3>
              </div>
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
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
                  <div className="text-blue-500 mb-2">
                    <FiUpload className="text-3xl mx-auto" />
                  </div>
                  <p className="text-gray-600">
                    {selectedFile ? selectedFile.name : 'Drag and drop your file here or click to browse'}
                  </p>
                </label>
              </div>
              {isProcessing && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-blue-600 mt-2">
                    Processing document... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            {/* YouTube URL Section */}
            <div>
              <div className="flex items-center mb-4">
                <FiYoutube className="text-red-500 text-xl mr-2" />
                <h3 className="text-lg font-medium">YouTube Video Analysis</h3>
              </div>
              <form onSubmit={handleYoutubeSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter YouTube URL"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                />
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isProcessing || !youtubeUrl.trim()}
                >
                  Analyze
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <BsRobot className="text-blue-500 text-xl mr-2" />
              <h2 className="text-xl font-semibold">AI Assistant</h2>
            </div>
            
            {/* Chat Messages */}
            <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <FiMessageSquare className="text-4xl mx-auto mb-4" />
                  <p>Upload a document or enter a YouTube URL to start asking questions</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-gray-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))
              )}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-blue-100 text-gray-800 p-3 rounded-lg max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about your content..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!conversationId || isProcessing}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!conversationId || isProcessing || !inputMessage.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 