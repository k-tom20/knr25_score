import { useState, useCallback } from "react";
import { TeamName, DEFAULT_TEAM_NAMES } from "../constants";

interface UseScoreReturn {
  redScore: number;
  blueScore: number;
  redTeamName: TeamName;
  blueTeamName: TeamName;
  logs: string[];
  updateRedScore: (code: string, delta: number) => void;
  updateBlueScore: (code: string, delta: number) => void;
  setRedTeamName: (name: TeamName) => void;
  setBlueTeamName: (name: TeamName) => void;
  resetRedScore: () => void;
  resetBlueScore: () => void;
  addLog: (message: string, timerDisplay?: string) => void;
  clearLogs: () => void;
}

export const useScore = (): UseScoreReturn => {
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [redTeamName, setRedTeamName] = useState<TeamName>(
    DEFAULT_TEAM_NAMES.RED
  );
  const [blueTeamName, setBlueTeamName] = useState<TeamName>(
    DEFAULT_TEAM_NAMES.BLUE
  );
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string, timerDisplay?: string) => {
    setLogs((prev) => [`[${timerDisplay ?? "--:--"}] ${message}`, ...prev]);
  }, []);

  const updateRedScore = useCallback((code: string, delta: number) => {
    setRedScore((prev) => prev + delta);
  }, []);

  const updateBlueScore = useCallback((code: string, delta: number) => {
    setBlueScore((prev) => prev + delta);
  }, []);

  const resetRedScore = useCallback(() => {
    setRedScore(0);
    addLog(`${redTeamName} のスコアをリセット`);
  }, [redTeamName, addLog]);

  const resetBlueScore = useCallback(() => {
    setBlueScore(0);
    addLog(`${blueTeamName} のスコアをリセット`);
  }, [blueTeamName, addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    redScore,
    blueScore,
    redTeamName,
    blueTeamName,
    logs,
    updateRedScore,
    updateBlueScore,
    setRedTeamName,
    setBlueTeamName,
    resetRedScore,
    resetBlueScore,
    addLog,
    clearLogs,
  };
};
