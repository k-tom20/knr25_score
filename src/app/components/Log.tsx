"use client";
import React from "react";

interface LogProps {
  logs: string[]; // ログの配列
  onClear?: () => void; // ログをクリアするための関数（オプション）
}

export default function Log({ logs, onClear }: LogProps) {
  return (
    <div className="w-[500px] p-4 bg-gray-200 rounded-lg shadow-inner h-64 overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">得点ログ</h3>
        {onClear &&
          logs.length > 0 && ( // クリアボタンが必要な場合のみ表示
            <button
              onClick={onClear}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              クリア
            </button>
          )}
      </div>

      {logs.length === 0 ? ( // ログがない場合の表示
        <div className="text-sm font-mono text-gray-500 flex-1 flex items-center justify-center">
          ログはまだありません
        </div>
      ) : (
        <ul className="text-sm font-mono space-y-1 flex-1">
          {logs.map((log, index) => (
            <li key={index} className="break-words">
              {log}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
