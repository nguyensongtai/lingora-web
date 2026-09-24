import type { components } from "@/lib/api/schema";

export type User = components["schemas"]["User"];
export type DailyGoal = User["daily_goal_xp"];

/** Ba mức mục tiêu; khớp enum daily_goal_xp của API. */
export const DAILY_GOALS: readonly { value: DailyGoal; label: string; hint: string }[] = [
  { value: 20, label: "20 XP", hint: "Một bài mỗi ngày" },
  { value: 50, label: "50 XP", hint: "Khoảng ba bài" },
  { value: 100, label: "100 XP", hint: "Năm bài trở lên" },
];
