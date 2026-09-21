"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";

import { useLogin } from "../hooks/use-login";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, error } = useLogin(redirectTo);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate({ email, password });
  }

  const fieldErrors = error instanceof ApiError ? error.details : {};

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={fieldErrors.email !== undefined}
        />
        {fieldErrors.email ? (
          <p className="text-destructive text-sm">{fieldErrors.email}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={fieldErrors.password !== undefined}
        />
        {fieldErrors.password ? (
          <p className="text-destructive text-sm">{fieldErrors.password}</p>
        ) : null}
      </div>

      {/* Lỗi không gắn với field nào — chủ yếu là sai email hoặc mật khẩu. */}
      {error && Object.keys(fieldErrors).length === 0 ? (
        <p className="text-destructive text-sm" role="alert">
          {error.message}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Đang đăng nhập…" : "Đăng nhập"}
      </Button>
    </form>
  );
}
