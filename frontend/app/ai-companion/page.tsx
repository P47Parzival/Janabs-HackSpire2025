'use client';
import { useState } from 'react';
import { FiBook, FiMessageSquare, FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import { BsRobot, BsLightbulb } from 'react-icons/bs';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  topics: string[];
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: number;
  completed: boolean;
}

interface Summary {
  id: string;
  topic: string;
  content: string;
  date: string;
}

export default function AICompanion() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [activeTab, setActiveTab] = useState<'paths' | 'quizzes' | 'summaries'>('paths');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/analyze-learning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze learning input');
      }

      const data = await response.json();
      setLearningPaths(data.learning_paths);
      setQuizzes(data.quizzes);
      setSummaries(data.summaries);
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing your input');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <BsRobot className="text-blue-600 text-3xl mr-3" />
          <h1 className="text-3xl font-bold text-blue-600">AI Study Companion</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center mb-4">
            <BsLightbulb className="text-yellow-500 text-xl mr-2" />
            <h2 className="text-xl font-semibold">Tell me what you want to learn</h2>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., I want to learn about machine learning basics..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing || !input.trim()}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <FiRefreshCw className="animate-spin mr-2" />
                  Analyzing...
                </div>
              ) : (
                'Analyze'
              )}
            </button>
          </form>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'paths'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('paths')}
            >
              <div className="flex items-center">
                <FiBook className="mr-2" />
                Learning Paths
              </div>
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'quizzes'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('quizzes')}
            >
              <div className="flex items-center">
                <FiBarChart2 className="mr-2" />
                Quizzes
              </div>
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'summaries'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('summaries')}
            >
              <div className="flex items-center">
                <FiMessageSquare className="mr-2" />
                Summaries
              </div>
            </button>
          </div>

          {/* Learning Paths Tab */}
          {activeTab === 'paths' && (
            <div className="grid gap-4">
              {learningPaths.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <FiBook className="text-4xl mx-auto mb-4" />
                  <p>No learning paths generated yet. Enter your learning goals above!</p>
                </div>
              ) : (
                learningPaths.map((path) => (
                  <div key={path.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{path.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        path.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        path.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {path.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{path.description}</p>
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${path.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Progress: {path.progress}%</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {path.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <div className="grid gap-4">
              {quizzes.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <FiBarChart2 className="text-4xl mx-auto mb-4" />
                  <p>No quizzes generated yet. Enter your learning goals above!</p>
                </div>
              ) : (
                quizzes.map((quiz) => (
                  <div key={quiz.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{quiz.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">Topic: {quiz.topic}</p>
                    <p className="text-gray-600 mb-4">{quiz.questions} questions</p>
                    <button
                      className={`w-full py-2 rounded-lg ${
                        quiz.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {quiz.completed ? 'Completed' : 'Start Quiz'}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Summaries Tab */}
          {activeTab === 'summaries' && (
            <div className="grid gap-4">
              {summaries.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <FiMessageSquare className="text-4xl mx-auto mb-4" />
                  <p>No summaries generated yet. Enter your learning goals above!</p>
                </div>
              ) : (
                summaries.map((summary) => (
                  <div key={summary.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{summary.topic}</h3>
                      <span className="text-sm text-gray-500">{summary.date}</span>
                    </div>
                    <p className="text-gray-600">{summary.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 