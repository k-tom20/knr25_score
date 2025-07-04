import { create } from "zustand";
import { TeamName, TeamColor } from "../app/constants";

interface ScoreState {
  scores: Record<TeamColor, number>;
  teamNames: Record<TeamColor, TeamName>;
  logs: string[];
  setTeamName: (color: TeamColor, name: TeamName) => void;
  updateScore: (color: TeamColor, delta: number, description: string) => void;
  resetScore: (color: TeamColor) => void;
  clearLogs: () => void;
}

export const useScoreStore = create<ScoreState>((set) => ({
  scores: { red: 0, blue: 0 },
  teamNames: { red: "選択して下さい", blue: "選択して下さい" },
  logs: [],
  setTeamName: (color, name) =>
    set((state) => ({
      teamNames: { ...state.teamNames, [color]: name },
    })),
  updateScore: (color, delta, description) =>
    set((state) => ({
      scores: { ...state.scores, [color]: state.scores[color] + delta },
      logs: [
        ...state.logs,
        `${state.teamNames[color]} ${delta > 0 ? "+" : ""}${delta}点: ${description}`,
      ],
    })),
  resetScore: (color) =>
    set((state) => ({
      scores: { ...state.scores, [color]: 0 },
    })),
  clearLogs: () => set({ logs: [] }),
}));
