import { useState } from "react";
import confetti from "canvas-confetti";
import { Trophy, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { playSuccessChime } from "../../utils/audio";

const triviaQuestions = [
  {
    id: 1,
    question: "In Harper Lee's 'To Kill a Mockingbird', what was Atticus Finch's profession?",
    options: ["Doctor", "Lawyer / Attorney", "School Principal", "Judge"],
    answer: 1,
    explanation: "Atticus Finch is an upright attorney in Maycomb who bravely defends Tom Robinson.",
  },
  {
    id: 2,
    question: "Which Roman Emperor penned the famous Stoic philosophy journal 'Meditations'?",
    options: ["Julius Caesar", "Nero", "Marcus Aurelius", "Augustus"],
    answer: 2,
    explanation: "Marcus Aurelius wrote Meditations during military campaigns between 161 and 180 AD.",
  },
  {
    id: 3,
    question: "What is the famous fictional language created by George Orwell in '1984'?",
    options: ["Newspeak", "Old High Valyrian", "Esperanto", "Elvish"],
    answer: 0,
    explanation: "Newspeak was designed by the totalitarian Party to eliminate rogue or rebellious thought.",
  },
  {
    id: 4,
    question: "Who wrote 'Frankenstein' during the Year Without a Summer at only 18 years old?",
    options: ["Jane Austen", "Mary Shelley", "Virginia Woolf", "Emily Brontë"],
    answer: 1,
    explanation: "Mary Shelley conceived Frankenstein during a ghost story contest in Lake Geneva with Lord Byron.",
  },
  {
    id: 5,
    question: "What is the name of the protagonist hobbit in J.R.R. Tolkien's 'The Hobbit'?",
    options: ["Frodo Baggins", "Bilbo Baggins", "Samwise Gamgee", "Peregrin Took"],
    answer: 1,
    explanation: "Bilbo Baggins leaves his cozy smial at Bag End on an epic quest to the Lonely Mountain.",
  },
];

const LiteraryTrivia = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = triviaQuestions[currentIdx];

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < triviaQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      playSuccessChime();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.debug(e);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="relative my-12 overflow-hidden rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-900 via-indigo-950 to-slate-950 p-6 sm:p-10 text-white shadow-2xl">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Literary Knowledge Lab
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-violet-200">
            {isCompleted ? "Completed" : `Question ${currentIdx + 1} of ${triviaQuestions.length}`}
          </span>
        </div>

        {!isCompleted ? (
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-6">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentQ.options.map((option, idx) => {
                const isCorrect = idx === currentQ.answer;
                const isChosen = idx === selectedOption;

                let btnStyle =
                  "border-white/10 bg-white/5 text-slate-200 hover:bg-white/15 hover:border-violet-400";
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-500 bg-emerald-950/70 text-emerald-100 font-bold";
                  } else if (isChosen) {
                    btnStyle = "border-rose-500 bg-rose-950/70 text-rose-100";
                  } else {
                    btnStyle = "border-white/5 bg-white/5 opacity-40 text-slate-400";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left text-sm transition-all duration-200 ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {isAnswered && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next */}
            {isAnswered && (
              <div className="rounded-2xl border border-violet-500/30 bg-violet-950/50 p-4 mb-6 animate-in fade-in">
                <p className="text-xs text-violet-200 leading-relaxed">
                  <strong className="text-amber-300">💡 Insight:</strong> {currentQ.explanation}
                </p>
                <button
                  onClick={handleNext}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:brightness-110 transition"
                >
                  <span>{currentIdx + 1 === triviaQuestions.length ? "Finish Quiz" : "Next Question"}</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex p-4 rounded-full bg-amber-400/20 text-amber-300 mb-4 animate-bounce">
              <Trophy className="w-12 h-12" />
            </div>
            <h4 className="text-2xl sm:text-3xl font-black text-white">
              Quiz Completed!
            </h4>
            <p className="mt-2 text-base text-slate-300">
              You scored <span className="font-extrabold text-amber-400">{score}</span> out of{" "}
              <span className="font-extrabold">{triviaQuestions.length}</span>!
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {score >= 4
                ? "🌟 Master of Classic Literature! Your literary scholarship shines."
                : "📚 Great effort! Every read makes you wiser. Explore more books on Book Vibe!"}
            </p>

            <button
              onClick={restartQuiz}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-violet-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Challenge</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiteraryTrivia;
