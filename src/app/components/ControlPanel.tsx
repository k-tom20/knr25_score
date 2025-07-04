"use client";
import React from "react";
import {
  TEAM_NAMES,
  SCORING_CONDITIONS,
  TeamName,
  TeamColor,
} from "../constants";

interface ControlPanelProps {
  teamName: TeamName;
  onTeamNameChange: (name: TeamName) => void;
  onScoreChange: (code: string, delta: number) => void;
  onLog?: (log: string) => void;
  teamColor?: TeamColor;
  showTeamSelect?: boolean;
  layout?: "1xN" | "2xN";
}

export default function ControlPanel({
  teamName,
  onTeamNameChange,
  onScoreChange,
  onLog,
  teamColor,
  showTeamSelect = true,
  layout = "1xN",
}: ControlPanelProps) {
  const bgColor = teamColor === "red" ? "bg-red-100" : "bg-blue-100";

  const handleScoreChange = (
    code: string,
    point: number,
    isPositive: boolean
  ) => {
    const delta = isPositive ? point : -point;
    onScoreChange(code, delta);
    onLog?.(
      `${teamName} ${isPositive ? "+" : ""}${delta} 点: ${SCORING_CONDITIONS.find((item) => item.code === code)?.description}`
    );
  };
  const isTwoColumn = layout === "2xN";

  const manualConditions = SCORING_CONDITIONS.filter((item) =>
    item.description.includes("手動")
  );
  const autoConditions = SCORING_CONDITIONS.filter((item) =>
    item.description.includes("自動")
  );
  const otherConditions = SCORING_CONDITIONS.filter(
    (item) =>
      !item.description.includes("手動") && !item.description.includes("自動")
  );

  const firstColumn = [...manualConditions];
  const secondColumn = [...autoConditions];

  // 残りの項目を両方のカラムに均等に分配
  otherConditions.forEach((item, index) => {
    if (firstColumn.length <= secondColumn.length) {
      firstColumn.push(item);
    } else {
      secondColumn.push(item);
    }
  });

  return (
    <div
      className={`flex w-[600px] flex-col items-center justify-center p-4 rounded-lg shadow-md border ${bgColor}`}
    >
      {showTeamSelect && onTeamNameChange && (
        <select
          value={teamName}
          onChange={(e) => onTeamNameChange(e.target.value as TeamName)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500"
        >
          {TEAM_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}

      <div
        className={`w-full mt-4 ${layout === "2xN" ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"}`}
      >
        {layout === "2xN" ? (
          <>
            <div className="flex flex-col gap-2">
              {firstColumn.map((item) => (
                <div
                  key={`${item.code}-first`}
                  className={`flex items-center justify-between border border-gray-300 rounded-full px-4 py-8 bg-white text-black shadow-sm`}
                >
                  <button
                    onClick={() => handleScoreChange(item.code, item.point, true)}
                    className="bg-green-500 text-white text-lg font-bold rounded-full w-10 h-10 hover:bg-green-600 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-center flex-1 px-2">
                    {item.description}（{item.point}）
                  </span>
                  <button
                    onClick={() => handleScoreChange(item.code, item.point, false)}
                    className="bg-gray-500 text-white text-lg font-bold rounded-full w-10 h-10 hover:bg-red-600 transition-colors"
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {secondColumn.map((item) => (
                <div
                  key={`${item.code}-second`}
                  className={`flex items-center justify-between border border-gray-300 rounded-full px-4 py-8 bg-white text-black shadow-sm`}
                >
                  <button
                    onClick={() => handleScoreChange(item.code, item.point, true)}
                    className="bg-green-500 text-white text-lg font-bold rounded-full w-10 h-10 hover:bg-green-600 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-center flex-1 px-2">
                    {item.description}（{item.point}）
                  </span>
                  <button
                    onClick={() => handleScoreChange(item.code, item.point, false)}
                    className="bg-gray-500 text-white text-lg font-bold rounded-full w-10 h-10 hover:bg-red-600 transition-colors"
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          SCORING_CONDITIONS.map((item) => (
            <div
              key={item.code}
              className={`flex items-center justify-between border border-gray-300 rounded-full px-4 py-2 bg-white text-black shadow-sm`}
            >
              <button
                onClick={() => handleScoreChange(item.code, item.point, true)}
                className="bg-green-500 text-white text-lg font-bold rounded-full w-10 h-10 hover:bg-green-600 transition-colors"
              >
                +
              </button>
              <span className="text-sm text-center flex-1 px-2">
                {item.description}（{item.point}）
              </span>
              <button
                onClick={() => handleScoreChange(item.code, item.point, false)}
                className="bg-gray-500 text-white text-lg font-bold rounded-full w-10 h-10 hover:bg-red-600 transition-colors"
              >
                -
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
