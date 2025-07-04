"use client";

import React, { useState, useRef, useCallback } from "react";
import "./globals.css";
import Timer from "./components/Timer";
import Score from "./components/Score";
import ControlPanel from "./components/ControlPanel";
import Log from "./components/Log";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamColor, TeamName } from "./constants";
import { useScore } from "./hooks/useScore";

export default function HomePage() {
  // スコア・チーム名・ログのhooks
  const {
    redScore, blueScore,
    redTeamName, blueTeamName,
    logs,
    updateRedScore, updateBlueScore,
    setRedTeamName, setBlueTeamName,
    resetRedScore, resetBlueScore,
    addLog, clearLogs
  } = useScore();

  const [timerDisplay, setTimerDisplay] = useState("00:00");
  const timerDisplayRef = useRef("00:00");

  // TimerのonTickで両方更新
  const handleTimerTick = useCallback((display: string) => {
    setTimerDisplay(display);
    timerDisplayRef.current = display;
  }, []);

  // 得点ログ追加時はrefの値を使う
  const handleAddLog = useCallback(
    (msg: string, color: TeamColor, delta: number, description: string) => {
      updateRedScore(color, delta);
      addLog(description + `（${timerDisplayRef.current}）`, timerDisplayRef.current);
    },
    [updateRedScore]
  );

  return (
    <main className="p-6 bg-white text-black min-h-screen flex flex-col items-center gap-6">
      <header className="w-full flex items-center justify-center gap-4 bg-sky-300/80 text-white py-4 px-6 rounded-xl shadow-md">
        <img src="/logo.png" alt="logo" className="h-10" />
        <h1 className="text-4xl font-bold font-mono tracking-wide">
          関西夏ロボコン2025 スコアボード@デモ版
        </h1>
      </header>

      <div className="w-full flex justify-center items-start gap-8 mb-6">
        <Score
          teamName={redTeamName}
          teamColor="red"
          score={redScore}
          onReset={resetRedScore}
        />
        <div className="flex-shrink-0 w-100">
          <Timer onTick={handleTimerTick} />
        </div>
        <Score
          teamName={blueTeamName}
          teamColor="blue"
          score={blueScore}
          onReset={resetBlueScore}
        />
      </div>

      <div className="w-full flex justify-center items-start gap-8">
        <ControlPanel
          teamName={redTeamName}
          onTeamNameChange={setRedTeamName}
          onScoreChange={(code, delta) => {
            updateRedScore(code, delta);
            addLog(`${redTeamName} ${delta > 0 ? "+" : ""}${delta}点`, timerDisplayRef.current);
          }}
          teamColor="red"
          layout="2xN"
        />
        <div className="flex-shrink-0 mx-16 w-100">
          <Log logs={logs} onClear={clearLogs} />
        </div>
        <ControlPanel
          teamName={blueTeamName}
          onTeamNameChange={setBlueTeamName}
          onScoreChange={(code, delta) => {
            updateBlueScore(code, delta);
            addLog(`${blueTeamName} ${delta > 0 ? "+" : ""}${delta}点`, timerDisplayRef.current);
          }}
          onLog={undefined}
          teamColor="blue"
        />
      </div>
    </main>
  );
}
