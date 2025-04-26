"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateAdaptiveLearningPath, AdaptiveLearningPathOutput } from "@/app/ai/flows/adaptive-learning-path";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { useToast } from "@/app/hooks/use-toast";
import { Loader2, BookOpen, Lightbulb, Target, HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";
import { motion } from "framer-motion";
import { BsLightbulb } from "react-icons/bs";
import { FiBook, FiBarChart2, FiMessageSquare } from "react-icons/fi";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ActiveQuiz {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: number[];
  completed: boolean;
  score: number;
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  completed?: boolean;
}

const formSchema = z.object({
  input: z.string().min(10, {
    message: "Please provide a detailed learning goal (at least 10 characters).",
  }),
});

export default function AdaptiveLearningAssistant() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<AdaptiveLearningPathOutput | null>(null);
  const [activeQuiz, setActiveQuiz] = React.useState<ActiveQuiz | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await generateAdaptiveLearningPath(values);
      console.log('Received output:', output);
      if (!output || !output.learning_paths || !output.quizzes || !output.summaries) {
        throw new Error('Invalid response format from server');
      }
      setResult(output);
    } catch (error) {
      console.error("Error generating learning path:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate the learning path. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Function to generate quiz questions based on the topic and difficulty
  const startQuiz = async (quiz: Quiz) => {
    setIsGeneratingQuiz(true);
    
    try {
      // In a real implementation, this would call your backend to generate questions
      // For now, let's simulate an API call with a timeout
      
      // Simulating API call
      setTimeout(() => {
        // Example of quiz questions generated based on topic and difficulty
        const generatedQuestions: QuizQuestion[] = [
          {
            id: '1',
            question: `What is the key concept in ${quiz.topic}?`,
            options: [
              `First principle of ${quiz.topic}`, 
              `Secondary concept in ${quiz.topic}`, 
              `Advanced application of ${quiz.topic}`, 
              `Historical background of ${quiz.topic}`
            ],
            correctAnswer: 0
          },
          {
            id: '2',
            question: `How would you apply ${quiz.topic} in a real-world scenario?`,
            options: [
              'By analyzing historical data', 
              'Through experimental testing', 
              'Using theoretical models', 
              'All of the above'
            ],
            correctAnswer: 3
          },
          {
            id: '3',
            question: `What problem does ${quiz.topic} primarily solve?`,
            options: [
              'Optimization issues', 
              'Data processing challenges', 
              'Theoretical gaps', 
              'Implementation difficulties'
            ],
            correctAnswer: 1
          },
          {
            id: '4',
            question: `Which of the following is NOT related to ${quiz.topic}?`,
            options: [
              'Core principles', 
              'Application methods', 
              'Unrelated domain knowledge', 
              'Advanced concepts'
            ],
            correctAnswer: 2
          },
          {
            id: '5',
            question: `What's the most challenging aspect of ${quiz.topic}?`,
            options: [
              'Understanding the fundamentals', 
              'Applying in complex scenarios', 
              'Keeping up with new developments', 
              'Integrating with other knowledge areas'
            ],
            correctAnswer: 1
          }
        ];

        // Create active quiz state
        setActiveQuiz({
          id: quiz.id,
          title: quiz.title,
          topic: quiz.topic,
          difficulty: quiz.difficulty,
          questions: generatedQuestions,
          currentQuestionIndex: 0,
          answers: [],
          completed: false,
          score: 0
        });
        
        setIsGeneratingQuiz(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate quiz questions. Please try again.",
      });
      setIsGeneratingQuiz(false);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (!activeQuiz) return;
    
    const newAnswers = [...activeQuiz.answers];
    newAnswers[activeQuiz.currentQuestionIndex] = answerIndex;
    
    setActiveQuiz({
      ...activeQuiz,
      answers: newAnswers
    });
  };

  // Move to next question
  const goToNextQuestion = () => {
    if (!activeQuiz) return;
    
    if (activeQuiz.currentQuestionIndex < activeQuiz.questions.length - 1) {
      setActiveQuiz({
        ...activeQuiz,
        currentQuestionIndex: activeQuiz.currentQuestionIndex + 1
      });
    } else {
      // Calculate score
      const correctAnswers = activeQuiz.answers.filter(
        (answer, index) => answer === activeQuiz.questions[index].correctAnswer
      ).length;
      
      const score = Math.round((correctAnswers / activeQuiz.questions.length) * 100);
      
      // Update quiz completion status
      setActiveQuiz({
        ...activeQuiz,
        completed: true,
        score: score
      });
      
      // Update the progress in the learning paths if applicable
      if (result) {
        const updatedLearningPaths = result.learning_paths.map(path => {
          // For this example, we're updating the path progress if any of its topics matches the quiz topic
          if (path.topics.some(topic => topic.toLowerCase() === activeQuiz.topic.toLowerCase())) {
            // We're increasing progress by 10-30% based on score
            const progressIncrease = score >= 80 ? 30 : score >= 60 ? 20 : 10;
            return {
              ...path,
              progress: Math.min(100, path.progress + progressIncrease)
            };
          }
          return path;
        });
        
        // Update quizzes to mark this one as completed
        const updatedQuizzes = result.quizzes.map(quiz => 
          quiz.id === activeQuiz.id ? { ...quiz, completed: true } : quiz
        );
        
        setResult({
          ...result,
          learning_paths: updatedLearningPaths,
          quizzes: updatedQuizzes
        });
      }
      
      toast({
        title: "Quiz Completed",
        description: `You scored ${score}% on this quiz!`,
      });
    }
  };

  // Reset quiz and go back to main view
  const resetQuiz = () => {
    setActiveQuiz(null);
  };

  const currentQuestion = activeQuiz?.questions[activeQuiz.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-900/80 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Adaptive Learning Assistant
        </motion.h1>
        
        {!activeQuiz ? (
          <>
            <motion.div 
              className="bg-slate-800/60 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <BsLightbulb className="text-yellow-500 text-xl mr-2" />
                <h2 className="text-xl font-semibold text-slate-200">Generate Your Learning Path</h2>
              </div>
              <p className="text-slate-300 mb-6">Input your learning goal and our AI will create a personalized learning path based on your needs.</p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="input"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Learning Goal</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Be able to differentiate basic functions..."
                            rows={3}
                            {...field}
                            disabled={isLoading}
                            className="bg-slate-900/70 border-slate-700 text-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-indigo-500/30 transition w-full md:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Path...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Generate Learning Path
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>

            {result && result.learning_paths && result.learning_paths.length > 0 && (
              <motion.div 
                className="mt-8 space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-slate-800/60 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <FiBook className="text-indigo-400 text-xl mr-2" />
                    <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Learning Paths</h3>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {result.learning_paths.map((path, index) => (
                      <AccordionItem 
                        key={path.id} 
                        value={`item-${index}`}
                        className="border-slate-700 mb-4"
                      >
                        <AccordionTrigger className="text-base text-slate-200 hover:text-indigo-400">
                          {path.title}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pl-4 text-slate-300">
                          <p className="text-sm">{path.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Difficulty:</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              path.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                              path.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {path.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Progress:</span>
                            <div className="w-full max-w-xs bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${path.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-400">{path.progress}%</span>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Topics:</h4>
                            <div className="flex flex-wrap gap-2">
                              {path.topics.map((topic, tIndex) => (
                                <span
                                  key={tIndex}
                                  className="bg-indigo-100/10 text-indigo-300 px-2 py-1 rounded-full text-xs"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {result.quizzes && result.quizzes.length > 0 && (
                  <motion.div 
                    className="bg-slate-800/60 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex items-center mb-6">
                      <FiBarChart2 className="text-indigo-400 text-xl mr-2" />
                      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Quizzes</h3>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {result.quizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-slate-700/50 rounded-lg p-4 hover:shadow-lg hover:shadow-indigo-500/10 transition border border-slate-600/50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-semibold text-slate-200">{quiz.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {quiz.difficulty}
                            </span>
                          </div>
                          <p className="text-slate-400 mb-2">Topic: {quiz.topic}</p>
                          <p className="text-slate-400 mb-4">{quiz.questions} questions</p>
                          <button
                            onClick={() => startQuiz(quiz)}
                            disabled={isGeneratingQuiz}
                            className={`w-full py-2 rounded-lg transition shadow-lg ${
                              quiz.completed
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/10'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/10'
                            }`}
                          >
                            {isGeneratingQuiz ? (
                              <span className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Quiz...
                              </span>
                            ) : quiz.completed ? (
                              'Retake Quiz'
                            ) : (
                              'Start Quiz'
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {result.summaries && result.summaries.length > 0 && (
                  <motion.div 
                    className="bg-slate-800/60 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center mb-6">
                      <FiMessageSquare className="text-indigo-400 text-xl mr-2" />
                      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Summaries</h3>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      {result.summaries.map((summary) => (
                        <div key={summary.id} className="bg-slate-700/50 rounded-lg p-4 hover:shadow-lg hover:shadow-indigo-500/10 transition border border-slate-600/50">
                          <div className="mb-2">
                            <h4 className="text-lg font-semibold text-slate-200">{summary.topic}</h4>
                            <p className="text-xs text-slate-400">{summary.date}</p>
                          </div>
                          <p className="text-slate-300 text-sm">{summary.content}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            className="bg-slate-800/60 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                  {activeQuiz.title}
                </h2>
                <p className="text-slate-300">Topic: {activeQuiz.topic}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                activeQuiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                activeQuiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {activeQuiz.difficulty}
              </span>
            </div>
            
            {/* Quiz Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-300">
                  Question {activeQuiz.currentQuestionIndex + 1} of {activeQuiz.questions.length}
                </span>
                {!activeQuiz.completed && (
                  <span className="text-sm text-slate-300">
                    {Math.round(((activeQuiz.currentQuestionIndex + 1) / activeQuiz.questions.length) * 100)}% Complete
                  </span>
                )}
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: activeQuiz.completed 
                      ? '100%' 
                      : `${((activeQuiz.currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Quiz Content */}
            {activeQuiz.completed ? (
              // Quiz Results
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-500/20 text-indigo-400 text-4xl font-bold mb-4">
                  {activeQuiz.score}%
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">
                  {activeQuiz.score >= 80 
                    ? 'Excellent work!' 
                    : activeQuiz.score >= 60 
                    ? 'Good job!' 
                    : 'Keep practicing!'}
                </h3>
                <p className="text-slate-300 mb-8">
                  You answered {activeQuiz.answers.filter((answer, index) => 
                    answer === activeQuiz.questions[index].correctAnswer
                  ).length} out of {activeQuiz.questions.length} questions correctly.
                </p>
                
                <div className="space-y-6 mb-8">
                  <h4 className="text-lg font-semibold text-slate-200 mb-4">Review Your Answers</h4>
                  {activeQuiz.questions.map((q, idx) => (
                    <div key={q.id} className="bg-slate-700/50 rounded-lg p-4 text-left border border-slate-600/50">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {activeQuiz.answers[idx] === q.correctAnswer ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200 mb-2">
                            {idx + 1}. {q.question}
                          </p>
                          <div className="ml-4">
                            <p className="text-sm text-slate-300">
                              <span className="font-medium">Your answer:</span> {q.options[activeQuiz.answers[idx]]}
                              {activeQuiz.answers[idx] !== q.correctAnswer && (
                                <span className="text-red-400"> (Incorrect)</span>
                              )}
                            </p>
                            {activeQuiz.answers[idx] !== q.correctAnswer && (
                              <p className="text-sm text-green-400 mt-1">
                                <span className="font-medium">Correct answer:</span> {q.options[q.correctAnswer]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={resetQuiz}
                    className="border-slate-600 text-slate-200 hover:bg-slate-700"
                  >
                    Back to Learning Path
                  </Button>
                  <Button 
                    onClick={() => {
                      // Reset the active quiz but keep the same questions
                      setActiveQuiz({
                        ...activeQuiz,
                        currentQuestionIndex: 0,
                        answers: [],
                        completed: false,
                        score: 0
                      });
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
                  >
                    Retry Quiz
                  </Button>
                </div>
              </div>
            ) : (
              // Quiz Questions
              <div>
                <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">
                    {currentQuestion?.question}
                  </h3>
                  
                  <RadioGroup 
                    value={activeQuiz.answers[activeQuiz.currentQuestionIndex]?.toString()} 
                    className="space-y-4"
                  >
                    {currentQuestion?.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex}
                        className={`flex items-center space-x-2 rounded-lg border border-slate-600 p-3 hover:bg-slate-700 transition cursor-pointer ${
                          activeQuiz.answers[activeQuiz.currentQuestionIndex] === optionIndex ? 
                            'bg-indigo-900/30 border-indigo-400/50' : 
                            'bg-slate-800/50'
                        }`}
                        onClick={() => handleAnswerSelect(optionIndex)}
                      >
                        <RadioGroupItem 
                          value={optionIndex.toString()} 
                          id={`option-${optionIndex}`} 
                          className="text-indigo-400"
                        />
                        <Label 
                          htmlFor={`option-${optionIndex}`} 
                          className="flex-grow cursor-pointer text-slate-200 font-medium"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={resetQuiz} 
                    className="border-slate-600 text-slate-200 hover:bg-slate-700"
                  >
                    Exit Quiz
                  </Button>
                  <Button 
                    onClick={goToNextQuestion}
                    disabled={activeQuiz.answers[activeQuiz.currentQuestionIndex] === undefined}
                    className={`bg-gradient-to-r from-indigo-600 to-blue-600 text-white ${
                      activeQuiz.answers[activeQuiz.currentQuestionIndex] === undefined ? 
                        'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {activeQuiz.currentQuestionIndex === activeQuiz.questions.length - 1 
                      ? 'Submit Quiz' 
                      : 'Next Question'
                    }
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}