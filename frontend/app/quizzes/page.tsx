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

interface Module {
  topic: string;
  description: string;
  resources: string[];
  quizQuestions: string[];
}

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
    <Card>
      <CardHeader>
        <CardTitle>Adaptive Learning Assistant</CardTitle>
        <CardDescription>Generate a personalized learning path based on student performance and goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="input"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Goal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Be able to differentiate basic functions..."
                      rows={3}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
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
      </CardContent>
      {result && result.learning_paths && result.learning_paths.length > 0 && (
        <CardFooter className="flex flex-col items-start gap-4 border-t pt-6">
          <h3 className="text-lg font-semibold">Generated Learning Path</h3>
          <Accordion type="single" collapsible className="w-full">
            {result.learning_paths.map((path, index) => (
              <AccordionItem key={path.id} value={`item-${index}`}>
                <AccordionTrigger className="text-base">
                  {path.title}
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pl-4">
                  <p className="text-sm">{path.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Difficulty:</span>
                    <span className="text-sm text-muted-foreground">{path.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Progress:</span>
                    <span className="text-sm text-muted-foreground">{path.progress}%</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Topics:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {path.topics.map((topic, tIndex) => (
                        <li key={tIndex}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {result.quizzes && result.quizzes.length > 0 && (
            <div className="w-full mt-6">
              <h3 className="text-lg font-semibold mb-4">Quizzes</h3>
              <div className="grid gap-4">
                {result.quizzes.map((quiz) => (
                  <Card key={quiz.id}>
                    <CardHeader>
                      <CardTitle>{quiz.title}</CardTitle>
                      <CardDescription>{quiz.topic}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Difficulty:</span>
                        <span className="text-sm text-muted-foreground">{quiz.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Questions:</span>
                        <span className="text-sm text-muted-foreground">{quiz.questions}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {result.summaries && result.summaries.length > 0 && (
            <div className="w-full mt-6">
              <h3 className="text-lg font-semibold mb-4">Summaries</h3>
              <div className="grid gap-4">
                {result.summaries.map((summary) => (
                  <Card key={summary.id}>
                    <CardHeader>
                      <CardTitle>{summary.topic}</CardTitle>
                      <CardDescription>{summary.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{summary.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}