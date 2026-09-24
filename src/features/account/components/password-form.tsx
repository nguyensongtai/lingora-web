"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";

import { changePassword, fieldError } from "../api";

/** Khớp MinPasswordLen của API; chỉ để báo sớm, API vẫn là nơi kiểm. */
const MIN_PASSWORD_LENGTH = 12;

type Status = { name: "idle" } | { name: "saving" } | { name: "saved" } | { name: "failed"; error: unknown };

export function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<Status>({ name: "idle" });

  const mismatch = confirm !== "" && confirm !== next;
  const tooShort = next !== "" && next.length < MIN_PASSWORD_LENGTH;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (mismatch || tooShort) {
      return;
    }
    setStatus({ name: "saving" });
    try {
      await changePassword({ currentPassword: current, newPassword: next });
      setCurrent("");
      setNext("");
      setConfirm("");
      setStatus({ name: "saved" });
    } catch (error) {
      setStatus({ name: "failed", error });
    }
  }

  const failed = status.name === "failed" ? status.error : undefined;
  const currentError = fieldError(failed, "current_password");
  const nextError = fieldError(failed, "new_password");
  const limited = failed instanceof ApiError && failed.status === 429;

  function field(
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    autoComplete: string,
    error?: string,
  ) {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          type="password"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setStatus({ name: "idle" });
          }}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          className="h-11"
        />
        {error ? <p className="text-danger text-sm">{error}</p> : null}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {field("current-password", "Mật khẩu hiện tại", current, setCurrent, "current-password", currentError)}
      {field(
        "new-password",
        "Mật khẩu mới",
        next,
        setNext,
        "new-password",
        nextError ?? (tooShort ? `Cần ít nhất ${MIN_PASSWORD_LENGTH} ký tự` : undefined),
      )}
      {field(
        "confirm-password",
        "Nhập lại mật khẩu mới",
        confirm,
        setConfirm,
        "new-password",
        mismatch ? "Hai lần nhập chưa khớp" : undefined,
      )}

      <p className="text-muted-foreground text-sm">
        Đổi xong, mọi thiết bị khác đang đăng nhập tài khoản này sẽ bị đăng xuất.
      </p>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={!current || !next || !confirm || mismatch || tooShort || status.name === "saving"}
        >
          {status.name === "saving" ? "Đang đổi…" : "Đổi mật khẩu"}
        </Button>
        {status.name === "saved" ? (
          <span className="text-success text-sm">Đã đổi mật khẩu</span>
        ) : null}
        {limited ? (
          <span className="text-danger text-sm">Sai quá nhiều lần, thử lại sau ít phút.</span>
        ) : failed && !currentError && !nextError ? (
          <span className="text-danger text-sm">Không đổi được, thử lại sau.</span>
        ) : null}
      </div>
    </form>
  );
}
