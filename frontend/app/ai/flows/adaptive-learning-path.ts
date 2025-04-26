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
    const response = await fetch('http://localhost:8000/analyze-learning', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate learning path');
    }

    const responseText = await response.text();
    // Remove the ```json and ``` markers if present
    const cleanJson = responseText.replace(/```json\n|\n```/g, '');
    const data = JSON.parse(cleanJson);
    
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