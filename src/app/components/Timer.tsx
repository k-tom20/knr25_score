"use client";

import React, { useEffect, useRef } from "react";

import { useSound } from "use-sound";

import { MATCH_TYPES, TIMER_CONFIG } from "../constants";
import { useTimer } from "../hooks/useTimer";

interface TimerProps {
  onTick?: (display: string) => void; // タイマーの更新時に呼ばれるコールバック(オプション)
}

// 秒数を分と秒にフォーマットするヘルパー関数
const formatMinutes = (sec: number) => {
  if (sec % 60 === 0) {
    return `${sec / 60}分`;
  }
  return `${Math.floor(sec / 60)}分${sec % 60}秒`;
};

export default function Timer({ onTick }: TimerProps) {
  const {
    time,
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
  } = useTimer();

  const [countPlay] = useSound("/count.mp3");
  const [overPlay] = useSound("/over.mp3");

  const prevPhaseRef = useRef<string>("");
  const prevTimeRef = useRef<number>(-1);

  // カウントダウン時
  useEffect(() => {
    if (phase === "countdown" && running && time !== prevTimeRef.current) {
      countPlay();
    }
    prevTimeRef.current = time;
  }, [phase, running, time, countPlay]);

  // 終了時
  useEffect(() => {
    // running→finishedに遷移した瞬間 or timeが0になった瞬間
    if (
      (prevPhaseRef.current !== "finished" && phase === "finished") ||
      (phase === "running" && time === 0 && prevTimeRef.current !== 0)
    ) {
      overPlay();
    }
    prevPhaseRef.current = phase;
    prevTimeRef.current = time;
  }, [phase, time, overPlay]);

  useEffect(() => {
    if (onTick) onTick(formatTime(time));
  }, [time, formatTime, onTick]);

  return (
    <div className="w-full h-[600px] p-10 bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl shadow-2xl ring-4 ring-white/40">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          試合形式選択
        </label>
        <select
          value={matchType}
          onChange={(e) =>
            setMatchType(e.target.value as (typeof MATCH_TYPES)[number])
          }
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={running}
        >
          <option value="testrun">テストラン（5分）</option>
          <option value="match">試合（3分）</option>
          <option value="free">自由形式</option>
        </select>

        {matchType === "free" && (
          <div className="mt-3 flex gap-2">
            <input
              type="number"
              min={0}
              value={freeTimeInput.minutes}
              onChange={(e) =>
                setFreeTimeInput({
                  ...freeTimeInput,
                  minutes: parseInt(e.target.value, 10) || 0,
                })
              }
              className="w-1/2 p-2 border border-gray-300 rounded-md bg-white"
              placeholder="分"
              disabled={running}
            />
            <input
              type="number"
              min={0}
              max={59}
              value={freeTimeInput.seconds}
              onChange={(e) =>
                setFreeTimeInput({
                  ...freeTimeInput,
                  seconds: parseInt(e.target.value, 10) || 0,
                })
              }
              className="w-1/2 p-2 border border-gray-300 rounded-md bg-white"
              placeholder="秒"
              disabled={running}
            />
          </div>
        )}
      </div>

      <div className="text-center mb-4">
        <h2 className={`text-lg font-semibold ${getPhaseColor()}`}>
          {getPhaseDisplay()}
        </h2>
      </div>

      <div className="text-center mb-6">
        <div
          className={`text-[120px] font-dseg7 tracking-widest bg-black rounded-lg px-6 py-4 inline-block ${getPhaseColor()}`}
        >
          {formatTime(time)}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {/* setupフェーズで0秒のときはnextPhaseのみ */}
        {!running && phase === "setup" && time === 0 && (
          <button
            onClick={startTimer}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
          >
            開始
          </button>
        )}
        {/* countdownフェーズで止まっているとき */}
        {!running && phase === "countdown" && (
          <button
            onClick={startTimer}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
          >
            開始
          </button>
        )}
        {/* setupフェーズでタイマーが残っているとき */}
        {!running && phase === "setup" && time > 0 && (
          <button
            onClick={startTimer}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
          >
            開始
          </button>
        )}
        {/* running中 */}
        {running && (
          <button
            onClick={pauseTimer}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-2xl font-medium transition-all"
          >
            一時停止
          </button>
        )}
        <button
          onClick={resetTimer}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-medium transition-all"
        >
          リセット
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-600 text-center">
        {matchType === "free" ? (
          <p>自由タイマー: 入力された時間からスタートします</p>
        ) : (
          <p>
            セッティング: {formatMinutes(TIMER_CONFIG.SETUP_TIME)} →
            カウントダウン: {TIMER_CONFIG.COUNTDOWN_TIME}秒 →
            {matchType === "testrun"
              ? `テストラン: ${formatMinutes(TIMER_CONFIG.MATCH_TIMES.testrun)}`
              : `試合: ${formatMinutes(TIMER_CONFIG.MATCH_TIMES.match)}`}
          </p>
        )}
      </div>
    </div>
  );
}
