export const TEAM_NAMES = [
  "選択して下さい",
  "大阪大学 Robohan",
  "京都大学 京大機械研究会",
  "京都工芸繊維大学 ForteFibre",
  "京都先端科学技術大学 KUASロボコン",
  "富山大学 TomiRobo",
  "立命館大学 RRST",
] as const;
export type TeamName = (typeof TEAM_NAMES)[number];

// 初期チーム名の定義
export const DEFAULT_TEAM_NAMES = {
  RED: "赤チーム" as TeamName,
  BLUE: "青チーム" as TeamName,
} as const;

// チームカラーの定義
export const TEAM_COLORS = ["red", "blue"] as const;
export type TeamColor = (typeof TEAM_COLORS)[number];

// 試合形式の定義
export const MATCH_TYPES = ["testrun", "match", "free"] as const;
export type MatchType = (typeof MATCH_TYPES)[number];

// 試合のフェーズの定義
export const PHASES = ["setup", "countdown", "running", "finished"] as const;
export type Phase = (typeof PHASES)[number];

// 試合のフェーズごとの時間設定
export const TIMER_CONFIG = {
  SETUP_TIME: 60,
  COUNTDOWN_TIME: 5,
  MATCH_TIMES: {
    testrun: 300,
    match: 180,
    free: 0,
  },
} as const;

/* 
   得点条件の定義(ルールブック準拠)
   Hはmax20点
*/
export const SCORING_CONDITIONS = [
  { code: "A", description: "手動で1階建て", point: 20 },
  { code: "B", description: "手動で2階建て", point: 30 },
  { code: "C", description: "手動で3階建て", point: 50 },
  { code: "D", description: "自動で1階建て", point: 30 },
  { code: "E", description: "自動で2階建て", point: 40 },
  { code: "F", description: "自動で3階建て", point: 50 },
  { code: "G", description: "建築後の倒壊", point: -30 },
  { code: "H", description: "餅がエリア3に接地", point: 2 },
  { code: "I", description: "餅を散餅場に投げ入れ", point: 10 },
] as const;

// 試合のフェーズごとの表示名
export const PHASE_DISPLAYS = {
  setup: "セッティングタイム",
  countdown: "カウントダウン",
  running: {
    testrun: "テストラン中",
    match: "試合中",
    free: "自由タイマー",
  },
  finished: "終了",
} as const;

// 試合のフェーズごとの色
export const PHASE_COLORS = {
  setup: "text-blue-600",
  countdown: "text-yellow-600",
  running: "text-green-600",
  finished: "text-red-600",
} as const;
