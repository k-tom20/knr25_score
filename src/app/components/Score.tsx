"use client";
import { TeamColor } from "../constants";

interface ScoreProps {
  teamName: string; // チーム名
  teamColor: TeamColor; // チームカラー
  score: number; // スコア
  onReset: () => void; // リセットボタン
}

// スコアボードのチームカラー設定
const TEAM_COLOR_CONFIG = {
  red: {
    bg: "bg-red-500/75",
    button: "bg-red-800 hover:bg-red-700",
    text: "text-white",
  },
  blue: {
    bg: "bg-blue-500/75",
    button: "bg-blue-800 hover:bg-blue-700",
    text: "text-white",
  },
} as const;

export default function Score({
  teamName,
  teamColor,
  score,
  onReset,
}: ScoreProps) {
  const colors = TEAM_COLOR_CONFIG[teamColor];

  return (
    <div
      className={`
      flex-1 h-[600px] max-w-[600px]
      ${colors.bg} ${colors.text}
      flex flex-col items-center justify-center
      p-8 rounded-2xl shadow-xl ring-4 ring-white/30
      transition-all duration-300 ease-in-out
    `}
    >
      {" "}
      <h2 className="text-3xl font-bold mb-8">{teamName}</h2>
      <div className={`text-[120px] font-dseg7 px-6 py-4 inline-block`}>
        {" "}
        {score}
      </div>
      <button
        onClick={onReset}
        className={`${colors.button} px-8 py-4 rounded-2xl text-white transition-colors`}
      >
        リセット
      </button>
    </div>
  );
}
