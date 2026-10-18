import { useState } from "react";
import { Trophy, Award, CheckCircle2, Target } from "lucide-react";
import confetti from "canvas-confetti";

const tiers = [
  { name: "Apprentice Reader", count: 3, icon: "🥉", desc: "Completed 3 classic literature works" },
  { name: "Literary Scholar", count: 6, icon: "🥈", desc: "Conquered 6 multi-era masterpieces" },
  { name: "Renaissance Bibliophile", count: 12, icon: "🥇", desc: "Mastered 12 foundational classics" },
  { name: "Grandmaster of the Canon", count: 20, icon: "💎", desc: "Read 20+ world-changing works" },
];

const AnnualReadingChallenge = ({ readCount = 0 }) => {
  const [goal, setGoal] = useState(12);

  const percent = Math.min(100, Math.round((readCount / goal) * 100));

  const celebrateTier = (tier) => {
    if (readCount >= tier.count) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        console.debug(e);
      }
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950/40 p-6 sm:p-8 text-white shadow-xl">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Annual Literature Quest
              </span>
            </div>
            <h3 className="mt-1 font-serif text-2xl font-bold text-white">
              2026 Classic Reading Challenge
            </h3>
            <p className="mt-0.5 text-xs text-slate-300">
              Commit to deep reading and unlock milestones as you complete titles.
            </p>
          </div>

          {/* Goal Selector */}
          <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 p-1 text-xs">
            <Target className="h-3.5 w-3.5 text-amber-400 ml-2" />
            <span className="text-slate-400 text-[11px] font-medium">Goal:</span>
            {[6, 12, 24].map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`rounded-xl px-2.5 py-1 font-bold transition ${
                  goal === g
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {g} Books
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar & Metric */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-200">
              Progress: <strong className="text-amber-400">{readCount}</strong> of {goal} books read
            </span>
            <span className="text-amber-400 font-extrabold">{percent}%</span>
          </div>

          <div className="mt-2.5 h-3 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 transition-all duration-700 shadow-md"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Milestone Badges Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tiers.map((tier) => {
            const isUnlocked = readCount >= tier.count;

            return (
              <div
                key={tier.name}
                onClick={() => celebrateTier(tier)}
                className={`group relative flex flex-col justify-between rounded-2xl p-3.5 border transition cursor-pointer ${
                  isUnlocked
                    ? "border-amber-400/40 bg-amber-950/30 text-amber-100 hover:scale-102 hover:border-amber-400 shadow-lg"
                    : "border-slate-800 bg-slate-900/40 opacity-50 text-slate-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tier.icon}</span>
                    {isUnlocked ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Award className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                  <h4 className="mt-2 text-xs font-bold font-serif leading-tight text-white">
                    {tier.name}
                  </h4>
                  <p className="mt-1 text-[11px] leading-snug text-slate-300">
                    {tier.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-bold text-amber-300">
                  {isUnlocked ? "✓ Unlocked" : `Requires ${tier.count} Books`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnnualReadingChallenge;
