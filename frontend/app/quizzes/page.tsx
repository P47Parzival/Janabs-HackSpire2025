"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateAdaptiveLearningPath, AdaptiveLearningPathInput, AdaptiveLearningPathOutput } from "@/app/ai/flows/adaptive-learning-path";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { useToast } from "@/app/hooks/use-toast";
import { Loader2, BookOpen, Lightbulb, Target, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";
import { motion } from "framer-motion";
import { BsLightbulb } from "react-icons/bs";
import { FiBook, FiBarChart2, FiMessageSquare } from "react-icons/fi";

type LearningPath = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  progress: number;
  topics: string[];
};

type Quiz = {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  questions: number;
};

type Summary = {
  id: string;
  topic: string;
  content: string;
  date: string;
};

const formSchema = z.object({
  input: z.string().min(10, {
    message: "Please provide a detailed learning goal (at least 10 characters).",
  }),
});

export default function AdaptiveLearningAssistant() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<AdaptiveLearningPathOutput | null>(null);
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
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/10"
                      >
                        Start Quiz
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
      </div>
    </div>
  );
}