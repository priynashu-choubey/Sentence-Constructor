export interface Question {
  id: number;
  sentence: string;
  options: string[];
  correctAnswer: string[];
  blanks: number;
}

export interface QuestionResponse {
  questionId: number;
  userAnswer: string[];
  isCorrect: boolean;
  timeSpent: number;
}

export interface GameState {
  currentQuestionIndex: number;
  questions: Question[];
  answers: QuestionResponse[];
  timeRemaining: number;
  isGameComplete: boolean;
  isLoading: boolean;
  error: string | null;
}
