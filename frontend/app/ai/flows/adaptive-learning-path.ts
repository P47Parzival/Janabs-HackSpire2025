'use server';
/**
 * @fileOverview Adaptive learning path generator flow.
 *
 * - generateAdaptiveLearningPath - A function that generates a tailored learning path based on student performance.
 * - AdaptiveLearningPathInput - The input type for the generateAdaptiveLearningPath function.
 * - AdaptiveLearningPathOutput - The return type for the generateAdaptiveLearningPath function.
 */

export interface AdaptiveLearningPathInput {
  input: string;
}

export interface AdaptiveLearningPathOutput {
  learning_paths: Array<{
    id: string;
    title: string;
    description: string;
    difficulty: string;
    progress: number;
    topics: string[];
  }>;
  quizzes: Array<{
    id: string;
    title: string;
    topic: string;
    difficulty: string;
    questions: number;
    completed: boolean;
  }>;
  summaries: Array<{
    id: string;
    topic: string;
    content: string;
    date: string;
  }>;
}

export async function generateAdaptiveLearningPath(
  input: AdaptiveLearningPathInput
): Promise<AdaptiveLearningPathOutput> {
  try {
    // Use environment variable for the API URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    const response = await fetch(`${API_URL}/analyze-learning`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      // Add these options to help with server-side fetch issues
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate learning path');
    }

    const data = await response.json();
    
    return {
      learning_paths: data.learning_paths,
      quizzes: data.quizzes,
      summaries: data.summaries
    };
  } catch (error) {
    console.error('Error generating learning path:', error);
    throw error;
  }
}