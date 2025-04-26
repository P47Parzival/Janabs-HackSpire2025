'use client';
import { useState, useRef, useEffect } from 'react';
import { FiBook, FiMessageSquare, FiBarChart2, FiRefreshCw, FiStar, FiBookmark, FiDownload, FiTarget, FiTrendingUp, FiBrain } from 'react-icons/fi';
import { BsRobot, BsLightbulb, BsMicFill, BsCalendar3, BsPersonCheck } from 'react-icons/bs';
import { MdQuiz, MdOutlineInsights, MdRecommend, MdPsychology, MdAutoGraph } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setStudySessions([
      { id: '1', topic: 'Introduction to Machine Learning', date: new Date(), duration: 45, completed: true },
      { id: '2', topic: 'Neural Networks Basics', date: new Date(Date.now() + 86400000), duration: 60, completed: false },
      { id: '3', topic: 'Data Preprocessing', date: new Date(Date.now() + 172800000), duration: 30, completed: false },
    ]);

    setLearningInsights([
      {
        id: 'insight-1',
        type: 'strength',
        topic: 'Algorithm Comprehension',
        description: 'You show strong understanding of algorithmic concepts and logic structures.',
        actionable: 'Consider exploring advanced algorithm design patterns.'
      },
      {
        id: 'insight-2',
        type: 'weakness',
        topic: 'Statistical Analysis',
        description: 'Data suggests you struggle with applying statistical methods to ML problems.',
        actionable: 'Review the fundamentals of statistical distributions and hypothesis testing.'
      },
      {
        id: 'insight-3',
        type: 'recommendation',
        topic: 'Neural Network Architecture',
        description: "Based on your interests and progress, you're ready for more advanced neural network concepts.",
        actionable: 'Explore convolutional and recurrent neural networks next.'
      }
    ]);
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
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleScheduleSession = () => {
    if (!date) return;

    const newSession: StudySession = {
      id: `session-${studySessions.length + 1}`,
      topic: input || "Study Session",
      date: date,
      duration: 60,
      completed: false
    };

    setStudySessions([...studySessions, newSession]);
  };

  const updateLearningStylePreference = (style: keyof LearningStyle, value: number) => {
    setPersonalizedSettings({
      ...personalizedSettings,
      learningStyle: {
        ...personalizedSettings.learningStyle,
        [style]: value
      }
    });
  };

  const toggleContentPreference = (preference: string) => {
    if (personalizedSettings.contentPreferences.includes(preference)) {
      setPersonalizedSettings({
        ...personalizedSettings,
        contentPreferences: personalizedSettings.contentPreferences.filter(p => p !== preference)
      });
    } else {
      setPersonalizedSettings({
        ...personalizedSettings,
        contentPreferences: [...personalizedSettings.contentPreferences, preference]
      });
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
            <motion.div 
              className="flex items-center bg-slate-800/60 backdrop-blur-xl p-2 rounded-lg border border-slate-700/50"
              whileHover={{ scale: 1.03 }}
            >
              <BsPersonCheck className="text-indigo-400 mr-2" />
              <span className="text-slate-300 text-sm">Your Learning Profile</span>
            </motion.div>
          </div>
          
          {/* Error notification */}
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
          
         
             
                  
          
          {/* Content Tabs */}
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
              
              {/* Personalized Tab */}
              <TabsContent value="personalized" className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="bg-slate-700/40 border-slate-600/50">
                    <CardHeader>
                      <CardTitle className="text-slate-200">Your Learning Style</CardTitle>
                      <CardDescription className="text-slate-400">
                        We adapt content to match your preferred learning style
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label className="text-slate-300">Visual</Label>
                          <span className="text-indigo-400">{personalizedSettings.learningStyle.visual}%</span>
                        </div>
                        <Slider
                          value={[personalizedSettings.learningStyle.visual]}
                          max={100}
                          step={1}
                          className="[&>span]:bg-indigo-500"
                          onValueChange={(value) => updateLearningStylePreference('visual', value[0])}
                        />
                        
                        <div className="flex justify-between">
                          <Label className="text-slate-300">Auditory</Label>
                          <span className="text-indigo-400">{personalizedSettings.learningStyle.auditory}%</span>
                        </div>
                        <Slider
                          value={[personalizedSettings.learningStyle.auditory]}
                          max={100}
                          step={1}
                          className="[&>span]:bg-indigo-500"
                          onValueChange={(value) => updateLearningStylePreference('auditory', value[0])}
                        />
                        
                        <div className="flex justify-between">
                          <Label className="text-slate-300">Reading/Writing</Label>
                          <span className="text-indigo-400">{personalizedSettings.learningStyle.reading}%</span>
                        </div>
                        <Slider
                          value={[personalizedSettings.learningStyle.reading]}
                          max={100}
                          step={1}
                          className="[&>span]:bg-indigo-500"
                          onValueChange={(value) => updateLearningStylePreference('reading', value[0])}
                        />
                        
                        <div className="flex justify-between">
                          <Label className="text-slate-300">Kinesthetic</Label>
                          <span className="text-indigo-400">{personalizedSettings.learningStyle.kinesthetic}%</span>
                        </div>
                        <Slider
                          value={[personalizedSettings.learningStyle.kinesthetic]}
                          max={100}
                          step={1}
                          className="[&>span]:bg-indigo-500"
                          onValueChange={(value) => updateLearningStylePreference('kinesthetic', value[0])}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600">
                        Run Learning Style Assessment
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-slate-700/40 border-slate-600/50">
                    <CardHeader>
                      <CardTitle className="text-slate-200">Your Preferences</CardTitle>
                      <CardDescription className="text-slate-400">
                        Customize how you want to learn
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-300 mb-2 block">Preferred Content Types</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {['Video tutorials', 'Interactive exercises', 'Concise summaries', 'Text articles', 'Code examples', 'Visual diagrams'].map(preference => (
                              <div key={preference} className="flex items-center space-x-2">
                                <Checkbox 
                                  checked={personalizedSettings.contentPreferences.includes(preference)}
                                  onCheckedChange={() => toggleContentPreference(preference)}
                                  className="data-[state=checked]:bg-indigo-500"
                                />
                                <label className="text-sm text-slate-300">{preference}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-slate-300 mb-2 block">Default Difficulty Level</Label>
                          <Select 
                            value={personalizedSettings.preferredDifficulty}
                            onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                              setPersonalizedSettings({...personalizedSettings, preferredDifficulty: value})}
                          >
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-slate-300">Enable Learning Notifications</Label>
                            <p className="text-xs text-slate-400">Get reminders and suggestions</p>
                          </div>
                          <Switch 
                            checked={personalizedSettings.notificationsEnabled}
                            onCheckedChange={(checked) => 
                              setPersonalizedSettings({...personalizedSettings, notificationsEnabled: checked})}
                            className="data-[state=checked]:bg-indigo-500"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600">
                        Save Preferences
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                {/* Recommended for you section */}
                <div className="mt-8">
                  <div className="flex items-center mb-4">
                    <MdRecommend className="text-indigo-400 text-xl mr-2" />
                    <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                      Recommended For You
                    </h3>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <motion.div 
                      className="bg-slate-700/40 rounded-lg border border-slate-600/50 p-5 hover:shadow-lg transition"
                      whileHover={{ y: -5 }}
                    >
                      <Badge className="bg-indigo-400/20 text-indigo-400 mb-3">Matches Your Style</Badge>
                      <h4 className="text-lg font-semibold text-slate-200 mb-2">Visual Introduction to Neural Networks</h4>
                      <p className="text-slate-400 text-sm mb-3">An interactive visualization of neural network concepts with diagrams and animations.</p>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600">Start Learning</Button>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-slate-700/40 rounded-lg border border-slate-600/50 p-5 hover:shadow-lg transition"
                      whileHover={{ y: -5 }}
                    >
                      <Badge className="bg-green-400/20 text-green-400 mb-3">Knowledge Gap</Badge>
                      <h4 className="text-lg font-semibold text-slate-200 mb-2">Statistical Foundations for ML</h4>
                      <p className="text-slate-400 text-sm mb-3">Addresses your identified weakness in statistical concepts with practical examples.</p>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600">Start Learning</Button>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-slate-700/40 rounded-lg border border-slate-600/50 p-5 hover:shadow-lg transition"
                      whileHover={{ y: -5 }}
                    >
                      <Badge className="bg-yellow-400/20 text-yellow-400 mb-3">Advanced Topic</Badge>
                      <h4 className="text-lg font-semibold text-slate-200 mb-2">CNN Architecture Masterclass</h4>
                      <p className="text-slate-400 text-sm mb-3">Building on your algorithm strengths - dive into advanced neural network design.</p>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600">Start Learning</Button>
                    </motion.div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Insights Tab */}
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
                
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600">
                  Generate Comprehensive Learning Report
                </Button>
              </TabsContent>
              
              {/* Learning Paths Tab */}
              <TabsContent value="paths" className="p-6">
                {learningPaths.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {learningPaths.map(path => (
                      <motion.div 
                        key={path.id}
                        className="bg-slate-700/40 rounded-lg border border-slate-600/50 p-5 hover:shadow-lg transition"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-slate-200">{path.title}</h3>
                          <Badge className={`${
                            path.difficulty === 'beginner' ? 'bg-green-400/20 text-green-400' :
                            path.difficulty === 'intermediate' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-red-400/20 text-red-400'
                          }`}>
                            {path.difficulty}
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-sm mb-4">{path.description}</p>
                        
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-slate-400">Progress</span>
                            <span className="text-sm text-indigo-400">{path.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-600/30 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full"
                              style={{ width: `${path.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Topics:</h4>
                          <div className="flex flex-wrap gap-2">
                            {path.topics.map((topic, index) => (
                              <span 
                                key={index}
                                className="bg-slate-800 text-slate-300 px-2 py-1 rounded-full text-xs"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button variant="outline" className="border-slate-600 text-slate-300">
                            <FiBookmark className="mr-1" /> Save
                          </Button>
                          <Button className="bg-gradient-to-r from-indigo-600 to-blue-600">
                            Continue Learning
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-block p-4 bg-slate-700/40 rounded-full mb-4">
                      <FiBook className="text-4xl text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-200 mb-2">No Learning Paths Yet</h3>
                    <p className="text-slate-400 mb-6">Enter a topic above to generate personalized learning paths</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Quizzes Tab */}
              <TabsContent value="quizzes" className="p-6">
                {quizzes.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map(quiz => (
                      <motion.div 
                        key={quiz.id}
                        className="bg-slate-700/40 rounded-lg border border-slate-600/50 p-5 hover:shadow-lg transition"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-slate-200">{quiz.title}</h3>
                          <Badge className={`${
                            quiz.difficulty === 'easy' ? 'bg-green-400/20 text-green-400' :
                            quiz.difficulty === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-red-400/20 text-red-400'
                          }`}>
                            {quiz.difficulty}
                          </Badge>
                        </div>
                        <p className="text-slate-400 mb-1">Topic: {quiz.topic}</p>
                        <p className="text-slate-400 mb-4">{quiz.questions} questions</p>
                        
                        <Button
                          className={`w-full ${
                            quiz.completed 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-gradient-to-r from-indigo-600 to-blue-600'
                          }`}
                        >
                          {quiz.completed ? 'Retake Quiz' : 'Start Quiz'}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-block p-4 bg-slate-700/40 rounded-full mb-4">
                      <MdQuiz className="text-4xl text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-200 mb-2">No Quizzes Available</h3>
                    <p className="text-slate-400 mb-6">Enter a topic above to generate quizzes to test your knowledge</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Summaries Tab */}
              <TabsContent value="summaries" className="p-6">
                {summaries.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {summaries.map(summary => (
                      <motion.div 
                        key={summary.id}
                        className="bg-slate-700/40 rounded-lg border border-slate-600/50 p-5 hover:shadow-lg transition"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-slate-200">{summary.topic}</h3>
                            <span className="text-xs text-slate-400">{summary.date}</span>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">{summary.content}</p>
                        <div className="flex justify-between mt-4 pt-3 border-t border-slate-600/50">
                          <Button variant="outline" className="border-slate-600 text-slate-300">
                            <FiStar className={`mr-1 ${favorites.includes(summary.id) ? 'text-yellow-400' : ''}`} />
                            {favorites.includes(summary.id) ? 'Favorited' : 'Favorite'}
                          </Button>
                          <Button variant="outline" className="border-slate-600 text-slate-300">
                            <FiDownload className="mr-1" /> Download
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-block p-4 bg-slate-700/40 rounded-full mb-4">
                      <FiMessageSquare className="text-4xl text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-200 mb-2">No Summaries Available</h3>
                    <p className="text-slate-400 mb-6">Enter a topic above to generate concise summaries for quick review</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Chatbot Tab */}
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