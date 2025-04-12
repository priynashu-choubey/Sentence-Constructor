import { useState, useEffect } from "react";
import { Question } from "@/components/Question";
import { GameComplete } from "@/components/GameComplete";
import { Progress } from "@/components/ui/progress";
import type {
  Question as QuestionType,
  QuestionResponse,
  GameState,
} from "@/types";

const TIMER_DURATION = 30;

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    questions: [],
    answers: [],
    timeRemaining: TIMER_DURATION,
    isGameComplete: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (
      !gameState.isGameComplete &&
      gameState.questions.length > 0 &&
      !gameState.isLoading
    ) {
      const timer = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeRemaining <= 0) {
            clearInterval(timer);
            handleTimeUp();
            return prev;
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1,
          };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [
    gameState.isGameComplete,
    gameState.questions,
    gameState.currentQuestionIndex,
    gameState.isLoading,
  ]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:3000/questions");
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      setGameState((prev) => ({
        ...prev,
        questions: data,
        isLoading: false,
        timeRemaining: TIMER_DURATION,
      }));
    } catch (error) {
      setGameState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      }));
    }
  };

  const handleAnswer = (answer: string[]) => {
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = answer.every(
      (word, index) =>
        word.toLowerCase() ===
        currentQuestion.correctAnswer[index].toLowerCase()
    );

    const response: QuestionResponse = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      timeSpent: TIMER_DURATION - gameState.timeRemaining,
    };

    setGameState((prev) => ({
      ...prev,
      answers: [...prev.answers, response],
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      timeRemaining: TIMER_DURATION,
      isGameComplete: prev.currentQuestionIndex + 1 >= prev.questions.length,
    }));
  };

  const handleTimeUp = () => {
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    handleAnswer(Array(currentQuestion.blanks).fill(""));
  };

  const handleRestart = () => {
    setGameState({
      currentQuestionIndex: 0,
      questions: gameState.questions,
      answers: [],
      timeRemaining: TIMER_DURATION,
      isGameComplete: false,
      isLoading: false,
      error: null,
    });
  };

  if (gameState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-white">
        <div className="animate-pulse text-xl">Loading questions...</div>
      </div>
    );
  }

  if (gameState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-white">
        <div className="text-red-500">Error: {gameState.error}</div>
      </div>
    );
  }

  if (gameState.isGameComplete) {
    return (
      <GameComplete
        questions={gameState.questions}
        answers={gameState.answers}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-2">
            Sentence Construction
            <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full text-sm">
              {gameState.currentQuestionIndex + 1}
            </span>
          </h1>
        </div>

        <Question
          question={gameState.questions[gameState.currentQuestionIndex]}
          onAnswer={handleAnswer}
          onTimeUp={handleTimeUp}
          timeRemaining={gameState.timeRemaining}
        />
      </div>
    </div>
  );
}

export default App;
