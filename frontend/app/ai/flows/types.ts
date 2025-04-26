import { z } from 'zod';

export const ModuleSchema = z.object({
  topic: z.string().describe('The topic of this learning module.'),
  description: z.string().describe('A description of the learning module.'),
  resources: z.array(z.string()).describe('List of resources for this module.'),
  quizQuestions: z.array(z.string()).describe('List of quiz questions for this module.'),
});

export const AdaptiveLearningPathInputSchema = z.object({
  input: z.string().min(10).describe('The learning goal and context'),
});

export type AdaptiveLearningPathInput = z.infer<typeof AdaptiveLearningPathInputSchema>;

export const AdaptiveLearningPathOutputSchema = z.object({
  learning_paths: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    difficulty: z.string(),
    progress: z.number(),
    topics: z.array(z.string()),
  })),
  quizzes: z.array(z.object({
    id: z.string(),
    title: z.string(),
    topic: z.string(),
    difficulty: z.string(),
    questions: z.number(),
    completed: z.boolean(),
  })),
  summaries: z.array(z.object({
    id: z.string(),
    topic: z.string(),
    content: z.string(),
    date: z.string(),
  })),
});

export type AdaptiveLearningPathOutput = z.infer<typeof AdaptiveLearningPathOutputSchema>; 