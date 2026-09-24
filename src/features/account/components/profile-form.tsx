"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { progressKeys } from "@/features/progress/hooks/query-keys";
import { cn } from "@/lib/utils";

import { fieldError, updateProfile } from "../api";
import { DAILY_GOALS, type DailyGoal, type User } from "../types";

type Status = { name: "idle" } | { name: "saving" } | { name: "saved" } | { name: "failed"; error: unknown };

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState(user.display_name);
  const [goal, setGoal] = useState<DailyGoal>(user.daily_goal_xp);
  const [status, setStatus] = useState<Status>({ name: "idle" });

  const unchanged = displayName.trim() === user.display_name && goal === user.daily_goal_xp;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus({ name: "saving" });
    try {
      await updateProfile({
        ...(displayName.trim() !== user.display_name ? { displayName } : {}),
        ...(goal !== user.daily_goal_xp ? { dailyGoalXp: goal } : {}),
      });
      setStatus({ name: "saved" });
      // Tên nằm ở thanh bên (Server Component), mục tiêu nằm trong query tiến
      // độ: cả hai phải đọc lại, nếu không trang báo "đã lưu" mà chỗ khác vẫn cũ.
      router.refresh();
      void queryClient.invalidateQueries({ queryKey: progressKeys.all });
    } catch (error) {
      setStatus({ name: "failed", error });
    }
  }

  const failed = status.name === "failed" ? status.error : undefined;
  const nameError = fieldError(failed, "display_name");

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="display-name">Tên hiển thị</Label>
        <Input
          id="display-name"
          value={displayName}
          onChange={(event) => {
            setDisplayName(event.target.value);
            setStatus({ name: "idle" });
          }}
          maxLength={100}
          aria-invalid={nameError ? true : undefined}
          className="h-11"
        />
        {nameError ? <p className="text-danger text-sm">{nameError}</p> : null}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-medium">Mục tiêu mỗi ngày</legend>
        <div className="grid grid-cols-3 gap-2">
          {DAILY_GOALS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "rounded-card flex cursor-pointer flex-col gap-0.5 border p-3 transition-colors",
                goal === option.value ? "border-brand bg-brand-soft" : "border-border hover:border-brand",
              )}
            >
              <input
                type="radio"
                name="daily-goal"
                value={option.value}
                checked={goal === option.value}
                onChange={() => {
                  setGoal(option.value);
                  setStatus({ name: "idle" });
                }}
                className="sr-only"
              />
              <span className="font-semibold">{option.label}</span>
              <span className="text-muted-foreground text-xs">{option.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={unchanged || status.name === "saving" || displayName.trim() === ""}>
          {status.name === "saving" ? "Đang lưu…" : "Lưu thay đổi"}
        </Button>
        {status.name === "saved" ? <span className="text-success text-sm">Đã lưu</span> : null}
        {failed && !nameError ? (
          <span className="text-danger text-sm">Không lưu được, thử lại sau.</span>
        ) : null}
      </div>
    </form>
  );
}
