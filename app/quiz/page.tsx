"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/landing/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, CheckCircle2, XCircle, BrainCircuit } from "lucide-react";
import Link from "next/link";

type Level = "easy" | "medium" | "hard";

interface Question {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export default function QuizPage() {
  const [level, setLevel] = useState<Level>("easy");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchQuestions(level);
  }, [level]);

  const fetchQuestions = async (currentLevel: Level) => {
    setIsLoading(true);
    setHasError(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentIndex(0);
    setScore(0);
    
    try {
      const res = await fetch(`/api/quiz?level=${currentLevel}`);
      const data = await res.json();
      console.log("API Response:", data);
      
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        console.error("Failed to fetch questions", data);
        setHasError(true);
      }
    } catch (err) {
      console.error(err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (showExplanation) return; // Prevent changing answer after selection
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (questions[currentIndex].options[index].startsWith(questions[currentIndex].correct)) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleLevelCompletion();
    }
  };

  const handleLevelCompletion = () => {
    if (score >= 2) {
      if (level === "easy") {
        setLevel("medium");
      } else if (level === "medium") {
        setLevel("hard");
      } else {
        setIsFinished(true); // Completed hard
      }
    } else {
      setIsFinished(true); // Failed to progress
    }
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen flex flex-col bg-slate-50 pt-24">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <h2 className="text-xl font-display text-slate-700">Generating {level} questions...</h2>
          <p className="text-slate-500 text-sm mt-2">Hang tight while Mitra prepares your challenge!</p>
        </div>
        <footer className="w-full py-6 mt-auto border-t border-slate-200">
          <p className="text-center font-mono text-sm text-slate-500">Created by Nag Shakti</p>
        </footer>
      </main>
    );
  }

  if (hasError || !questions || questions.length === 0) {
    return (
      <main className="relative min-h-screen flex flex-col bg-slate-50 pt-24">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Oops! Something went wrong.</h2>
          <p className="text-slate-600 mb-8 max-w-md">
            We couldn't generate your quiz questions right now. The AI might be busy or there was a network error.
          </p>
          <Button 
            onClick={() => fetchQuestions(level)} 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 shadow-sm"
          >
            Try Again
          </Button>
        </div>
        <footer className="w-full py-6 mt-auto border-t border-slate-200">
          <p className="text-center font-mono text-sm text-slate-500">Created by Nag Shakti</p>
        </footer>
      </main>
    );
  }

  if (isFinished) {
    return (
      <main className="relative min-h-screen flex flex-col bg-slate-50 pt-24">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white border border-slate-200 shadow-xl rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
              <BrainCircuit className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Ability Score Card</h1>
            <p className="text-slate-600 mb-8">
              {score >= 2 && level === "hard" 
                ? "Incredible job! You mastered the Hard level."
                : `You reached the ${level} level. You scored ${score}/${questions.length} on your last attempt.`}
            </p>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-slate-800 mb-2">Mitra's Feedback:</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {score >= 2 
                  ? "Bohot badhiya! Aapke concepts clear lag rahe hain. Aise hi practice karte raho!"
                  : "Koi baat nahi! Concepts thode weak hain, par hum isko improve kar lenge. Chalo saath mein padhte hain."}
              </p>
            </div>

            <Link href="/chat">
              <Button className="w-full h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg transition-all shadow-sm">
                Start Chatting with Mitra
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        <footer className="w-full py-6 mt-auto border-t border-slate-200">
          <p className="text-center font-mono text-sm text-slate-500">Created by Nag Shakti</p>
        </footer>
      </main>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <main className="relative min-h-screen flex flex-col bg-slate-50 overflow-hidden pt-24">
      <Navigation />

      <div className="relative flex-1 flex flex-col items-center z-10 p-6 w-full max-w-3xl mx-auto">
        
        {/* Progress header */}
        <div className="w-full flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100 w-fit">
              {level} Level
            </span>
          </div>
          <div className="text-slate-500 font-medium">
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Question Card */}
        {currentQ && (
          <div className="w-full bg-white border border-slate-200 shadow-xl rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-display font-semibold text-slate-900 mb-8 leading-snug">
              {currentQ.question}
            </h2>

            <div className="flex flex-col gap-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = option.startsWith(currentQ.correct);
                const showCorrect = showExplanation && isCorrect;
                const showWrong = showExplanation && isSelected && !isCorrect;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      showCorrect
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : showWrong
                        ? "border-red-500 bg-red-50 text-red-900"
                        : isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-slate-100 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-lg">{option}</span>
                    {showCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />}
                    {showWrong && <XCircle className="w-6 h-6 text-red-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {showExplanation && (
              <div className={`mt-6 p-5 rounded-2xl border ${
                currentQ.options[selectedAnswer!].startsWith(currentQ.correct)
                  ? "bg-emerald-50 border-emerald-100" 
                  : "bg-red-50 border-red-100"
              }`}>
                <p className="text-slate-800 text-sm leading-relaxed">
                  <span className="font-semibold block mb-1">
                    {currentQ.options[selectedAnswer!].startsWith(currentQ.correct) ? "Sahi Jawab! 🎉" : "Oops! 💡"}
                  </span>
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {showExplanation && (
          <div className="w-full flex justify-end">
            <Button 
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 text-base shadow-sm"
            >
              {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      <footer className="w-full py-6 mt-auto border-t border-slate-200">
        <p className="text-center font-mono text-sm text-slate-500">
          Created by Nag Shakti
        </p>
      </footer>
    </main>
  );
}
