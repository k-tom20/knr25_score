import { useState, useEffect, useCallback } from "react";
import { MatchType, Phase, TIMER_CONFIG } from "../constants";

interface UseTimerReturn {
  time: number; // 残り時間（s）
  formattedTime: string; // 分秒形式でフォーマットされた時間（mm:ss）
  phase: Phase; // 現在のフェーズ（setup, countdown, running, finished）
  running: boolean; // タイマーが動作中かどうか
  matchType: MatchType; // 現在の試合形式（testrun, match, free）
  freeTimeInput: { minutes: number; seconds: number }; // 自由形式タイマーの入力値（分秒）
  startTimer: () => void; // タイマーを開始する関数
  pauseTimer: () => void; // タイマーを一時停止する関数
  resetTimer: () => void; // タイマーをリセットする関数
  setMatchType: (type: MatchType) => void; // 試合形式を設定する関数
  setFreeTimeInput: (input: { minutes: number; seconds: number }) => void; // 自由形式タイマーの入力値を設定する関数
  formatTime: (sec: number) => string; // 秒数を分秒形式でフォーマットする関数
  getPhaseDisplay: () => string; // 現在のフェーズに応じた表示名を取得する関数
  getPhaseColor: () => string; // 現在のフェーズに応じた色を取得する関数
  nextPhase: () => void; // 次のフェーズに進める関数
}

export const useTimer = (): UseTimerReturn => {
  const [matchType, setMatchTypeState] = useState<MatchType>("testrun");
  const [phase, setPhase] = useState<Phase>("setup");
  const [time, setTime] = useState<number>(TIMER_CONFIG.SETUP_TIME);
  const [running, setRunning] = useState(false);
  const [freeTimeInput, setFreeTimeInput] = useState({
    minutes: 1,
    seconds: 0,
  });

  // 秒数を分秒形式でフォーマットするヘルパー関数
  const formatTime = useCallback((sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, []);

  const formattedTime = formatTime(time); // 分秒形式でフォーマットされた時間（mm:ss）

  // 現在のフェーズに応じた表示名を取得する関数
  const getPhaseDisplay = useCallback(() => {
    if (phase === "running" && matchType !== "free") {
      return matchType === "testrun" ? "テストラン中" : "試合中";
    }
    return phase === "running" && matchType === "free"
      ? "自由タイマー"
      : phase === "setup"
        ? "セッティングタイム"
        : phase === "countdown"
          ? "スタートカウントダウン"
          : phase === "finished"
            ? "終了"
            : "";
  }, [phase, matchType]);

  // 現在のフェーズに応じた色を取得する関数
  const getPhaseColor = useCallback(() => {
    const colors = {
      setup: "text-green-600",
      countdown: "text-yellow-900",
      running: "text-red-600",
      finished: "text-red-600",
    };
    return colors[phase] || "text-gray-600";
  }, [phase]);

  // 1. nextPhaseを先に定義
  const nextPhase = useCallback(() => {
    // 修正箇所（nextPhase）
    if (phase === "setup") {
      if (matchType === "testrun") {
        setPhase("running");
        setTime(TIMER_CONFIG.MATCH_TIMES.testrun);
        setRunning(true);
      } else if (matchType === "match") {
        setPhase("countdown");
        setTime(TIMER_CONFIG.COUNTDOWN_TIME);
        setRunning(true); // ★これを追加
      }
    }
    if (phase === "countdown") {
      setPhase("running");
      setRunning(true);
    }
  }, [phase, matchType]);

  const startTimer = useCallback(() => {
    if (running) return;

    if (phase === "setup" && time === 0) {
      nextPhase();
      setRunning(true); // ★これを追加
    } else if (phase === "countdown" && !running) {
      setRunning(true);
    } else if (phase === "running" && time === 0) {
      if (matchType === "testrun") {
        setTime(TIMER_CONFIG.MATCH_TIMES.testrun);
      } else if (matchType === "match") {
        setTime(TIMER_CONFIG.MATCH_TIMES.match);
      }
      setRunning(true);
    } else if (matchType === "free") {
      const total = freeTimeInput.minutes * 60 + freeTimeInput.seconds;
      if (total > 0) {
        setTime(total);
        setPhase("running");
        setRunning(true);
      }
    } else {
      setRunning(true);
    }
  }, [running, phase, time, matchType, freeTimeInput, nextPhase]);

  // 試合形式を設定する関数
  const setMatchType = useCallback(
    (newRaceType: MatchType) => {
      setMatchTypeState(newRaceType);
      if (newRaceType === "free") {
        const total = freeTimeInput.minutes * 60 + freeTimeInput.seconds;
        setTime(total);
      } else {
        setTime(TIMER_CONFIG.SETUP_TIME);
      }
      setPhase("setup");
      setRunning(false);
    },
    [freeTimeInput]
  );

  // タイマーを一時停止する関数
  const pauseTimer = useCallback(() => {
    setRunning(false);
  }, []);

  // タイマーをリセットする関数
  const resetTimer = useCallback(() => {
    if (matchType === "free") {
      const total = freeTimeInput.minutes * 60 + freeTimeInput.seconds;
      setTime(total);
      setPhase("setup");
    } else {
      setTime(TIMER_CONFIG.SETUP_TIME);
      setPhase("setup");
    }
    setRunning(false);
  }, [matchType, freeTimeInput]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime - 1;

        if (newTime <= 0) {
          switch (phase) {
            case "setup":
              setRunning(false); // 自動では止めるだけ
              return 0;
            case "countdown":
              // カウントダウン終了後、試合時間をセットして試合開始
              setPhase("running");
              return TIMER_CONFIG.MATCH_TIMES.match;
            case "running":
              setPhase("finished");
              setRunning(false);
              return 0;
            default:
              return 0;
          }
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, phase, matchType]);

  

  return {
    time,
    formattedTime,
    phase,
    running,
    matchType,
    freeTimeInput,
    startTimer,
    pauseTimer,
    resetTimer,
    setMatchType,
    setFreeTimeInput,
    formatTime,
    getPhaseDisplay,
    getPhaseColor,
    nextPhase,
  };
};
