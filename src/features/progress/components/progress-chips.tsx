"use client";

import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";

import { useProgress } from "../hooks/use-progress";
import type { ProgressSnapshot } from "../types";

/**
 * Hai chip trên topbar. Dùng chung query key với màn lộ trình nên bấm xong một
 * bài là XP ở đây nhảy ngay, không đợi dựng lại trang.
 */
export function ProgressChips({
  initialProgress,
}: {
  initialProgress: ProgressSnapshot;
}) {
  const { data } = useProgress(initialProgress);
  const reachedGoal = data.goal_xp > 0 && data.today_xp >= data.goal_xp;

  return (
    <div className="flex items-center gap-1">
      {data.streak_days > 0 ? (
        <span
          title={`${data.streak_days} ngày học liên tiếp`}
          className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold"
        >
          <Flame className="text-brand size-4 fill-current" />
          {data.streak_days}
        </span>
      ) : null}

      <span
        title="XP hôm nay"
        className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold max-[420px]:hidden"
      >
        <span
          className={cn(
            "size-2 rounded-full",
            reachedGoal ? "bg-success" : "bg-muted-foreground/40",
          )}
        />
        {data.today_xp}/{data.goal_xp} XP
      </span>
    </div>
  );
}
