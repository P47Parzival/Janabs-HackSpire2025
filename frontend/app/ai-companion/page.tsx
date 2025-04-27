'use client';
import { useState, useRef, useEffect } from 'react';
import { FiBook, FiMessageSquare, FiBarChart2, FiRefreshCw, FiStar, FiBookmark, FiDownload, FiTarget, FiTrendingUp, FiBrain } from 'react-icons/fi';
import { BsRobot, BsLightbulb, BsMicFill, BsCalendar3, BsPersonCheck } from 'react-icons/bs';
import { MdQuiz, MdOutlineInsights, MdRecommend, MdPsychology, MdAutoGraph } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/app/components/ui/sheet";
import { Input } from "@/app/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import { Badge } from "@/app/components/ui/badge";
import { Slider } from "@/app/components/ui/slider";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import Chatbot from '@/app/components/chatbot';
import { toast } from "@/app/hooks/use-toast";

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

interface StudySession {
  id: string;
  topic: string;
  date: Date;
  duration: number;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
}

interface LearningStyle {
  visual: number;
  auditory: number;
  reading: number;
  kinesthetic: number;
}

interface LearningInsight {
  id: string;
  type: 'strength' | 'weakness' | 'recommendation';
  topic: string;
  description: string;
  actionable: string;
}

interface PersonalizedSettings {
  preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
  dailyGoalMinutes: number;
  notificationsEnabled: boolean;
  contentPreferences: string[];
  learningStyle: LearningStyle;
}

export default function AICompanion() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [activeTab, setActiveTab] = useState('personalized');
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [learningInsights, setLearningInsights] = useState<LearningInsight[]>([]);
  const [personalizedSettings, setPersonalizedSettings] = useState<PersonalizedSettings>({
    preferredDifficulty: 'intermediate',
    dailyGoalMinutes: 45,
    notificationsEnabled: true,
    contentPreferences: ['Video tutorials', 'Interactive exercises', 'Concise summaries'],
    learningStyle: {
      visual: 70,
      auditory: 40,
      reading: 60,
      kinesthetic: 50
    }
  });
  const [taskDuration, setTaskDuration] = useState<number>(60);
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const savedSessions = localStorage.getItem('studySessions');
    
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
          ...session,
          date: new Date(session.date)
        }));
        setStudySessions(parsedSessions);
      } catch (e) {
        console.error("Error parsing saved sessions:", e);
        setDefaultStudySessions();
      }
    } else {
      setDefaultStudySessions();
    }

    fetchLearningInsights();
  }, []);

  const setDefaultStudySessions = () => {
    const defaultSessions = [
      { id: '1', topic: 'Introduction to Machine Learning', date: new Date(), duration: 45, completed: true },
      { id: '2', topic: 'Neural Networks Basics', date: new Date(Date.now() + 86400000), duration: 60, completed: false },
      { id: '3', topic: 'Data Preprocessing', date: new Date(Date.now() + 172800000), duration: 30, completed: false },
    ];
    
    setStudySessions(defaultSessions);
    localStorage.setItem('studySessions', JSON.stringify(defaultSessions));
  };

  const fetchLearningInsights = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const insights = [
        {
          id: 'insight-1',
          type: 'strength' as const,
          topic: 'Algorithm Comprehension',
          description: 'You show strong understanding of algorithmic concepts and logic structures.',
          actionable: 'Consider exploring advanced algorithm design patterns.'
        },
        {
          id: 'insight-2',
          type: 'weakness' as const,
          topic: 'Statistical Analysis',
          description: 'Data suggests you struggle with applying statistical methods to ML problems.',
          actionable: 'Review the fundamentals of statistical distributions and hypothesis testing.'
        },
        {
          id: 'insight-3',
          type: 'recommendation' as const,
          topic: 'Neural Network Architecture',
          description: "Based on your interests and progress, you're ready for more advanced neural network concepts.",
          actionable: 'Explore convolutional and recurrent neural networks next.'
        }
      ];
      
      setLearningInsights(insights);
    } catch (err) {
      console.error("Error fetching learning insights:", err);
      setError("Failed to load learning insights. Please try again later.");
    }
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('personalizedSettings');
    
    if (savedSettings) {
      try {
        setPersonalizedSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Error parsing saved settings:", e);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

      animationFrameId = requestAnimationFrame(drawBackground);
    };

    drawBackground();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

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
      setLearningPaths(data.learning_paths || []);
      setQuizzes(data.quizzes || []);
      setSummaries(data.summaries || []);
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing your input');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleVoiceInput = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setTimeout(() => {
        setInput("Tell me about machine learning algorithms");
        setIsVoiceActive(false);
      }, 2000);
    }
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteSummaries', JSON.stringify(newFavorites));
  };

  const handleScheduleSession = () => {
    if (!date || !input.trim()) {
      setError("Please enter a session topic and select a date");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newSession: StudySession = {
      id: `session-${Date.now()}`,
      topic: input.trim(),
      date: date,
      duration: 60,
      completed: false
    };

    const updatedSessions = [...studySessions, newSession];
    setStudySessions(updatedSessions);
    
    localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
    
    toast({
      title: "Session Scheduled",
      description: `"${input.trim()}" scheduled for ${date.toLocaleDateString()}`,
      variant: "default"
    });
    
    setInput('');
  };

  const updateLearningStylePreference = (style: keyof LearningStyle, value: number) => {
    const updatedSettings = {
      ...personalizedSettings,
      learningStyle: {
        ...personalizedSettings.learningStyle,
        [style]: value
      }
    };
    
    setPersonalizedSettings(updatedSettings);
    localStorage.setItem('personalizedSettings', JSON.stringify(updatedSettings));
  };

  const toggleContentPreference = (preference: string) => {
    const updatedPreferences = personalizedSettings.contentPreferences.includes(preference)
      ? personalizedSettings.contentPreferences.filter(p => p !== preference)
      : [...personalizedSettings.contentPreferences, preference];
    
    const updatedSettings = {
      ...personalizedSettings,
      contentPreferences: updatedPreferences
    };
    
    setPersonalizedSettings(updatedSettings);
    localStorage.setItem('personalizedSettings', JSON.stringify(updatedSettings));
  };

  const updateDifficultyLevel = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    const updatedSettings = {
      ...personalizedSettings,
      preferredDifficulty: difficulty
    };
    
    setPersonalizedSettings(updatedSettings);
    localStorage.setItem('personalizedSettings', JSON.stringify(updatedSettings));
  };

  const toggleNotifications = (enabled: boolean) => {
    const updatedSettings = {
      ...personalizedSettings,
      notificationsEnabled: enabled
    };
    
    setPersonalizedSettings(updatedSettings);
    localStorage.setItem('personalizedSettings', JSON.stringify(updatedSettings));
    
    if (enabled && "Notification" in window) {
      Notification.requestPermission();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative">
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-0"
      />
      <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-8">
        <motion.div 
          className="max-w-7xl mx-auto w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="h-8 w-8 mr-3 relative">
                <Image 
                  src="/favicon.ico" 
                  alt="MindSurf Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">AI Study Companion</h1>
            </div>
            <Link href="/home">
              <motion.div 
                className="flex items-center bg-slate-800/60 backdrop-blur-xl p-2 rounded-lg border border-slate-700/50 cursor-pointer"
                whileHover={{ scale: 1.03 }}
              >
                <BsPersonCheck className="text-indigo-400 mr-2" />
                <span className="text-slate-300 text-sm">Your Learning Profile</span>
              </motion.div>
            </Link>
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
                <FiTarget className="mr-3 text-xl text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="bg-slate-800/60 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Tabs defaultValue="personalized" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-slate-700">
                <TabsList className="bg-transparent h-14 w-full justify-start gap-4 px-4 overflow-x-auto flex-nowrap">
                  <TabsTrigger value="personalized" className="data-[state=active]:bg-slate-700/50 data-[state=active]:text-indigo-400 rounded-md text-slate-400">
                    <FiTarget className="mr-2" />
                    Personalized
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="data-[state=active]:bg-slate-700/50 data-[state=active]:text-indigo-400 rounded-md text-slate-400">
                    <MdOutlineInsights className="mr-2" />
                    Learning Insights
                  </TabsTrigger>
                  <TabsTrigger value="chatbot" className="data-[state=active]:bg-slate-700/50 data-[state=active]:text-indigo-400 rounded-md text-slate-400">
                    <BsRobot className="mr-2" />
                    AI Assistant
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="personalized" className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="bg-slate-700/40 border-slate-600/50">
                    <CardHeader>
                      <CardTitle className="text-slate-200">Your Learning Profile</CardTitle>
                      <CardDescription className="text-slate-400">
                        We adapt content based on your learning preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-medium">Completed Courses</span>
                          <span className="text-indigo-400">4</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-medium">Quizzes Taken</span>
                          <span className="text-indigo-400">12</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-medium">Study Hours</span>
                          <span className="text-indigo-400">32.5h</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-medium">Current Streak</span>
                          <span className="text-indigo-400">7 days</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-600/30">
                        <h4 className="text-slate-200 font-medium mb-3">Learning Style Analysis</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <Label className="text-slate-300">Visual</Label>
                              <span className="text-indigo-400">{personalizedSettings.learningStyle.visual}%</span>
                            </div>
                            <div className="w-full bg-slate-600/40 h-2 rounded-full">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full"
                                style={{ width: `${personalizedSettings.learningStyle.visual}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <Label className="text-slate-300">Auditory</Label>
                              <span className="text-indigo-400">{personalizedSettings.learningStyle.auditory}%</span>
                            </div>
                            <div className="w-full bg-slate-600/40 h-2 rounded-full">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full"
                                style={{ width: `${personalizedSettings.learningStyle.auditory}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <Label className="text-slate-300">Reading</Label>
                              <span className="text-indigo-400">{personalizedSettings.learningStyle.reading}%</span>
                            </div>
                            <div className="w-full bg-slate-600/40 h-2 rounded-full">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full"
                                style={{ width: `${personalizedSettings.learningStyle.reading}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <Label className="text-slate-300">Kinesthetic</Label>
                              <span className="text-indigo-400">{personalizedSettings.learningStyle.kinesthetic}%</span>
                            </div>
                            <div className="w-full bg-slate-600/40 h-2 rounded-full">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full"
                                style={{ width: `${personalizedSettings.learningStyle.kinesthetic}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/40 border-slate-600/50">
                    <CardHeader>
                      <CardTitle className="text-slate-200">Your Study Tasks</CardTitle>
                      <CardDescription className="text-slate-400">
                        Manage your learning activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* List of upcoming tasks with delete functionality */}
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {studySessions
                          .filter(session => !session.completed)
                          .map(session => (
                            <motion.div 
                              key={session.id} 
                              className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/70 flex justify-between items-center hover:border-indigo-500/30 transition-all"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                            >
                              <div className="flex items-center">
                                <Checkbox 
                                  id={`task-${session.id}`}
                                  className="mr-3 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                                  onCheckedChange={() => {
                                    const updatedSessions = studySessions.map(s => 
                                      s.id === session.id ? {...s, completed: true} : s
                                    );
                                    setStudySessions(updatedSessions);
                                    localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
                                    toast({
                                      title: "Task completed",
                                      description: `"${session.topic}" marked as done`,
                                      variant: "default"
                                    });
                                  }}
                                />
                                <div>
                                  <h4 className="text-slate-200 font-medium">{session.topic}</h4>
                                  <div className="flex items-center text-xs text-slate-400">
                                    <BsCalendar3 className="mr-1" />
                                    <span>
                                      {session.date.toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                      })}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>{session.duration} min</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {session.priority && (
                                  <Badge className={`
                                    ${session.priority === 'high' ? 'bg-red-500/20 text-red-400' : 
                                      session.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                                      'bg-green-500/20 text-green-400'}
                                  `}>
                                    {session.priority}
                                  </Badge>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                  onClick={() => {
                                    const updatedSessions = studySessions.filter(s => s.id !== session.id);
                                    setStudySessions(updatedSessions);
                                    localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
                                    toast({
                                      title: "Task removed",
                                      description: `"${session.topic}" removed from your tasks`,
                                      variant: "destructive"
                                    });
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        {studySessions.filter(session => !session.completed).length === 0 && (
                          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
                            <p className="text-slate-400 text-sm">No tasks yet. Add one below.</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Add new task UI */}
                      <div className="pt-4 border-t border-slate-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-slate-200 font-medium">Add New Task</h4>
                          <Badge variant="outline" className="border-indigo-400/30 text-indigo-400">
                            Plan Your Learning
                          </Badge>
                        </div>
                        
                        <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700/50 shadow-inner">
                          <div className="mb-4">
                            <Label className="text-slate-300 mb-2 block text-sm font-medium">Task Topic</Label>
                            <Input
                              placeholder="What do you want to learn?"
                              className="bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500 focus:ring-indigo-500/30"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label className="text-slate-300 mb-2 block text-sm font-medium">Estimated Duration</Label>
                              <Select defaultValue="60" onValueChange={(value) => setTaskDuration(parseInt(value))}>
                                <SelectTrigger className="bg-slate-900/60 border-slate-700 text-slate-200">
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                  <SelectItem value="15">15 minutes</SelectItem>
                                  <SelectItem value="30">30 minutes</SelectItem>
                                  <SelectItem value="45">45 minutes</SelectItem>
                                  <SelectItem value="60">60 minutes</SelectItem>
                                  <SelectItem value="90">90 minutes</SelectItem>
                                  <SelectItem value="120">2 hours</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-slate-300 mb-2 block text-sm font-medium">Priority</Label>
                              <Select defaultValue="medium" onValueChange={(value) => setTaskPriority(value as 'low' | 'medium' | 'high')}>
                                <SelectTrigger className="bg-slate-900/60 border-slate-700 text-slate-200">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => {
                              if (!input.trim()) {
                                setError("Please enter a task topic");
                                setTimeout(() => setError(null), 3000);
                                return;
                              }

                              const newTask: StudySession = {
                                id: `task-${Date.now()}`,
                                topic: input.trim(),
                                date: new Date(),
                                duration: taskDuration || 60,
                                completed: false,
                                priority: taskPriority || 'medium'
                              };

                              const updatedSessions = [...studySessions, newTask];
                              setStudySessions(updatedSessions);
                              localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
                              
                              toast({
                                title: "Task Added",
                                description: `"${input.trim()}" added to your tasks`,
                                variant: "default"
                              });
                              
                              setInput('');
                            }}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg hover:shadow-indigo-500/20 transition py-3 mt-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <path d="M12 5v14"></path>
                              <path d="M5 12h14"></path>
                            </svg>
                            Add Learning Task
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-8">
                  <div className="flex items-center mb-4">
                    <MdRecommend className="text-indigo-400 text-xl mr-2" />
                    <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                      AI Recommendations
                    </h3>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <motion.div 
                      className="bg-slate-700/40 rounded-lg border border-slate-600/50 p-5 hover:shadow-lg transition"
                      whileHover={{ y: -5 }}
                    >
                      <Badge className="bg-indigo-400/20 text-indigo-400 mb-3">Based on Learning Style</Badge>
                      <h4 className="text-lg font-semibold text-slate-200 mb-2">Visual Guide to Neural Networks</h4>
                      <p className="text-slate-400 text-sm mb-3">Interactive visualizations designed for your visual learning preference.</p>
                      <Link href="/quizzes">
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600">Explore Content</Button>
                      </Link>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-slate-700/40 rounded-lg border border-slate-600/50 p-5 hover:shadow-lg transition"
                      whileHover={{ y: -5 }}
                    >
                      <Badge className="bg-green-400/20 text-green-400 mb-3">Personalized Path</Badge>
                      <h4 className="text-lg font-semibold text-slate-200 mb-2">Advanced Statistical Methods</h4>
                      <p className="text-slate-400 text-sm mb-3">Targeted practice on topics our AI identified for improvement.</p>
                      <Link href="/quizzes">
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600">Start Learning</Button>
                      </Link>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-slate-700/40 rounded-lg border border-slate-600/50 p-5 hover:shadow-lg transition"
                      whileHover={{ y: -5 }}
                    >
                      <Badge className="bg-yellow-400/20 text-yellow-400 mb-3">Next Topic</Badge>
                      <h4 className="text-lg font-semibold text-slate-200 mb-2">Convolutional Networks Workshop</h4>
                      <p className="text-slate-400 text-sm mb-3">Hands-on practice to build on your algorithm comprehension strength.</p>
                      <Link href="/quizzes">
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600">Join Now</Button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="p-6">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <MdPsychology className="text-indigo-400 text-xl mr-2" />
                    <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                      Your Learning Analytics
                    </h3>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <Card className="bg-slate-700/40 border-slate-600/50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="inline-block p-3 bg-indigo-500/20 rounded-full mb-2">
                            <FiTrendingUp className="text-2xl text-indigo-400" />
                          </div>
                          <h4 className="text-xl font-bold text-slate-200">24 days</h4>
                          <p className="text-sm text-slate-400">Current learning streak</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-700/40 border-slate-600/50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="inline-block p-3 bg-green-500/20 rounded-full mb-2">
                            <MdAutoGraph className="text-2xl text-green-400" />
                          </div>
                          <h4 className="text-xl font-bold text-slate-200">75%</h4>
                          <p className="text-sm text-slate-400">Knowledge retention</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-700/40 border-slate-600/50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="inline-block p-3 bg-yellow-500/20 rounded-full mb-2">
                            <FiBarChart2 className="text-2xl text-yellow-400" />
                          </div>
                          <h4 className="text-xl font-bold text-slate-200">12/15</h4>
                          <p className="text-sm text-slate-400">Topics mastered</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Personalized Learning Insights</h3>
                  <div className="space-y-4">
                    {learningInsights.map(insight => (
                      <motion.div 
                        key={insight.id}
                        className={`bg-slate-700/40 rounded-lg border p-4 ${
                          insight.type === 'strength' ? 'border-green-500/30' :
                          insight.type === 'weakness' ? 'border-red-500/30' :
                          'border-yellow-500/30'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${
                            insight.type === 'strength' ? 'bg-green-500/20' :
                            insight.type === 'weakness' ? 'bg-red-500/20' :
                            'bg-yellow-500/20'
                          }`}>
                            {insight.type === 'strength' && <FiBarChart2 className="text-green-400" />}
                            {insight.type === 'weakness' && <FiTarget className="text-red-400" />}
                            {insight.type === 'recommendation' && <MdRecommend className="text-yellow-400" />}
                          </div>
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-md font-semibold text-slate-200">{insight.topic}</h4>
                              <Badge className={`${
                                insight.type === 'strength' ? 'bg-green-400/20 text-green-400' :
                                insight.type === 'weakness' ? 'bg-red-400/20 text-red-400' :
                                'bg-yellow-400/20 text-yellow-400'
                              }`}>
                                {insight.type === 'strength' ? 'Strength' : 
                                 insight.type === 'weakness' ? 'Focus Area' : 'Recommendation'}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">{insight.description}</p>
                            <div className="mt-3 pt-3 border-t border-slate-600/50">
                              <p className="text-sm text-indigo-400">Action step: {insight.actionable}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="chatbot" className="p-6">
                <Chatbot />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}