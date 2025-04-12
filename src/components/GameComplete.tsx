import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Question, QuestionResponse } from "@/types";
import { Trophy, XCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCompleteProps {
  questions: Question[];
  answers: QuestionResponse[];
  onRestart: () => void;
}

export function GameComplete({
  questions,
  answers,
  onRestart,
}: GameCompleteProps) {
  const score = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = questions.length;
  const percentage = (score / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <Card className="max-w-4xl mx-auto p-8 space-y-8 bg-[#242424] border-none">
        <div className="text-center space-y-4">
          <Trophy className="w-20 h-20 mx-auto text-yellow-500" />
          <h2 className="text-4xl font-bold tracking-tight">Game Complete!</h2>
          <div className="space-y-2">
            <p className="text-2xl">
              Your score: <span className="font-bold">{score}</span> out of{" "}
              {totalQuestions}
            </p>
            <p className="text-lg text-gray-400">
              Accuracy: {percentage.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Review Your Answers</h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const answer = answers[index];
              return (
                <div
                  key={question.id}
                  className={cn(
                    "p-6 rounded-lg",
                    answer.isCorrect
                      ? "bg-green-900/20 border border-green-800"
                      : "bg-red-900/20 border border-red-800"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {answer.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-lg">
                          Question {index + 1}
                        </h4>
                        <span className="text-sm text-gray-400">
                          Time taken: {answer.timeSpent}s
                        </span>
                      </div>
                      <p className="text-lg">{question.sentence}</p>
                      {!answer.isCorrect && (
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-400">Correct answer:</p>
                            <p className="font-medium text-green-400">
                              {question.correctAnswer.join(", ")}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Your answer:</p>
                            <p className="font-medium text-red-400">
                              {answer.userAnswer.join(", ") || "No answer"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={onRestart}
            size="lg"
            className="text-lg bg-purple-600 hover:bg-purple-700 text-white"
          >
            Play Again
          </Button>
        </div>
      </Card>
    </div>
  );
}
